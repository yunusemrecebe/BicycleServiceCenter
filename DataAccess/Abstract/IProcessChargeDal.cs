using Core.DataAccess;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;

namespace DataAccess.Abstract
{
    public interface IProcessChargeDal : IEntityRepository<ProcessCharge>
    {
        public ProcessChargeDetailDto GetProcessDetails(int processId);
    }
}
