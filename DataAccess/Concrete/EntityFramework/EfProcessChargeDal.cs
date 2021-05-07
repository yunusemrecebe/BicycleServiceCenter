using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.Concrete.EntityFramework
{
    public class EfProcessChargeDal : EfEntityRepositoryBase<ProcessCharge, BicycleServiceCenterContext>, IProcessChargeDal
    {
        public ProcessChargeDetailDto GetProcessDetails(int processId)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from processCharge in context.ProcessCharges

                             join consumedPart in context.ConsumedParts
                             on processCharge.ConsumedPartId equals consumedPart.ConsumedPartId

                             where processCharge.ProcessId == processId

                             select new ProcessChargeDetailDto
                             {
                                 ProcessChargeId = processCharge.ProcessChargeId,
                                 ProcessId = processCharge.ProcessId,
                                 ConsumedPartId = consumedPart.ConsumedPartId,
                                 Charge = consumedPart.UnitPrice * consumedPart.Quantity
                             };

                result.ToList();

                decimal charge = 0;

                foreach (var item in result)
                {
                     charge += item.Charge;
                }

                return new ProcessChargeDetailDto { Charge = charge };
                
            }
        }
    }
}
