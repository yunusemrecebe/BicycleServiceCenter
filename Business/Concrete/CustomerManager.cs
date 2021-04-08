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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concrete
{
    public class CustomerManager : ICustomerService
    {
        ICustomerDal _customerDal;

        public CustomerManager(ICustomerDal customerDal)
        {
            _customerDal = customerDal;
        }

        [ValidationAspect(typeof(CustomerValidator))]
        [CacheRemoveAspect("ICustomerService.Get")]
        public IResult Add(Customer customer)
        {
            IResult result = BusinessRules.Run(CheckIfCustomerIsExists(customer.Phone));

            if (result != null)
            {
                return result;
            }

            _customerDal.Add(customer);
            return new SuccessResult(Messages.CustomerAdded);
        }

        [CacheRemoveAspect("ICustomerService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return result;
            }

            var customer = _customerDal.Get(c => c.CustomerId == id);
            _customerDal.Delete(customer);
            return new SuccessResult(Messages.CustomerDeleted);
        }

        public IDataResult<Customer> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<Customer>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<Customer>(_customerDal.Get(c => c.CustomerId == id));
        }

        [CacheAspect]
        public IDataResult<List<Customer>> GetList()
        {
            return new SuccessDataResult<List<Customer>>(_customerDal.GetList().ToList());
        }

        [TransactionScopeAspect]
        [ValidationAspect(typeof(CustomerValidator))]
        [CacheRemoveAspect("ICustomerService.Get")]
        public IResult Update(Customer customer)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(customer.CustomerId));

            if (result != null)
            {
                return result;
            }

            _customerDal.Update(customer);

            IResult result2 = BusinessRules.Run(CheckPhoneNumberIsUsed(customer.Phone));
            
            if (result2 != null)
            {
                throw new ValidationException(result2.Message);               
            }

            return new SuccessResult(Messages.CustomerUpdated);
        }

        private IResult CheckIfCustomerIsExists(string phone)
        {
            var result = _customerDal.GetList(c => c.Phone == phone).Any();

            if (result)
            {
                return new ErrorResult(Messages.CustomerAlreadyExists);
            }

            return new SuccessResult();
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _customerDal.Get(x => x.CustomerId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }

        private IResult CheckPhoneNumberIsUsed(string phone)
        {
            var result = _customerDal.GetList(c => c.Phone == phone);

            if (result.Count>1)
            {
                return new ErrorResult(Messages.CustomerAlreadyExists);
            }

            return new SuccessResult();
        }
    }
}
