using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IReportDal
    {
        ReportForProductDto GetReportForProduct(int productId);
        ReportForEmployeeDto GetReportForEmployee(int employeeId);
        List<ReportForEmployeeDto> GetReportForEmployeeList(Expression<Func<bool, ReportForEmployeeDto>> filter = null);
        ReportForCustomerDto GetReportForCustomer(int customerId);
    }
}
