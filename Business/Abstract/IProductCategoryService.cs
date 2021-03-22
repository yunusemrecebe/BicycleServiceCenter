using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProductCategoryService
    {
        IDataResult<List<ProductCategory>> GetAll();
        IDataResult<ProductCategory> GetById(int id);
        IResult Add(ProductCategory productCategory);
        IResult Update(ProductCategory productCategory);
        IResult Delete(ProductCategory productCategory);
    }


}
