using Core.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IBicycleModelService
    {
        IDataResult<List<BicycleModel>> GetList();
        IDataResult<BicycleModel> GetById(int id);
        IResult Add(BicycleModel bicycleModel);
        IResult Update(BicycleModel bicycleModel);
        IResult Delete(BicycleModel bicycleModel);
    }


}
