using Business.Abstract;
using Business.BusinessAspects.Autofac;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using FluentValidation;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class ReportManager : IReportService
    {
        IReportDal _reportDal;
        ICustomerService _customerService;
        IEmployeeService _employeeService;
        IProductService _productService;

        public ReportManager(IReportDal reportDal, ICustomerService customerService, IEmployeeService employeeService, IProductService productService)
        {
            _reportDal = reportDal;
            _customerService = customerService;
            _employeeService = employeeService;
            _productService = productService;
        }

        public IDataResult<ReportForCustomerDto> GetFilteredReportForCustomerByDateRange(int customerId, string begin, string end)
        {
            var result = _customerService.GetById(customerId).Data;

            if (result == null)
            {
                throw new ValidationException(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ReportForCustomerDto>(_reportDal.GetFilteredReportForCustomerByDateRange(customerId, begin, end));
        }

        public IDataResult<List<ReportForEmployeeDto>> GetFilteredReportForEmployeeByDateRange(int employeeId, string begin, string end)
        {
            var result = _employeeService.GetById(employeeId).Data;

            if (result == null)
            {
                return new ErrorDataResult<List<ReportForEmployeeDto>>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<List<ReportForEmployeeDto>>(_reportDal.GetFilteredReportForEmployeeByDateRange(employeeId, begin, end));
        }

        public IDataResult<List<ReportForProductDto>> GetFilteredReportForProductByDateRange(int productId, string begin, string end)
        {
            var result = _productService.GetById(productId).Data;

            if (result == null)
            {
                return new ErrorDataResult<List<ReportForProductDto>>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<List<ReportForProductDto>>(_reportDal.GetFilteredReportForProductByDateRange(productId, begin, end));
        }

        public IDataResult<ReportForCustomerDto> GetReportForCustomer(int customerId)
        {
            var result = _customerService.GetById(customerId).Data;

            if (result == null)
            {
                return new ErrorDataResult<ReportForCustomerDto>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ReportForCustomerDto>(_reportDal.GetReportForCustomer(customerId));
        }

        public IDataResult<List<ReportForEmployeeDto>> GetReportForEmployee(int employeeId)
        {
            var result = _employeeService.GetById(employeeId).Data;

            if (result == null)
            {
                return new ErrorDataResult<List<ReportForEmployeeDto>>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<List<ReportForEmployeeDto>>(_reportDal.GetReportForEmployee(employeeId));
        }

        public IDataResult<List<ReportForEmployeeDto>> GetReportForEmployeeList()
        {
            return new SuccessDataResult<List<ReportForEmployeeDto>>(_reportDal.GetReportForEmployeeList());
        }

        public IDataResult<List<ReportForProductDto>> GetReportForProduct(int productId)
        {
            var result = _productService.GetById(productId).Data;

            if (result == null)
            {
                return new ErrorDataResult<List<ReportForProductDto>>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<List<ReportForProductDto>>(_reportDal.GetReportForProduct(productId));
        }

        public IDataResult<List<ReportForProductDto>> GetReportForProductList()
        {
            return new SuccessDataResult<List<ReportForProductDto>>(_reportDal.GetReportForProductList());
        }
    }
}
