using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class ProductCategoryManager : IProductCategoryService
    {
        public IResult Add(ProductCategory productCategory)
        {
            throw new System.NotImplementedException();
        }

        public IResult Delete(ProductCategory productCategory)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<ProductCategory>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<ProductCategory> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public IResult Update(ProductCategory productCategory)
        {
            throw new System.NotImplementedException();
        }
    }
}
