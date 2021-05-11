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

                             join consumedProduct in context.ConsumedProducts
                             on processCharge.ConsumedProductId equals consumedProduct.ConsumedProductId

                             where processCharge.ProcessId == processId

                             select new ProcessChargeDetailDto
                             {
                                 ProcessChargeId = processCharge.ProcessChargeId,
                                 ProcessId = processCharge.ProcessId,
                                 ConsumedProductId = consumedProduct.ConsumedProductId,
                                 Charge = consumedProduct.UnitPrice * consumedProduct.Quantity
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
