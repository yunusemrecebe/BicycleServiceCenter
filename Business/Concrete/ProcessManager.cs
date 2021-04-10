using Business.Abstract;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Business.Concrete
{
    public class ProcessManager : IProcessService
    {
        IProcessDal _processDal;

        public ProcessManager(IProcessDal processDal)
        {
            _processDal = processDal;
        }

        [ValidationAspect(typeof(ProcessValidator))]
        [CacheRemoveAspect("IProcessService.Get")]
        public IResult Add(Process process)
        {
            process.StartingDate = Convert.ToDateTime(DateTime.Now.ToString("MM/dd/yyyy HH:mm"));
            _processDal.Add(process);
            return new SuccessResult(Messages.ProcessAdded);
        }

        [CacheRemoveAspect("IProcessService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<Process>(Messages.IdValueIsInvalid);
            }

            var process = _processDal.Get(p => p.ProcessId == id);
            _processDal.Delete(process);
            return new SuccessResult(Messages.ProcessDeleted);
        }

        public IDataResult<Process> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<Process>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<Process>(_processDal.Get(p => p.ProcessId == id));
        }

        [CacheAspect]
        public IDataResult<List<Process>> GetList()
        {
            return new SuccessDataResult<List<Process>>(_processDal.GetList().ToList());
        }

        public IDataResult<List<Process>> GetListByFilter(Expression<Func<Process, bool>> filter)
        {
            return new SuccessDataResult<List<Process>>(_processDal.GetList(filter).ToList());
        }

        [CacheAspect]
        public IDataResult<List<ProcessDetailDto>> GetProcessDetails()
        {
            return new SuccessDataResult<List<ProcessDetailDto>>(_processDal.GetProcessDetails().ToList());
        }

        [ValidationAspect(typeof(ProcessValidator))]
        [CacheRemoveAspect("IProcessService.Get")]
        public IResult Update(Process process)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(process.ProcessId));

            if (result != null)
            {
                return new ErrorDataResult<Process>(Messages.IdValueIsInvalid);
            }

            _processDal.Update(process);
            return new SuccessResult(Messages.ProcessUpdated);
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _processDal.Get(x => x.ProcessId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }
    }
}
