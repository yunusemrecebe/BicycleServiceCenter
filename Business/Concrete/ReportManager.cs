using Business.Abstract;
using Business.Constants;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;

namespace Business.Concrete
{
    public class ReportManager : IReportService
    {
        IReportDal _reportDal;
        IEmployeeService _employeeService;
        IProductService _productService;

        public ReportManager(IReportDal reportDal, IEmployeeService employeeService, IProductService productService)
        {
            _reportDal = reportDal;
            _employeeService = employeeService;
            _productService = productService;
        }

        public IDataResult<ReportForEmployeeDto> GetReportForEmployee(int employeeId)
        {
            var result = _employeeService.GetById(employeeId).Data;

            if (result == null)
            {
                return new ErrorDataResult<ReportForEmployeeDto>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ReportForEmployeeDto>(_reportDal.GetReportForEmployee(employeeId));
        }

        public IDataResult<ReportForProductDto> GetReportForProduct(int productId)
        {
            var result = _productService.GetById(productId).Data;

            if (result == null)
            {
                return new ErrorDataResult<ReportForProductDto>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ReportForProductDto>(_reportDal.GetReportForProduct(productId));
        }
    }
}
