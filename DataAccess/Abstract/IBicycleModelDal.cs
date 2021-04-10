using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace DataAccess.Abstract
{
    public interface IBicycleModelDal : IEntityRepository<BicycleModel>
    {
        List<BicycleModelDto> GetBicycleModelDetails();
        BicycleModelDto GetBicycleModelDetailsById(int id);
    }
}
