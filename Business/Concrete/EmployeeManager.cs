using Business.Abstract;
using Business.Constants;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
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

        public IResult Add(Employee employee)
        {
            _empoloyeeDal.Add(employee);
            return new SuccessResult(Messages.UserAdded);
        }

        public IResult Delete(Employee employee)
        {
            _empoloyeeDal.Delete(employee);
            return new SuccessResult(Messages.UserDeleted);
        }

        public IDataResult<List<Employee>> GetList()
        {
            return new SuccessDataResult<List<Employee>>(_empoloyeeDal.GetList().ToList());
        }

        public IDataResult<Employee> GetById(int id)
        {
            var result = _empoloyeeDal.Get(x => x.EmployeeId == id);
            return new SuccessDataResult<Employee>(result);
        }

        public IResult Update(Employee employee)
        {
            _empoloyeeDal.Update(employee);
            return new SuccessResult(Messages.UserUpdated);
        }
    }

}
