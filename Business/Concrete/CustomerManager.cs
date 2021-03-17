using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class CustomerManager : ICustomerService
    {
        public void Add(Customer customer)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(Customer customer)
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

        public void Update(Customer customer)
        {
            throw new System.NotImplementedException();
        }
    }


}
