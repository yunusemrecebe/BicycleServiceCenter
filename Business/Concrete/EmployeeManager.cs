using Business.Abstract;
using Business.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class EmployeeManager : IEmployeeService
    {
        IEmpoloyeeDal _empoloyeeDal;

        public EmployeeManager(IEmpoloyeeDal empoloyeeDal)
        {
            _empoloyeeDal = empoloyeeDal;
        }

        public IResult Add(Employee employee)
        {
            _empoloyeeDal.Add(employee);
            return new SuccessResult();
        }

        public IResult Delete(Employee employee)
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

        public IResult Update(Employee employee)
        {
            throw new System.NotImplementedException();
        }
    }

}
