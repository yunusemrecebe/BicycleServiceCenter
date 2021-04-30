using Core.Entities.Concrete;
using Core.Utilities.Results;
using Core.Utilities.Security.Jwt;
using Entities.Dtos;

namespace Business.Abstract
{
    public interface IAuthService
    {
        IDataResult<User> Register(UserForRegisterDto userForRegisterDto, string password);
        IDataResult<User> Login(UserForLoginDto userForLoginDto);
        IResult UserExists(string email);
        IDataResult<Token> CreateAccessToken(User user);
        IDataResult<RefreshToken> CreateRefreshToken(Token token, int userId);
        IDataResult<Token> CreateAccessTokenByRefreshToken(string refreshToken);
        IResult RevokeRefreshToken(string refreshToken);
    }
}
