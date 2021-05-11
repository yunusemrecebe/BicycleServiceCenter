using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

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

        public IDataResult<ReportForCustomerDto> GetReportForCustomer(int customerId)
        {
            var result = _customerService.GetById(customerId).Data;

            if (result == null)
            {
                return new ErrorDataResult<ReportForCustomerDto>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ReportForCustomerDto>(_reportDal.GetReportForCustomer(customerId));
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

            return new SuccessDataResult<List<ReportForProductDto>>(_reportDal.GetReportForProduct(productId,null,null));
        }

        public IDataResult<List<ReportForProductDto>> GetReportForProductList()
        {
            return new SuccessDataResult<List<ReportForProductDto>>(_reportDal.GetReportForProductList());
        }
    }
}
