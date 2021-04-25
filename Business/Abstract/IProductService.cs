using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProductService
    {
        IDataResult<List<Product>> GetList();
        IDataResult<List<ProductDetailDto>> GetListByCategoryId(int id);
        IDataResult<List<ProductDetailDto>> GetListOnSaleByCategoryId(int id);
        IDataResult<List<ProductDetailDto>> GetProductDetails();
        IDataResult<ProductDetailDto> GetProductDetailsById(int id);
        IDataResult<Product> GetById(int id);
        IResult Add(Product product);
        IResult Update(Product product);
        IResult Delete(int id);
    }


}
