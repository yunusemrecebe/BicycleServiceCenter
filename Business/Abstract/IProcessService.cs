using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProcessService
    {
        IDataResult<List<Process>> GetAll();
        IDataResult<Process> GetById(int id);
        void Add(Process process);
        void Update(Process process);
        void Delete(Process process);
    }


}
