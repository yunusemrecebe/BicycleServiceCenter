using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class ProcessManager : IProcessService
    {
        public IResult Add(Process process)
        {
            throw new System.NotImplementedException();
        }

        public IResult Delete(Process process)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<Process>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<Process> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public IResult Update(Process process)
        {
            throw new System.NotImplementedException();
        }
    }


}
