using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProcessService
    {
        IDataResult<List<Process>> GetAll();
        IDataResult<Process> GetById(int id);
        IResult Add(Process process);
        IResult Update(Process process);
        IResult Delete(Process process);
    }


}
