using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Business.Abstract
{
    public interface IConsumedProductService
    {
        IDataResult<List<ConsumedProduct>> GetList();
        IDataResult<List<ConsumedProductDetailDto>> GetConsumedProductDetailsList();
        IDataResult<List<ConsumedProductDetailDto>> GetConsumedProductDetailsListByProcessId(int id);
        IDataResult<ConsumedProductDetailDto> GetConsumedProductDetailsById(int id);
        IDataResult<ConsumedProduct> GetById(int id);
        IDataResult<ConsumedProduct> GetByProductId(int id);
        IResult Add(ConsumedProduct consumedProduct);
        IResult Update(ConsumedProduct consumedProduct);
        IResult Delete(int id);
    }
}
