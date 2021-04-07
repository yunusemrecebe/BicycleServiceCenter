using Business.Abstract;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Transaction;
using Core.Aspects.Autofac.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concrete
{
    public class ProductBrandManager : IProductBrandService
    {
        IProductBrandDal _productBrandDal;

        public ProductBrandManager(IProductBrandDal productBrandDal)
        {
            _productBrandDal = productBrandDal;
        }

        [ValidationAspect(typeof(ProductBrandValidator))]
        [CacheRemoveAspect("IProductBrandService.Get")]
        public IResult Add(ProductBrand productBrand)
        {
            IResult result = BusinessRules.Run(CheckIfProductBrandIsExists(productBrand.Name));

            if (result != null)
            {
                return result;
            }

            _productBrandDal.Add(productBrand);
            return new SuccessResult(Messages.ProductBrandAdded);
        }

        [CacheRemoveAspect("IProductBrandService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return result;
            }

            var productBrand = _productBrandDal.Get(p => p.ProductBrandId == id);
            _productBrandDal.Delete(productBrand);
            return new SuccessResult(Messages.ProductBrandDeleted);
        }

        public IDataResult<ProductBrand> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<ProductBrand>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ProductBrand>(_productBrandDal.Get(p => p.ProductBrandId == id));
        }

        [CacheAspect]
        public IDataResult<List<ProductBrand>> GetList()
        {
            return new SuccessDataResult<List<ProductBrand>>(_productBrandDal.GetList().ToList());
        }

        [TransactionScopeAspect]
        [ValidationAspect(typeof(ProductBrandValidator))]
        [CacheRemoveAspect("IProductBrandService.Get")]
        public IResult Update(ProductBrand productBrand)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(productBrand.ProductBrandId));

            if (result != null)
            {
                return result;
            }

            _productBrandDal.Update(productBrand);

            IResult result2 = BusinessRules.Run(CheckPhoneNumberIsUsed(productBrand.Name));

            if (result2 != null)
            {
                throw new ValidationException(result2.Message);
            }

            return new SuccessResult(Messages.ProductBrandUpdated);
        }

        private IResult CheckIfProductBrandIsExists(string name)
        {
            var result = _productBrandDal.GetList(p => p.Name == name).Any();

            if (result)
            {
                return new ErrorResult(Messages.ProductBrandAlreadyExists);
            }

            return new SuccessResult();
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _productBrandDal.Get(p => p.ProductBrandId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }

        private IResult CheckPhoneNumberIsUsed(string name)
        {
                var result = _productBrandDal.GetList(p => p.Name == name);

                if (result.Count > 1)
                {
                    return new ErrorResult(Messages.ProductBrandAlreadyExists);
                }

            return new SuccessResult();
        }
    }
}
