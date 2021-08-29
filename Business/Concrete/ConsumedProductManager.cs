using Business.Abstract;
using Business.BusinessAspects.Autofac;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Business.Concrete
{
    [SecuredOperation]
    public class ConsumedProductManager : IConsumedProductService
    {
        IConsumedProductDal _consumedProductDal;
        IInventoryService _inventoryService;
        IProcessChargeService _processChargeService;

        public ConsumedProductManager(IConsumedProductDal consumedProductDal, IInventoryService inventoryService, IProcessChargeService processChargeService)
        {
            _consumedProductDal = consumedProductDal;
            _inventoryService = inventoryService;
            _processChargeService = processChargeService;
        }

        [ValidationAspect(typeof(ConsumedProductValidator))]
        [CacheRemoveAspect("IConsumedProductService.Get")]
        public IResult Add(ConsumedProduct consumedProduct)
        {
            var inventory = _inventoryService.GetByProductId(consumedProduct.ProductId).Data;
            var remainingUnitsInStock = inventory.UnitsInStock - consumedProduct.Quantity;

            IResult result = BusinessRules.Run(CheckUnitsInStock(inventory.UnitsInStock, remainingUnitsInStock));

            if (result != null)
            {
                return result;
            }

            if (consumedProduct.Discount > 0)
            {
                consumedProduct.UnitPrice = inventory.SellPrice - (inventory.SellPrice / 100) * (decimal)consumedProduct.Discount;
            }
            else
            {
                consumedProduct.UnitPrice = inventory.SellPrice;
            }
            
            consumedProduct.DateOfUse = DateTime.Now;
            _consumedProductDal.Add(consumedProduct);

            _processChargeService.Add(new ProcessCharge 
            { 
                ConsumedProductId = consumedProduct.ConsumedProductId, 
                ProcessId = consumedProduct.ProcessId,
                Charge = consumedProduct.UnitPrice * consumedProduct.Quantity 
            });

            _inventoryService.Update(new Inventory
            {
                InventoryId = inventory.InventoryId,
                ProductId = inventory.ProductId,
                PurchasePrice = inventory.PurchasePrice,
                SellPrice = inventory.SellPrice,
                UnitsInStock = remainingUnitsInStock,
                Status = remainingUnitsInStock == 0 ? false : true
            });

            return new SuccessResult(Messages.ConsumedProductAdded);
        }

        [CacheRemoveAspect("IConsumedProductService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return result;
            }

            var consumedProduct = _consumedProductDal.Get(c => c.ConsumedProductId == id);
            var inventory = _inventoryService.GetByProductId(consumedProduct.ProductId).Data;
            var processCharge = _processChargeService.GetByConsumedProductId(consumedProduct.ConsumedProductId).Data;

            inventory.UnitsInStock += consumedProduct.Quantity;
            
            _inventoryService.Update(inventory);
            _processChargeService.Delete(processCharge.ProcessChargeId);
            _consumedProductDal.Delete(consumedProduct);

            return new SuccessResult(Messages.ConsumedProductDeleted);
        }

        public IDataResult<ConsumedProduct> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<ConsumedProduct>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ConsumedProduct>(_consumedProductDal.Get(c => c.ConsumedProductId == id));
        }

        public IDataResult<ConsumedProduct> GetByProductId(int id)
        {
            return new SuccessDataResult<ConsumedProduct>(_consumedProductDal.Get(p => p.ProductId == id));
        }

        public IDataResult<ConsumedProductDetailDto> GetConsumedProductDetailsById(int id)
        {
            return new SuccessDataResult<ConsumedProductDetailDto>(_consumedProductDal.GetConsumedProductDetails(c => c.ConsumedProductId == id));
        }

        [CacheAspect]
        public IDataResult<List<ConsumedProductDetailDto>> GetConsumedProductDetailsList()
        {
            return new SuccessDataResult<List<ConsumedProductDetailDto>>(_consumedProductDal.GetConsumedProductDetailsList().ToList());
        }

        public IDataResult<List<ConsumedProductDetailDto>> GetConsumedProductDetailsListByProcessId(int id)
        {
            return new SuccessDataResult<List<ConsumedProductDetailDto>>(_consumedProductDal.GetConsumedProductDetailsList(c => c.ProcessId == id).ToList());
        }

        [CacheAspect]
        public IDataResult<List<ConsumedProduct>> GetList()
        {
            return new SuccessDataResult<List<ConsumedProduct>>(_consumedProductDal.GetList().ToList());
        }

        [ValidationAspect(typeof(ConsumedProductValidator))]
        [CacheRemoveAspect("IConsumedProductService.Get")]
        public IResult Update(ConsumedProduct consumedProduct)
        {
            var currentConsumedProduct = GetById(consumedProduct.ConsumedProductId).Data;
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(consumedProduct.ConsumedProductId), UpdateStockInInventory(consumedProduct, currentConsumedProduct));

            if (result != null)
            {
                return new ErrorDataResult<ConsumedProduct>(Messages.IdValueIsInvalid);
            }

            var inventory = _inventoryService.GetByProductId(consumedProduct.ProductId).Data;
            consumedProduct.UnitPrice = inventory.SellPrice - (inventory.SellPrice / 100) * (decimal)consumedProduct.Discount;
            consumedProduct.DateOfUse = currentConsumedProduct.DateOfUse;

            var processCharge = _processChargeService.GetByConsumedProductId(consumedProduct.ConsumedProductId).Data;
            processCharge.Charge = consumedProduct.Quantity * consumedProduct.UnitPrice;
            _processChargeService.Update(processCharge);

            _consumedProductDal.Update(consumedProduct);
            return new SuccessResult(Messages.ConsumedProductUpdated);
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _consumedProductDal.Get(x => x.ConsumedProductId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }

        private IResult CheckUnitsInStock(int unitsInStock, int remainingUnitsInStock)
        {

            if (unitsInStock <= 0 || 0 > remainingUnitsInStock)
            {
                throw new ValidationException(Messages.insufficientStock);
            }

            return new SuccessResult();
        }

        private IResult UpdateStockInInventory(ConsumedProduct consumedProduct, ConsumedProduct currentConsumedProduct)
        {
            var accrual = consumedProduct.Quantity - currentConsumedProduct.Quantity;
            var inventoryRecord = _inventoryService.GetByProductId(consumedProduct.ProductId).Data;

            if (accrual > inventoryRecord.UnitsInStock)
            {
                throw new ValidationException(Messages.insufficientStock);
            }

            inventoryRecord.UnitsInStock = inventoryRecord.UnitsInStock + (-1 * accrual);
            

            _inventoryService.Update(inventoryRecord);
            return new SuccessResult();
        }
    }
}
