using Core.Utilities.Results;
using Entities.Dtos;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IReportService
    {
        IDataResult<List<ReportForProductDto>> GetReportForProduct(int productId);
        IDataResult<List<ReportForProductDto>> GetReportForProductList();
        IDataResult<List<ReportForEmployeeDto>> GetReportForEmployee(int employeeId);
        IDataResult<List<ReportForEmployeeDto>> GetReportForEmployeeList();
        IDataResult<ReportForCustomerDto> GetReportForCustomer(int customerId);
        IDataResult<ReportForCustomerDto> GetFilteredReportForCustomerByDateRange(int customerId, string begin, string end);
    }
}
