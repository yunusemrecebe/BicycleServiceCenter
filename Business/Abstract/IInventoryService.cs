using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Business.Abstract
{
    public interface IInventoryService
    {
        IDataResult<List<Inventory>> GetList();
        IDataResult<List<Inventory>> GetListByFilter(Expression<Func<Inventory, bool>> filter);
        IDataResult<List<InventoryDetailDto>> GetInventoryDetails();
        IDataResult<InventoryDetailDto> GetInventoryDetailsById(int id);
        IDataResult<Inventory> GetById(int id);
        IDataResult<Inventory> GetByProductId(int id);
        IResult Add(Inventory inventory);
        IResult Update(Inventory inventory);
        IResult Delete(int id);
    }
}
