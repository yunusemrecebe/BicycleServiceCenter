using Business.Abstract;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using FluentValidation;
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
            var result = BusinessRules.Run(CheckChargeRecordIsExists(processCharge.ConsumedProductId));

            if (result != null)
            {
                var updatedProcessCharge = GetByConsumedProductId(processCharge.ConsumedProductId).Data;
                updatedProcessCharge.Charge += processCharge.Charge;
                Update(updatedProcessCharge);
                return new ErrorResult();
            }

            _processChargeDal.Add(processCharge);
            return new SuccessResult();
        }

        public IDataResult<ProcessChargeDetailDto> Calculate(int processId)
        {         
            return new SuccessDataResult<ProcessChargeDetailDto>(_processChargeDal.GetProcessDetails(processId));
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

        public IDataResult<ProcessCharge> GetByConsumedProductId(int id)
        {
            return new SuccessDataResult<ProcessCharge>(_processChargeDal.Get(p => p.ConsumedProductId == id));
        }

        [CacheAspect]
        public IDataResult<List<ProcessCharge>> GetList()
        {
            return new SuccessDataResult<List<ProcessCharge>>(_processChargeDal.GetList().ToList());
        }

        public IDataResult<List<ProcessCharge>> GetListByProcessId(int processId)
        {
            return new SuccessDataResult<List<ProcessCharge>>(_processChargeDal.GetList(p => p.ConsumedProductId == processId).ToList());
        }

        [ValidationAspect(typeof(ProcessChargeValidator))]
        [CacheRemoveAspect("IProcessChargeService.Get")]
        public IResult Update(ProcessCharge processCharge)
        {
            _processChargeDal.Update(processCharge);
            return new SuccessResult();
        }

        IResult CheckChargeRecordIsExists(int processId)
        {
            var result = GetListByProcessId(processId).Data.Any();

            if (result)
            {
                return new ErrorResult();
            }
            return new SuccessResult();
        }
    }
}
