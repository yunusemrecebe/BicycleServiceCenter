using Business.Abstract;
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

        public EmployeeManager(IEmpoloyeeDal empoloyeeDal)
        {
            _empoloyeeDal = empoloyeeDal;
        }

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
            return new SuccessResult(Messages.UserAdded);
        }

        [CacheRemoveAspect("IEmployeeService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return result;
            }

            var employee = _empoloyeeDal.Get(x => x.EmployeeId == id);
            _empoloyeeDal.Delete(employee);
            return new SuccessResult(Messages.UserDeleted);
        }

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
            return new SuccessResult(Messages.UserUpdated);
        }

        private IResult CheckIfEmployeeIsExists(string? phone)
        {
            if (phone != null)
            {
                var result = _empoloyeeDal.GetList(e => e.Phone == phone).Any();

                if (result)
                {
                    return new ErrorResult(Messages.CustomerAlreadyExists);
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

        private IResult CheckPhoneNumberIsUsed(string? phone)
        {
            if (phone != null)
            {
                var result = _empoloyeeDal.GetList(e => e.Phone == phone);

                if (result.Count > 1)
                {
                    return new ErrorResult(Messages.CustomerAlreadyExists);
                }
            }
            
            return new SuccessResult();
        }
    }

}
