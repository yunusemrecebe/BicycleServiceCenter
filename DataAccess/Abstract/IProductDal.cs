using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IProductDal : IEntityRepository<Product>
    {
        List<ProductDetailDto> GetProductDetailsList(Expression<Func<ProductDetailDto, bool>> filter = null);
        ProductDetailDto GetProductDetails(Expression<Func<ProductDetailDto, bool>> filter);
    }
}
