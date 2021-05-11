using Core.Utilities.Results;
using Entities.Dtos;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IReportService
    {
        IDataResult<List<ReportForProductDto>> GetReportForProduct(int productId);
        IDataResult<List<ReportForProductDto>> GetReportForProductList();
        IDataResult<ReportForEmployeeDto> GetReportForEmployee(int employeeId);
        IDataResult<List<ReportForEmployeeDto>> GetReportForEmployeeList();
        IDataResult<ReportForCustomerDto> GetReportForCustomer(int customerId);
    }
}
