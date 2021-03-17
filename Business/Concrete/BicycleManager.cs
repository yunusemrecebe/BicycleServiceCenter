using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class BicycleManager : IBicycleService
    {
        public void Add(Bicycle bicycle)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(Bicycle bicycle)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<Bicycle>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<Bicycle> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public void Update(Bicycle bicycle)
        {
            throw new System.NotImplementedException();
        }
    }
}
