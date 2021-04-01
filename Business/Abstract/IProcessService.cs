using Core.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProcessService
    {
        IDataResult<List<Process>> GetList();
        IDataResult<Process> GetById(int id);
        IResult Add(Process process);
        IResult Update(Process process);
        IResult Delete(int id);
    }
}
