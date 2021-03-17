using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class EmployeeManager : IEmployeeService
    {
        public void Add(Employee employee)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(Employee employee)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<Employee>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<Employee> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public void Update(Employee employee)
        {
            throw new System.NotImplementedException();
        }
    }

}
