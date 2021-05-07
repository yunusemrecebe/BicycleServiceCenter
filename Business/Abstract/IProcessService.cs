using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Business.Abstract
{
    public interface IProcessService
    {
        IDataResult<List<Process>> GetList();
        IDataResult<List<Process>> GetListByFilter(Expression<Func<Process, bool>> filter);
        IDataResult<List<ProcessDetailDto>> GetProcessDetails();
        IDataResult<ProcessDetailDto> GetProcessDetailsById(int id);
        IDataResult<Process> GetById(int id);
        IDataResult<Process> GetByEmployee(int employeeId);
        IResult Add(Process process);
        IResult Update(Process process);
        IResult Delete(int id);
    }
}
