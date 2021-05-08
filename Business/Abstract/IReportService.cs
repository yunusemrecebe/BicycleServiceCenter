using Core.Utilities.Results;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Business.Abstract
{
    public interface IReportService
    {
        IDataResult<ReportForProductDto> GetReportForProduct(int productId);
        IDataResult<ReportForEmployeeDto> GetReportForEmployee(int employeeId);
        IDataResult<List<ReportForEmployeeDto>> GetReportForEmployeeList();
        IDataResult<ReportForCustomerDto> GetReportForCustomer(int customerId);
    }
}
