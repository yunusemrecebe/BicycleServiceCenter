using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class ProductManager : IProductService
    {
        public IResult Add(Product product)
        {
            throw new System.NotImplementedException();
        }

        public IResult Delete(Product product)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<Product>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<Product> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public IResult Update(Product product)
        {
            throw new System.NotImplementedException();
        }
    }
}
