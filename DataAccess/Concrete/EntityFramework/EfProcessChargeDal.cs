using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;

namespace DataAccess.Concrete.EntityFramework
{
    public class EfProcessChargeDal : EfEntityRepositoryBase<ProcessCharge, BicycleServiceCenterContext>, IProcessChargeDal
    {
    }
}
