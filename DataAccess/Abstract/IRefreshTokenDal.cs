using Core.DataAccess;
using Core.Utilities.Security.Jwt;

namespace DataAccess.Abstract
{
    public interface IRefreshTokenDal : IEntityRepository<RefreshToken>
    {
    }
}
