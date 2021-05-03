﻿using Business.Abstract;
using Business.BusinessAspects.Autofac;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Transaction;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using FluentValidation;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Business.Concrete
{
    public class ConsumedPartManager : IConsumedPartService
    {
        IConsumedPartDal _consumedPartDal;
        IInventoryService _inventoryService;
        IProcessChargeService _processChargeService;

        public ConsumedPartManager(IConsumedPartDal consumedPartDal, IInventoryService inventoryService, IProcessChargeService processChargeService)
        {
            _consumedPartDal = consumedPartDal;
            _inventoryService = inventoryService;
            _processChargeService = processChargeService;
        }

        [ValidationAspect(typeof(ConsumedPartValidator))]
        [CacheRemoveAspect("IConsumedPartService.Get")]
        public IResult Add(ConsumedPart consumedPart)
        {
            var inventory = _inventoryService.GetByProductId(consumedPart.ProductId).Data;
            var remainingUnitsInStock = inventory.UnitsInStock - consumedPart.Quantity;

            IResult result = BusinessRules.Run(CheckUnitsInStock(inventory.UnitsInStock, remainingUnitsInStock));

            if (result != null)
            {
                return result;
            }

            if (consumedPart.Discount > 0)
            {
                consumedPart.UnitPrice = inventory.SellPrice - (inventory.SellPrice / 100) * (decimal)consumedPart.Discount;
            }
            else
            {
                consumedPart.UnitPrice = inventory.SellPrice;
            }

            _consumedPartDal.Add(consumedPart);

            _processChargeService.Add(new ProcessCharge 
            { 
                ConsumedPartId = consumedPart.ConsumedPartId, 
                Charge = consumedPart.UnitPrice * consumedPart.Quantity 
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

            return new SuccessResult(Messages.ConsumedPartAdded);
        }

        [CacheRemoveAspect("IConsumedPartService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return result;
            }

            var consumedPart = _consumedPartDal.Get(c => c.ConsumedPartId == id);
            var inventory = _inventoryService.GetByProductId(consumedPart.ProductId).Data;
            var processCharge = _processChargeService.GetByConsumedPartId(consumedPart.ConsumedPartId).Data;

            inventory.UnitsInStock += consumedPart.Quantity;
            
            _inventoryService.Update(inventory);
            _processChargeService.Delete(processCharge.ProcessChargeId);
            _consumedPartDal.Delete(consumedPart);

            return new SuccessResult(Messages.ConsumedPartDeleted);
        }

        public IDataResult<ConsumedPart> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<ConsumedPart>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ConsumedPart>(_consumedPartDal.Get(c => c.ConsumedPartId == id));
        }

        public IDataResult<ConsumedPart> GetByProductId(int id)
        {
            return new SuccessDataResult<ConsumedPart>(_consumedPartDal.Get(p => p.ProductId == id));
        }

        [SecuredOperation("Admin")]
        public IDataResult<ConsumedPartDetailDto> GetConsumedPartDetailsById(int id)
        {
            return new SuccessDataResult<ConsumedPartDetailDto>(_consumedPartDal.GetConsumedPartDetails(c => c.ConsumedPartId == id));
        }

        [SecuredOperation("Admin")]
        [CacheAspect]
        public IDataResult<List<ConsumedPartDetailDto>> GetConsumedPartDetailsList()
        {
            return new SuccessDataResult<List<ConsumedPartDetailDto>>(_consumedPartDal.GetConsumedPartDetailsList().ToList());
        }

        public IDataResult<List<ConsumedPartDetailDto>> GetConsumedPartDetailsListByProcessId(int id)
        {
            return new SuccessDataResult<List<ConsumedPartDetailDto>>(_consumedPartDal.GetConsumedPartDetailsList(c => c.ProcessId == id).ToList());
        }

        [CacheAspect]
        public IDataResult<List<ConsumedPart>> GetList()
        {
            return new SuccessDataResult<List<ConsumedPart>>(_consumedPartDal.GetList().ToList());
        }

        [ValidationAspect(typeof(ConsumedPartValidator))]
        [CacheRemoveAspect("IConsumedPartService.Get")]
        public IResult Update(ConsumedPart consumedPart)
        {
            var currentConsumedPart = GetById(consumedPart.ConsumedPartId).Data;
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(consumedPart.ConsumedPartId), UpdateStockInInventory(consumedPart, currentConsumedPart));

            if (result != null)
            {
                return new ErrorDataResult<ConsumedPart>(Messages.IdValueIsInvalid);
            }

            var inventory = _inventoryService.GetByProductId(consumedPart.ProductId).Data;
            consumedPart.UnitPrice = inventory.SellPrice - (inventory.SellPrice / 100) * (decimal)consumedPart.Discount;

            var processCharge = _processChargeService.GetByConsumedPartId(consumedPart.ConsumedPartId).Data;
            processCharge.Charge = consumedPart.Quantity * consumedPart.UnitPrice;
            _processChargeService.Update(processCharge);

            _consumedPartDal.Update(consumedPart);
            return new SuccessResult(Messages.ConsumedPartUpdated);
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _consumedPartDal.Get(x => x.ConsumedPartId == id);

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

        private IResult UpdateStockInInventory(ConsumedPart consumedPart, ConsumedPart currentConsumedPart)
        {
            var accrual = consumedPart.Quantity - currentConsumedPart.Quantity;
            var inventoryRecord = _inventoryService.GetByProductId(consumedPart.ProductId).Data;

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
