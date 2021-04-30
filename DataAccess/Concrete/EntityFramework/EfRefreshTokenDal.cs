using Core.DataAccess.EntityFramework;
using Core.Utilities.Security.Jwt;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;

namespace DataAccess.Concrete.EntityFramework
{
    public class EfRefreshTokenDal : EfEntityRepositoryBase<RefreshToken, BicycleServiceCenterContext>, IRefreshTokenDal
    {
    }
}
