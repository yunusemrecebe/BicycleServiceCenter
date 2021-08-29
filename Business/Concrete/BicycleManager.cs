using Business.Abstract;
using Business.BusinessAspects.Autofac;
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
using System.Text;
using System.Threading.Tasks;

namespace Business.Concrete
{
    [SecuredOperation]
    public class BicycleManager : IBicycleService
    {
        IBicycleDal _bicycleDal;

        public BicycleManager(IBicycleDal bicycleDal)
        {
            _bicycleDal = bicycleDal;
        }

        [ValidationAspect(typeof(BicycleValidator))]
        [CacheRemoveAspect("IBicycleService.Get")]
        public IResult Add(Bicycle bicycle)
        {
            _bicycleDal.Add(bicycle);
            return new SuccessResult(Messages.BicycleAdded);
        }

        [CacheRemoveAspect("IBicycleService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<Bicycle>(Messages.IdValueIsInvalid);
            }

            var bicycle = _bicycleDal.Get(b => b.BicycleId == id);
            _bicycleDal.Delete(bicycle);
            return new SuccessResult(Messages.BicycleDeleted);
        }

        public IDataResult<List<BicycleDetailDto>> GetBicycleDetails()
        {
            return new SuccessDataResult<List<BicycleDetailDto>>(_bicycleDal.GetBicycleDetailsList().ToList());
        }

        public IDataResult<List<BicycleDetailDto>> GetBicycleDetailsByCustomerId(int customerId)
        {
            return new SuccessDataResult<List<BicycleDetailDto>>(_bicycleDal.GetBicycleDetailsList(c => c.OwnerId == customerId));
        }

        public IDataResult<BicycleDetailDto> GetBicycleDetailsById(int id)
        {
            return new SuccessDataResult<BicycleDetailDto>(_bicycleDal.GetBicycleDetails(b => b.BicycleId == id));
        }

        public IDataResult<Bicycle> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<Bicycle>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<Bicycle>(_bicycleDal.Get(b => b.BicycleId == id));
        }

        [CacheAspect]
        public IDataResult<List<Bicycle>> GetList()
        {
            return new SuccessDataResult<List<Bicycle>>(_bicycleDal.GetList().ToList());
        }

        [ValidationAspect(typeof(BicycleValidator))]
        [CacheRemoveAspect("IBicycleService.Get")]
        public IResult Update(Bicycle bicycle)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(bicycle.BicycleId));

            if (result != null)
            {
                return new ErrorDataResult<Bicycle>(Messages.IdValueIsInvalid);
            }

            _bicycleDal.Update(bicycle);
            return new SuccessResult(Messages.BicycleUpdated);
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _bicycleDal.Get(x => x.BicycleId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }
    }
}
