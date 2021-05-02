using Core.Utilities.Results;
using Entities.Concrete;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProcessChargeService
    {
        IDataResult<List<ProcessCharge>> GetList();
        IDataResult<ProcessCharge> GetById(int id);
        IDataResult<ProcessCharge> GetByProcessId(int id);
        IResult Add(ProcessCharge processCharge);
        IResult Delete(int id);
        IResult Update(ProcessCharge processCharge);
    }
}
