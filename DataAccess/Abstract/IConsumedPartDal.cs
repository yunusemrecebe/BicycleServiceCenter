using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IConsumedPartDal : IEntityRepository<ConsumedPart>
    {
        List<ConsumedPartDetailDto> GetConsumedPartDetailsList(Expression<Func<ConsumedPartDetailDto, bool>> filter = null);
        ConsumedPartDetailDto GetConsumedPartDetails(Expression<Func<ConsumedPartDetailDto, bool>> filter);
    }
}
