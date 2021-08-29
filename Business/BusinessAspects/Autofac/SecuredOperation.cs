using Business.Constants;
using Castle.DynamicProxy;
using Core.Extensions;
using Core.Utilities.Interceptors.Autofac;
using Core.Utilities.IoC;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.BusinessAspects.Autofac
{
    public class SecuredOperation : MethodInterception
    {
        string[] _requiredRoles;
        IHttpContextAccessor _httpContextAccessor;

        public SecuredOperation(string requiredRoles = null)
        {
            if (requiredRoles != null)
                _requiredRoles = requiredRoles.Split(',');

            _httpContextAccessor = ServiceTool.ServiceProvider.GetService<IHttpContextAccessor>();
        }

        protected override void OnBefore(IInvocation invocation)
        {
            var exp = _httpContextAccessor.HttpContext.User.GetAccessTokenExpiration();
            if (!exp)
                throw new ValidationException(Messages.TokenNotFound);

            var roleClaims = _httpContextAccessor.HttpContext.User.ClaimRoles();

            if (_requiredRoles == null && roleClaims.Count() > 0)
                return;

            if(_requiredRoles != null)
                foreach (var role in _requiredRoles)
                {
                    if (roleClaims.Contains(role))
                    {
                        return;
                    }
                }

            throw new ValidationException(Messages.AuthorizationDenied);
        }
    }
}
