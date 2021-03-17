using Business.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IBicycleModelService
    {
        IDataResult<List<BicycleModel>> GetAll();
        IDataResult<BicycleModel> GetById(int id);
        void Add(BicycleModel bicycleModel);
        void Update(BicycleModel bicycleModel);
        void Delete(BicycleModel bicycleModel);
    }


}
