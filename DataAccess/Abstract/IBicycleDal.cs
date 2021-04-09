using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace DataAccess.Abstract
{
    public interface IBicycleDal : IEntityRepository<Bicycle>
    {
        List<BicycleDetailDto> GetBicycleDetails();
        List<BicycleDetailDto> GetBicycleDetailsById(int id);
    }
}
