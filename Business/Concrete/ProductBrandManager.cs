using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class ProductBrandManager : IProductBrandService
    {
        public IResult Add(ProductBrand productBrand)
        {
            throw new System.NotImplementedException();
        }

        public IResult Delete(ProductBrand productBrand)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<ProductBrand>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<ProductBrand> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public IResult Update(ProductBrand productBrand)
        {
            throw new System.NotImplementedException();
        }
    }
}
