using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfServiceDal : EfEntityRepositoryBase<Service, BicycleServiceCenterContext>, IServiceDal
    {

    }
}
