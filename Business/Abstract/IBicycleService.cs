using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IBicycleService
    {
        IDataResult<List<Bicycle>> GetList();
        IDataResult<List<BicycleDetailDto>> GetBicycleDetails();
        IDataResult<List<BicycleDetailDto>> GetBicycleDetailsByCustomerId(int customerId);
        IDataResult<BicycleDetailDto> GetBicycleDetailsById(int id);
        IDataResult<Bicycle> GetById(int id);
        IResult Add(Bicycle bicycle);
        IResult Update(Bicycle bicycle);
        IResult Delete(int id);
    }
}
