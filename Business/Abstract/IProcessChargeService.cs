using Core.Utilities.Results;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace Business.Abstract
{
    public interface IProcessChargeService
    {
        IDataResult<List<ProcessCharge>> GetList();
        IDataResult<List<ProcessCharge>> GetListByProcessId(int processId);
        IDataResult<ProcessChargeDetailDto> Calculate(int processId);
        IDataResult<ProcessCharge> GetById(int id);
        IDataResult<ProcessCharge> GetByConsumedPartId(int id);
        IResult Add(ProcessCharge processCharge);
        IResult Delete(int id);
        IResult Update(ProcessCharge processCharge);
    }
}
