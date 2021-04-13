using Core.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IInventoryService
    {
        IDataResult<List<Inventory>> GetList();
        IDataResult<Inventory> GetById(int id);
        IResult Add(Inventory inventory);
        IResult Update(Inventory inventory);
        IResult Delete(int id);
    }
}
