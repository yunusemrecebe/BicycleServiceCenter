using Core.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IConsumedPartService
    {
        IDataResult<List<ConsumedPart>> GetList();
        IDataResult<ConsumedPart> GetById(int id);
        IResult Add(ConsumedPart consumedPart);
        IResult Update(ConsumedPart consumedPart);
        IResult Delete(int id);
    }


}
