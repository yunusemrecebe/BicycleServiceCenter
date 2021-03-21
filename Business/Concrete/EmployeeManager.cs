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
            _empoloyeeDal.Delete(employee);
            return new SuccessResult();
        }

        public IDataResult<List<Employee>> GetAll()
        {
            var result = _empoloyeeDal.GetAll();
            return new SuccessDataResult<List<Employee>>(result);
        }

        public IDataResult<Employee> GetById(int id)
        {
            var result = _empoloyeeDal.Get(x => x.EmployeeId == id);
            return new SuccessDataResult<Employee>(result);
        }

        public IResult Update(Employee employee)
        {
            _empoloyeeDal.Update(employee);
            return new SuccessResult();
        }
    }

}
