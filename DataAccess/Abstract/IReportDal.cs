using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IReportDal
    {
        List<ReportForProductDto> GetReportForProduct(int productId);
        List<ReportForProductDto> GetFilteredReportForProductByDateRange(int productId, string begin, string end);
        List<ReportForProductDto> GetReportForProductList(Expression<Func<bool, ReportForProductDto>> filter = null);
        List<ReportForEmployeeDto> GetReportForEmployee(int employeeId);
        List<ReportForEmployeeDto> GetFilteredReportForEmployeeByDateRange(int employeeId, string begin, string end);
        List<ReportForEmployeeDto> GetReportForEmployeeList(Expression<Func<bool, ReportForEmployeeDto>> filter = null);
        ReportForCustomerDto GetReportForCustomer(int customerId);
        ReportForCustomerDto GetFilteredReportForCustomerByDateRange(int customerId, string begin, string end);
    }
}
