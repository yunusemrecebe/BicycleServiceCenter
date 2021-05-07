using Core.Utilities.Results;
using Entities.Dtos;

namespace Business.Abstract
{
    public interface IReportService
    {
        IDataResult<ReportForProductDto> GetReportForProduct(int productId);
        IDataResult<ReportForEmployeeDto> GetReportForEmployee(int employeeId);
        IDataResult<ReportForCustomerDto> GetReportForCustomer(int customerId);
    }
}
