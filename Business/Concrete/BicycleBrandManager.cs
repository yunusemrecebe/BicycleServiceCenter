using Business.Abstract;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using System.Collections.Generic;
using System.Linq;

namespace Business.Concrete
{
    public class BicycleBrandManager : IBicycleBrandService
    {
        IBicycleBrandDal _bicycleBrandDal;

        public BicycleBrandManager(IBicycleBrandDal bicycleBrandDal)
        {
            _bicycleBrandDal = bicycleBrandDal;
        }

        [ValidationAspect(typeof(BicycleBrandValidator))]
        [CacheRemoveAspect("IBicycleBrandService.Get")]
        public IResult Add(BicycleBrand bicycleBrand)
        {
            IResult result = BusinessRules.Run(CheckIfBicycleBrandIsExists(bicycleBrand.Name));

            if (result != null)
            {
                return result;
            }

            _bicycleBrandDal.Add(bicycleBrand);
            return new SuccessResult(Messages.BicyleBrandAdded);
        }

        [CacheRemoveAspect("IBicycleBrandService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return result;
            }

            var bicyleBrand = _bicycleBrandDal.Get(b => b.BicycleBrandId == id);
            _bicycleBrandDal.Delete(bicyleBrand);
            return new SuccessResult(Messages.BicycleBrandDeleted);
        }

        [CacheAspect]
        public IDataResult<List<BicycleBrand>> GetList()
        {
            return new SuccessDataResult<List<BicycleBrand>>(_bicycleBrandDal.GetList().ToList());
        }

        public IDataResult<BicycleBrand> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<BicycleBrand>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<BicycleBrand>(_bicycleBrandDal.Get(b => b.BicycleBrandId == id));
        }

        [ValidationAspect(typeof(BicycleBrandValidator))]
        [CacheRemoveAspect("IBicycleBrandService.Get")]
        public IResult Update(BicycleBrand bicycleBrand)
        {
            IResult result = BusinessRules.Run(CheckIfBicycleBrandIsExists(bicycleBrand.Name), CheckIdValueIsTrue(bicycleBrand.BicycleBrandId));

            if (result != null)
            {
                return result;
            }

            _bicycleBrandDal.Update(bicycleBrand);
            return new SuccessResult(Messages.BicycleBrandUpdated);
        }

        private IResult CheckIfBicycleBrandIsExists(string bicycleBrand)
        {
            var result = _bicycleBrandDal.GetList(b => b.Name == bicycleBrand).Any();

            if (result)
            {
                return new ErrorResult(Messages.BrandAlreadyExists);
            }

            return new SuccessResult();
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _bicycleBrandDal.Get(x => x.BicycleBrandId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }
    }
}
