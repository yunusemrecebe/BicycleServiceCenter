using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfBicycleModelDal : EfEntityRepositoryBase<BicycleModel, BicycleServiceCenterContext>, IBicycleModelDal
    {

    }
}
