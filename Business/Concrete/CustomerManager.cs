using Business.Abstract;
using Business.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class CustomerManager : ICustomerService
    {
        ICustomerDal _customerDal;

        public CustomerManager(ICustomerDal customerDal)
        {
            _customerDal = customerDal;
        }

        public IResult Add(Customer customer)
        {
            _customerDal.Add(customer);
            return new SuccessResult();
        }

        public IResult Delete(Customer customer)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<Customer>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<Customer> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public IResult Update(Customer customer)
        {
            throw new System.NotImplementedException();
        }
    }


}
