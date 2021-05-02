namespace Core.Utilities.Results
{
    public class SuccessResult : Result
    {
        public SuccessResult() : base(true)
        {
        }

        public SuccessResult(string message) : base(true, message)
        {
        }

        public SuccessResult(int statusCode) : base(true, statusCode)
        {
        }

        public SuccessResult(string message ,int statusCode) : base(true, message, statusCode)
        {
        }
    }
}
