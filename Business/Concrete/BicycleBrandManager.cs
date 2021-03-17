using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class BicycleBrandManager : IBicycleBrandService
    {
        public void Add(BicycleBrand bicycleBrand)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(BicycleBrand bicycleBrand)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<BicycleBrand>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<BicycleBrand> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public void Update(BicycleBrand bicycleBrand)
        {
            throw new System.NotImplementedException();
        }
    }
}
