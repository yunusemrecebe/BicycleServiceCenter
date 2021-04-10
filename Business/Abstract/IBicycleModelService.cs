using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IBicycleModelService
    {
        IDataResult<List<BicycleModel>> GetList();
        IDataResult<List<BicycleModelDto>> GetDetails();
        IDataResult<BicycleModel> GetById(int id);
        IDataResult<BicycleModelDto> GetDetailsById(int id);
        IResult Add(BicycleModel bicycleModel);
        IResult Update(BicycleModel bicycleModel);
        IResult Delete(int id);
    }
}
