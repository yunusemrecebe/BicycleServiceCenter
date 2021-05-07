using Business.Abstract;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;

namespace Business.Concrete
{
    public class ReportManager : IReportService
    {
        IReportDal _reportDal;

        public ReportManager(IReportDal reportDal)
        {
            _reportDal = reportDal;
        }

        public IDataResult<ReportForEmployeeDto> GetReportForEmployee(int employeeId)
        {
            return new SuccessDataResult<ReportForEmployeeDto>(_reportDal.GetReportForEmployee(employeeId));
        }

        public IDataResult<ReportForProductDto> GetReportForProduct(int productId)
        {
            return new SuccessDataResult<ReportForProductDto>(_reportDal.GetReportForProduct(productId));
        }
    }
}
