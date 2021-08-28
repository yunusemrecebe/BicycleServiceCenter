using System;

namespace Core.CrossCuttingConcerns.Logging
{
    public class LogParameter
    {
        public string ParameterName { get; set; }
        public object ParameterValue { get; set; }
        public string ParameterType { get; set; }
    }
}
