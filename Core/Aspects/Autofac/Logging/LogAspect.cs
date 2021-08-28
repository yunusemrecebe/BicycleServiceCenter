using System;
using System.Collections.Generic;
using Castle.DynamicProxy;
using Core.CrossCuttingConcerns.Logging;
using Core.Utilities.Interceptors.Autofac;
using Core.Utilities.Messages;

namespace Core.Aspects.Autofac.Logging
{
    public class LogAspect : MethodInterception
    {
        private LoggerServiceBase _loggerServiceBase = new LoggerServiceBase();

        protected override void OnBefore(IInvocation invocation)
        {
            var logInfo = GetLogDetail(invocation);
            _loggerServiceBase.Info($"{logInfo.MethodName} was run.");
        }

        private LogDetail GetLogDetail(IInvocation invocation)
        {
            var logParameters = new List<LogParameter>();
            for (int i = 0; i < invocation.Arguments.Length; i++)
            {
                logParameters.Add(new LogParameter
                {
                    ParameterName = invocation.GetConcreteMethod().GetParameters()[i].Name,
                    ParameterValue = invocation.Arguments[i],
                    ParameterType = invocation.Arguments[i].GetType().Name,
                });
            }

            var logDetail = new LogDetail
            {
                MethodName = $"{invocation.Method.DeclaringType.Name}_{invocation.Method.Name}",
                LogDate = $"{DateTime.Now.ToShortDateString()} {DateTime.Now.ToShortTimeString()}",
                LogParameters = logParameters
            };

            return logDetail;
        }
    }
}
