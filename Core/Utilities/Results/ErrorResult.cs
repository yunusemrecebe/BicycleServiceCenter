namespace Core.Utilities.Results
{
    public class ErrorResult : Result
    {
        public ErrorResult() : base(false)
        {
        }

        public ErrorResult(string message) : base(false, message)
        {
        }

        public ErrorResult(int statusCode) : base(false, statusCode)
        {
        }

        public ErrorResult(string message, int statusCode) : base(false, message, statusCode)
        {
        }
    }
}
