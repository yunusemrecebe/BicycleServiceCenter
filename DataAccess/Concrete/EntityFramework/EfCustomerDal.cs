using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfCustomerDal : EfEntityRepositoryBase<Customer, BicycleServiceCenterContext>, ICustomerDal
    {

    }
}
