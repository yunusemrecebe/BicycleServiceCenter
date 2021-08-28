using Castle.DynamicProxy;
using Core.CrossCuttingConcerns.Logging;
using Core.Utilities.Interceptors.Autofac;
using Core.Utilities.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Aspects.Autofac.Exception
{
    public class ExceptionLogAspect : MethodInterception
    {
        private LoggerServiceBase _loggerServiceBase = new LoggerServiceBase();

        protected override void OnException(IInvocation invocation, System.Exception e)
        {
            var logInfo = GetLogDetail(invocation, e.Message);
            _loggerServiceBase.Error($"{logInfo.MethodName} is failed. Reason: {e.InnerException.Message}");
        }

        private LogDetailWithException GetLogDetail(IInvocation invocation, string exceptionMessage)
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

            var logDetailWithException = new LogDetailWithException
            {
                MethodName = $"{invocation.Method.DeclaringType.Name}_{invocation.Method.Name}",
                LogDate = $"{DateTime.Now.ToShortDateString()} {DateTime.Now.ToShortTimeString()}",
                ExceptionMessage = exceptionMessage,
                LogParameters = logParameters
            };

            return logDetailWithException;
        }
    }
}
