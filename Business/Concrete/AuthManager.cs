using Business.Abstract;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Validation;
using Core.Entities.Concrete;
using Core.Utilities.Results;
using Core.Utilities.Security.Hashing;
using Core.Utilities.Security.Jwt;
using Entities.Dtos;

namespace Business.Concrete
{
    public class AuthManager : IAuthService
    {
        IUserService _userService;
        ITokenHelper _tokenHelper;
        IRefreshTokenService _refreshTokenService;

        public AuthManager(IUserService userService, ITokenHelper tokenHelper, IRefreshTokenService refreshTokenService)
        {
            _userService = userService;
            _tokenHelper = tokenHelper;
            _refreshTokenService = refreshTokenService;
        }

        public IDataResult<Token> CreateAccessToken(User user)
        {
            var claims = _userService.GetClaims(user);
            var accessToken = _tokenHelper.CreateToken(user, claims);
            return new SuccessDataResult<Token>(accessToken, Messages.AccessTokenCreated);
        }

        public IDataResult<RefreshToken> CreateRefreshToken(Token token, int userId)
        {
            var refreshToken = _refreshTokenService.GetByUserId(userId).Data;

            if (refreshToken == null)
            {
                _refreshTokenService.Add(new RefreshToken { UserId = userId, Token = token.RefreshToken, Expiration = token.RefreshTokenExpiration });
            }
            else
            {
                refreshToken.UserId = userId;
                refreshToken.Token = token.RefreshToken;
                refreshToken.Expiration = token.RefreshTokenExpiration;
                _refreshTokenService.Update(refreshToken);
            }

            return new SuccessDataResult<RefreshToken>(refreshToken);
        }

        public IDataResult<Token> CreateAccessTokenByRefreshToken(string refreshToken)
        {
            var existingRefreshToken = _refreshTokenService.GetByToken(refreshToken).Data;

            if (existingRefreshToken == null)
            {
                return new ErrorDataResult<Token>(Messages.RefreshTokenNotFound);
            }

            var user = _userService.GetByUserId(existingRefreshToken.UserId).Data;

            if (user == null)
            {
                return new ErrorDataResult<Token>(Messages.UserNotFound);
            }

            var userClaims = _userService.GetClaims(user);
            var accessToken = _tokenHelper.CreateToken(user, userClaims);

            existingRefreshToken.Token = accessToken.RefreshToken;
            existingRefreshToken.Expiration = accessToken.RefreshTokenExpiration;
            _refreshTokenService.Update(existingRefreshToken);

            return new SuccessDataResult<Token>(accessToken);
        }

        public IResult RevokeRefreshToken(string refreshToken)
        {
            var existingRefreshToken = _refreshTokenService.GetByToken(refreshToken).Data;

            if (existingRefreshToken == null)
            {
                return new ErrorDataResult<Token>(Messages.RefreshTokenNotFound);
            }

            _refreshTokenService.Delete(existingRefreshToken);
            return new SuccessResult();
        }

        [ValidationAspect(typeof(UserForLoginValidation))]
        public IDataResult<User> Login(UserForLoginDto userForLoginDto)
        {
            var userToCheck = _userService.GetByMail(userForLoginDto.Email);
            if (userToCheck == null)
            {
                return new ErrorDataResult<User>(Messages.UserNotFound);
            }

            if (!HashingHelper.VerifyPasswordHash(userForLoginDto.Password, userToCheck.PasswordHash, userToCheck.PasswordSalt))
            {
                return new ErrorDataResult<User>(Messages.UserNotFound);
            }

            return new SuccessDataResult<User>(userToCheck, Messages.SuccessfulLogin);
        }

        [ValidationAspect(typeof(UserForRegisterValidator))]
        public IDataResult<User> Register(UserForRegisterDto userForRegisterDto, string password)
        {
            byte[] passwordHash, passwordSalt;
            HashingHelper.CreatePasswordHash(password, out passwordHash, out passwordSalt);
            var user = new User()
            {
                Email = userForRegisterDto.Email,
                FirstName = userForRegisterDto.FirstName,
                LastName = userForRegisterDto.LastName,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Status = true
            };
            _userService.Add(user);
            return new SuccessDataResult<User>(user, Messages.UserRegistered);
        }

        public IResult UserExists(string email)
        {
            if (_userService.GetByMail(email) != null)
            {
                return new ErrorResult(Messages.UserAlreadyExists);
            }
            return new SuccessResult();
        }
    }
}
