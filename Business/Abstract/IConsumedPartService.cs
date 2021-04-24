using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Business.Abstract
{
    public interface IConsumedPartService
    {
        IDataResult<List<ConsumedPart>> GetList();
        IDataResult<List<ConsumedPartDetailDto>> GetConsumedPartDetailsList();
        IDataResult<ConsumedPartDetailDto> GetConsumedPartDetailsById(int id);
        IDataResult<ConsumedPart> GetById(int id);
        IDataResult<ConsumedPart> GetByProductId(int id);
        IResult Add(ConsumedPart consumedPart);
        IResult Update(ConsumedPart consumedPart);
        IResult Delete(int id);
    }
}
