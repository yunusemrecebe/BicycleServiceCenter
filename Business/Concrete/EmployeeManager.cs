using Business.Abstract;
using Business.BusinessAspects.Autofac;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Transaction;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using FluentValidation;
using System.Collections.Generic;
using System.Linq;

namespace Business.Concrete
{
    public class EmployeeManager : IEmployeeService
    {
        IEmpoloyeeDal _empoloyeeDal;
        IProcessService _processService;

        public EmployeeManager(IEmpoloyeeDal empoloyeeDal, IProcessService processService)
        {
            _empoloyeeDal = empoloyeeDal;
            _processService = processService;
        }

        [SecuredOperation("Employee.Add")]
        [ValidationAspect(typeof(EmployeeValidator))]
        [CacheRemoveAspect("IEmployeeService.Get")]
        public IResult Add(Employee employee)
        {
            IResult result = BusinessRules.Run(CheckIfEmployeeIsExists(employee.Phone));

            if (result != null)
            {
                return result;
            }

            _empoloyeeDal.Add(employee);
            return new SuccessResult(Messages.EmployeeAdded);
        }

        [CacheRemoveAspect("IEmployeeService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id), CheckIfEmployeeHasProcess(id));

            if (result != null)
            {
                return result;
            }

            var employee = _empoloyeeDal.Get(x => x.EmployeeId == id);
            _empoloyeeDal.Delete(employee);
            return new SuccessResult(Messages.EmployeeDeleted);
        }

        [SecuredOperation("Employee.Get")]
        [CacheAspect]
        public IDataResult<List<Employee>> GetList()
        {
            return new SuccessDataResult<List<Employee>>(_empoloyeeDal.GetList().ToList());
        }

        public IDataResult<Employee> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<Employee>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<Employee>(_empoloyeeDal.Get(x => x.EmployeeId == id));
        }

        [TransactionScopeAspect]
        [ValidationAspect(typeof(EmployeeValidator))]
        [CacheRemoveAspect("IEmployeeService.Get")]
        public IResult Update(Employee employee)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(employee.EmployeeId));

            if (result != null)
            {
                return result;
            }

            _empoloyeeDal.Update(employee);

            IResult result2 = BusinessRules.Run(CheckPhoneNumberIsUsed(employee.Phone));

            if (result2 != null)
            {
                throw new ValidationException(result2.Message);
            }

            _empoloyeeDal.Update(employee);
            return new SuccessResult(Messages.EmployeeUpdated);
        }

        private IResult CheckIfEmployeeIsExists(string? phone)
        {
            if (phone != null)
            {
                var result = _empoloyeeDal.GetList(e => e.Phone == phone).Any();

                if (result)
                {
                    return new ErrorResult(Messages.EmployeeAlreadyExists);
                }
            }

            return new SuccessResult();
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _empoloyeeDal.Get(e => e.EmployeeId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }

        private IResult CheckIfEmployeeHasProcess(int id)
        {
            var result = _processService.GetListByFilter(p => p.EmployeeId == id).Data.Any();

            if (result)
            {
                return new ErrorResult(Messages.EmployeeHasProcess);
            }

            return new SuccessResult();
        }

        private IResult CheckPhoneNumberIsUsed(string? phone)
        {
            if (phone != null)
            {
                var result = _empoloyeeDal.GetList(e => e.Phone == phone);

                if (result.Count > 1)
                {
                    return new ErrorResult(Messages.EmployeeAlreadyExists);
                }
            }
            
            return new SuccessResult();
        }
    }

}
