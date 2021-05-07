using Entities.Dtos;

namespace DataAccess.Abstract
{
    public interface IReportDal
    {
        ReportForProductDto GetReportForProduct(int productId);
        ReportForEmployeeDto GetReportForEmployee(int employeeId);
        ReportForCustomerDto GetReportForCustomer(int customerId);
    }
}
