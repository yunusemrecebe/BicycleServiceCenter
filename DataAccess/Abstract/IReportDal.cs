using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IReportDal
    {
        List<ReportForProductDto> GetReportForProduct(int productId, DateTime? begin, DateTime? end);
        List<ReportForProductDto> GetReportForProductList(Expression<Func<bool, ReportForProductDto>> filter = null);
        List<ReportForEmployeeDto> GetReportForEmployee(int employeeId);
        List<ReportForEmployeeDto> GetReportForEmployeeList(Expression<Func<bool, ReportForEmployeeDto>> filter = null);
        ReportForCustomerDto GetReportForCustomer(int customerId);
    }
}
