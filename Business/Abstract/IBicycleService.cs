using Business.Utilities.Results;
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
        IDataResult<List<Bicycle>> GetAll();
        IDataResult<Bicycle> GetById(int id);
        void Add(Bicycle bicycle);
        void Update(Bicycle bicycle);
        void Delete(Bicycle bicycle);
    }
}
