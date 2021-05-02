using Business.Abstract;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Collections.Generic;
using System.Linq;

namespace Business.Concrete
{
    public class ProcessChargeManager : IProcessChargeService
    {
        IProcessChargeDal _processChargeDal;

        public ProcessChargeManager(IProcessChargeDal processChargeDal)
        {
            _processChargeDal = processChargeDal;
        }

        [ValidationAspect(typeof(ProcessChargeValidator))]
        [CacheRemoveAspect("IProcessChargeService.Get")]
        public IResult Add(ProcessCharge processCharge)
        {
            _processChargeDal.Add(processCharge);
            return new SuccessResult();
        }

        [CacheRemoveAspect("IProcessChargeService.Get")]
        public IResult Delete(int id)
        {
            var processCharge = GetById(id).Data;
            _processChargeDal.Delete(processCharge);
            return new SuccessResult();
        }

        public IDataResult<ProcessCharge> GetById(int id)
        {
            return new SuccessDataResult<ProcessCharge>(_processChargeDal.Get(p => p.ProcessChargeId == id));
        }

        public IDataResult<ProcessCharge> GetByProcessId(int id)
        {
            return new SuccessDataResult<ProcessCharge>(_processChargeDal.Get(p => p.ProcessId == id));
        }

        [CacheAspect]
        public IDataResult<List<ProcessCharge>> GetList()
        {
            return new SuccessDataResult<List<ProcessCharge>>(_processChargeDal.GetList().ToList());
        }

        [ValidationAspect(typeof(ProcessChargeValidator))]
        [CacheRemoveAspect("IProcessChargeService.Get")]
        public IResult Update(ProcessCharge processCharge)
        {
            _processChargeDal.Update(processCharge);
            return new SuccessResult();
        }
    }
}
