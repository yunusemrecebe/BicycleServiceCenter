using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;

namespace Business.Abstract
{
    public interface IReportService
    {
        IDataResult<ReportForProductDto> GetReportForProductByProductId(int productId);
        IDataResult<Process> GetProcessCountByEmployee(int employeeId);
    }
}
