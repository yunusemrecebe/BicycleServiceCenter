using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProcessService
    {
        IDataResult<List<Process>> GetList();
        IDataResult<List<ProcessDetailDto>> GetProcessDetails();
        IDataResult<Process> GetById(int id);
        IResult Add(Process process);
        IResult Update(Process process);
        IResult Delete(int id);
    }
}
