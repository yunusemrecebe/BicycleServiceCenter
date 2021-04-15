using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace DataAccess.Abstract
{
    public interface IInventoryDal : IEntityRepository<Inventory>
    {
        List<InventoryDetailDto> GetInventoryDetails();
        InventoryDetailDto GetInventoryDetailsById(int id);
    }
}
