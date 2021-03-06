using Business.Abstract;
using Business.BusinessAspects.Autofac;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
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
    public class CustomerManager : ICustomerService
    {
        ICustomerDal _customerDal;
        IProcessService _processService;
        IBicycleService _bicycleService;

        public CustomerManager(ICustomerDal customerDal, IProcessService processService, IBicycleService bicycleService)
        {
            _customerDal = customerDal;
            _processService = processService;
            _bicycleService = bicycleService;
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
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id), CheckIfCustomerHasProcess(id), CheckIfCustomerHasBike(id));

            if (result != null)
            {
                return result;
            }

            var customer = _customerDal.Get(c => c.CustomerId == id);
            _customerDal.Delete(customer);
            return new SuccessResult(Messages.CustomerDeleted);
        }

        [SecuredOperation]
        public IDataResult<Customer> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<Customer>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<Customer>(_customerDal.Get(c => c.CustomerId == id));
        }

        [SecuredOperation]
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

        private IResult CheckIfCustomerHasProcess(int id)
        {
            var result = _processService.GetListByFilter(p => p.CustomerId == id).Data.Any();

            if (result)
            {
                return new ErrorResult(Messages.CustomerHasProcess);
            }

            return new SuccessResult();
        }

        private IResult CheckIfCustomerHasBike(int id)
        {
            var result = _bicycleService.GetBicycleDetailsByCustomerId(id).Data.Any();

            if (result)
            {
                return new ErrorResult(Messages.CustomerHasBike);
            }

            return new SuccessResult();
        }
    }
}
