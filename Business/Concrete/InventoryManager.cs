using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Linq;
using System.Collections.Generic;
using Core.Aspects.Autofac.Validation;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Utilities.Business;
using FluentValidation;
using Entities.Dtos;
using System;
using System.Linq.Expressions;

namespace Business.Concrete
{
    public class InventoryManager : IInventoryService
    {
        IInventoryDal _inventoryDal;

        public InventoryManager(IInventoryDal inventoryDal)
        {
            _inventoryDal = inventoryDal;
        }

        [ValidationAspect(typeof(InventoryValidator))]
        [CacheRemoveAspect("IInventoryService.Get")]
        public IResult Add(Inventory inventory)
        {
            _inventoryDal.Add(inventory);
            return new SuccessResult(Messages.InventoryAdded);
        }

        [CacheRemoveAspect("IInventoryService.Get")]
        public IResult Delete(int id)
        {
            var inventory = _inventoryDal.Get(i => i.InventoryId == id);
            _inventoryDal.Delete(inventory);
            return new SuccessResult(Messages.InventoryDeleted); 
        }

        public IDataResult<Inventory> GetById(int id)
        {
            return new SuccessDataResult<Inventory>(_inventoryDal.Get(i => i.InventoryId == id));
        }

        public IDataResult<Inventory> GetByProductId(int id)
        {
            return new SuccessDataResult<Inventory>(_inventoryDal.Get(i => i.ProductId == id));
        }

        public IDataResult<List<InventoryDetailDto>> GetInventoryDetails()
        {
            return new SuccessDataResult<List<InventoryDetailDto>>(_inventoryDal.GetInventoryDetails().ToList());
        }

        public IDataResult<InventoryDetailDto> GetInventoryDetailsById(int id)
        {
            return new SuccessDataResult<InventoryDetailDto>(_inventoryDal.GetInventoryDetailsById(id));
        }

        [CacheAspect]
        public IDataResult<List<Inventory>> GetList()
        {
            return new SuccessDataResult<List<Inventory>>(_inventoryDal.GetList().ToList());
        }

        public IDataResult<List<Inventory>> GetListByFilter(Expression<Func<Inventory, bool>> filter)
        {
            return new SuccessDataResult<List<Inventory>>(_inventoryDal.GetList(filter).ToList());
        }

        [ValidationAspect(typeof(InventoryValidator))]
        [CacheRemoveAspect("IInventoryService.Get")]
        public IResult Update(Inventory inventory)
        {
            if (inventory.UnitsInStock > 0)
            {
                inventory.Status = true;
            }

            _inventoryDal.Update(inventory);
            return new SuccessResult(Messages.InventoryUpdated);
        }
    }
}
