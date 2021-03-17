using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IBicycleBrandService
    {
        IDataResult<List<BicycleBrand>> GetAll();
        IDataResult<BicycleBrand> GetById(int id);
        IResult Add(BicycleBrand bicycleBrand);
        IResult Update(BicycleBrand bicycleBrand);
        IResult Delete(BicycleBrand bicycleBrand);
    }


}
