using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IBicycleDal : IEntityRepository<Bicycle>
    {
        List<BicycleDetailDto> GetBicycleDetailsList(Expression<Func<BicycleDetailDto, bool>> filter = null);
        BicycleDetailDto GetBicycleDetails(Expression<Func<BicycleDetailDto, bool>> filter);
    }
}
