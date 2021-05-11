using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IConsumedProductDal : IEntityRepository<ConsumedProduct>
    {
        List<ConsumedProductDetailDto> GetConsumedProductDetailsList(Expression<Func<ConsumedProductDetailDto, bool>> filter = null);
        ConsumedProductDetailDto GetConsumedProductDetails(Expression<Func<ConsumedProductDetailDto, bool>> filter);
    }
}
