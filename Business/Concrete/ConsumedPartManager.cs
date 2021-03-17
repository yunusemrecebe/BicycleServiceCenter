using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class ConsumedPartManager : IConsumedPartService
    {
        public IResult Add(ConsumedPart consumedPart)
        {
            throw new System.NotImplementedException();
        }

        public IResult Delete(ConsumedPart consumedPart)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<ConsumedPart>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<ConsumedPart> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public IResult Update(ConsumedPart consumedPart)
        {
            throw new System.NotImplementedException();
        }
    }



}
