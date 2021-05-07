using Business.Abstract;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.Dtos;

namespace Business.Concrete
{
    public class ReportManager : IReportService
    {
        IReportDal _reportDal;
        IProcessService _processService;

        public ReportManager(IReportDal reportDal, IProcessService processService)
        {
            _reportDal = reportDal;
            _processService = processService;
        }

        public IDataResult<Process> GetProcessCountByEmployee(int employeeId)
        {
            return new SuccessDataResult<Process>(_processService.GetByEmployee(employeeId).Data);
        }

        public IDataResult<ReportForProductDto> GetReportForProductByProductId(int productId)
        {
            return new SuccessDataResult<ReportForProductDto>(_reportDal.GetReportForProduct(productId));
        }
    }
}
