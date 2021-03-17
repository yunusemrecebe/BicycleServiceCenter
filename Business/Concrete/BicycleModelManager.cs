using Business.Abstract;
using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Concrete
{
    public class BicycleModelManager : IBicycleModelService
    {
        public IResult Add(BicycleModel bicycleModel)
        {
            throw new System.NotImplementedException();
        }

        public IResult Delete(BicycleModel bicycleModel)
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<List<BicycleModel>> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public IDataResult<BicycleModel> GetById(int id)
        {
            throw new System.NotImplementedException();
        }

        public IResult Update(BicycleModel bicycleModel)
        {
            throw new System.NotImplementedException();
        }
    }
}
