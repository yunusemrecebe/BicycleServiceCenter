using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IBicycleBrandService
    {
        IDataResult<List<BicycleBrand>> GetAll();
        IDataResult<BicycleBrand> GetById(int id);
        void Add(BicycleBrand bicycleBrand);
        void Update(BicycleBrand bicycleBrand);
        void Delete(BicycleBrand bicycleBrand);
    }


}
