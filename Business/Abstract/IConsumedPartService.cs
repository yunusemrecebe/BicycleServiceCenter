using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IConsumedPartService
    {
        IDataResult<List<ConsumedPart>> GetAll();
        IDataResult<ConsumedPart> GetById(int id);
        void Add(ConsumedPart consumedPart);
        void Update(ConsumedPart consumedPart);
        void Delete(ConsumedPart consumedPart);
    }


}
