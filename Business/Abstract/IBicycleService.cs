using Core.Utilities.Results;
using Entities.Concrete;
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
        IDataResult<Bicycle> GetById(int id);
        IResult Add(Bicycle bicycle);
        IResult Update(Bicycle bicycle);
        IResult Delete(Bicycle bicycle);
    }
}
