using Business.Abstract;
using Core.Utilities.Results;
using Core.Utilities.Security.Jwt;
using DataAccess.Abstract;

namespace Business.Concrete
{
    public class RefreshTokenManager : IRefreshTokenService
    {
        IRefreshTokenDal _refreshTokenDal;

        public RefreshTokenManager(IRefreshTokenDal refreshTokenDal)
        {
            _refreshTokenDal = refreshTokenDal;
        }

        public IResult Add(RefreshToken refreshToken)
        {
            _refreshTokenDal.Add(refreshToken);
            return new SuccessResult();
        }

        public IResult Delete(RefreshToken refreshToken)
        {
            _refreshTokenDal.Delete(refreshToken);
            return new SuccessResult();
        }

        public IDataResult<RefreshToken> GetByToken(string refreshToken)
        {
            var result = _refreshTokenDal.Get(x => x.Token == refreshToken);
            return new SuccessDataResult<RefreshToken>(result);
        }

        public IDataResult<RefreshToken> GetByUserId(int id)
        {
            var result = _refreshTokenDal.Get(x=> x.UserId == id);
            return new SuccessDataResult<RefreshToken>(result);
        }

        public IResult Update(RefreshToken refreshToken)
        {
            _refreshTokenDal.Update(refreshToken);
            return new SuccessResult();
        }
    }
}
