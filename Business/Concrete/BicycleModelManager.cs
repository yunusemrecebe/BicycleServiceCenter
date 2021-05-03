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
using System.Collections.Generic;
using System.Linq;

namespace Business.Concrete
{
    public class BicycleModelManager : IBicycleModelService
    {
        IBicycleModelDal _bicycleModelDal;

        public BicycleModelManager(IBicycleModelDal bicycleModelDal)
        {
            _bicycleModelDal = bicycleModelDal;
        }

        [ValidationAspect(typeof(BicycleModelValidator))]
        [CacheRemoveAspect("IBicycleModelService.Get")]
        public IResult Add(BicycleModel bicycleModel)
        {
            IResult result = BusinessRules.Run(CheckIfBicycleModelIsExists(bicycleModel.Name));

            if (result != null)
            {
                return result;
            }

            _bicycleModelDal.Add(bicycleModel);
            return new SuccessResult(Messages.BicycleModelAdded);
        }

        [CacheRemoveAspect("IBicycleModelService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return result;
            }

            var bicycleModel = _bicycleModelDal.Get(m => m.BicycleModelId == id);
            _bicycleModelDal.Delete(bicycleModel);
            return new SuccessResult(Messages.BicycleModelDeleted);
        }

        public IDataResult<BicycleModel> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<BicycleModel>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<BicycleModel>(_bicycleModelDal.Get(m => m.BicycleModelId == id));
        }

        public IDataResult<BicycleModelDto> GetDetailsById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<BicycleModelDto>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<BicycleModelDto>(_bicycleModelDal.GetBicycleModelDetailsById(id));
        }

        [SecuredOperation("Admin")]
        [CacheAspect]
        public IDataResult<List<BicycleModelDto>> GetDetails()
        {
            return new SuccessDataResult<List<BicycleModelDto>>(_bicycleModelDal.GetBicycleModelDetails().ToList());
        }

        [SecuredOperation("Admin")]
        [CacheAspect]
        public IDataResult<List<BicycleModel>> GetList()
        {
            return new SuccessDataResult<List<BicycleModel>>(_bicycleModelDal.GetList().ToList());

        }

        [CacheAspect]
        public IDataResult<List<BicycleModel>> GetListByBrand(int id)
        {
            return new SuccessDataResult<List<BicycleModel>>(_bicycleModelDal.GetList(m => m.BicycleBrand == id).ToList());
        }

        [ValidationAspect(typeof(BicycleModelValidator))]
        [CacheRemoveAspect("IBicycleModelService.Get")]
        public IResult Update(BicycleModel bicycleModel)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(bicycleModel.BicycleModelId));

            if (result != null)
            {
                return result;
            }

            _bicycleModelDal.Update(bicycleModel);
            return new SuccessResult(Messages.BicycleModelUpdated);
        }

        private IResult CheckIfBicycleModelIsExists(string bicycleModel)
        {
            var result = _bicycleModelDal.GetList(m => m.Name == bicycleModel).Any();

            if (result)
            {
                return new ErrorResult(Messages.BicycleModelExists);
            }

            return new SuccessResult();
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _bicycleModelDal.Get(x => x.BicycleModelId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }
    }
}
