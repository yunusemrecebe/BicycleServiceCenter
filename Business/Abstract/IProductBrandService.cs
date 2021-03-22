using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProductBrandService
    {
        IDataResult<List<ProductBrand>> GetAll();
        IDataResult<ProductBrand> GetById(int id);
        IResult Add(ProductBrand productBrand);
        IResult Update(ProductBrand productBrand);
        IResult Delete(ProductBrand productBrand);
    }


}
