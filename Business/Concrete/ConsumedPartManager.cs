﻿using Business.Abstract;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Transaction;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using FluentValidation;
using System.Collections.Generic;
using System.Linq;

namespace Business.Concrete
{
    public class ConsumedPartManager : IConsumedPartService
    {
        IConsumedPartDal _consumedPartDal;
        IInventoryService _inventoryService;

        public ConsumedPartManager(IConsumedPartDal consumedPartDal, IInventoryService inventoryService)
        {
            _consumedPartDal = consumedPartDal;
            _inventoryService = inventoryService;
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

            _consumedPartDal.Add(consumedPart);
            
            _inventoryService.Update(new Inventory 
            { 
                InventoryId = inventory.InventoryId,
                ProductId = inventory.ProductId,
                PurchasePrice = inventory.PurchasePrice,
                SellPrice = inventory.SellPrice,
                UnitsInStock = (inventory.UnitsInStock - consumedPart.Quantity),
                Status = inventory.Status
            });
            return new SuccessResult(Messages.ConsumedPartAdded);
        }

        [CacheRemoveAspect("IConsumedPartService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<ConsumedPart>(Messages.IdValueIsInvalid);
            }

            var consumedPart = _consumedPartDal.Get(c => c.ConsumedPartId == id);
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
        
        [CacheAspect]
        public IDataResult<List<ConsumedPart>> GetList()
        {
            return new SuccessDataResult<List<ConsumedPart>>(_consumedPartDal.GetList().ToList());
        }

        [ValidationAspect(typeof(ConsumedPartValidator))]
        [CacheRemoveAspect("IConsumedPartService.Get")]
        public IResult Update(ConsumedPart consumedPart)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(consumedPart.ConsumedPartId));

            if (result != null)
            {
                return new ErrorDataResult<ConsumedPart>(Messages.IdValueIsInvalid);
            }

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
    }
}
