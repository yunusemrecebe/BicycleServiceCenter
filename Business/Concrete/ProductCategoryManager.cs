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
using System;
using System.Collections.Generic;
using System.Linq;

namespace Business.Concrete
{
    public class ProductCategoryManager : IProductCategoryService
    {
        IProductCategoryDal _productCategoryDal;

        public ProductCategoryManager(IProductCategoryDal productCategoryDal)
        {
            _productCategoryDal = productCategoryDal;
        }

        [ValidationAspect(typeof(ProductCategoryValidator))]
        [CacheRemoveAspect("IProductCategoryService.Get")]
        public IResult Add(ProductCategory productCategory)
        {
            IResult result = BusinessRules.Run(CheckIfProductCategoryIsExists(productCategory.Name));

            if (result != null)
            {
                return result;
            }

            _productCategoryDal.Add(productCategory);
            return new SuccessResult(Messages.ProductCategoryAdded);
        }

        [CacheRemoveAspect("IProductCategoryService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return result;
            }
            var productCategory =_productCategoryDal.Get(p => p.ProductCategoryId == id);
            _productCategoryDal.Delete(productCategory);
            return new SuccessResult(Messages.ProductCategoryDeleted);
        }

        [SecuredOperation]
        public IDataResult<ProductCategory> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<ProductCategory>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<ProductCategory>(_productCategoryDal.Get(p => p.ProductCategoryId == id));
        }

        [SecuredOperation]
        [CacheAspect]
        public IDataResult<List<ProductCategory>> GetList()
        {
            return new SuccessDataResult<List<ProductCategory>>(_productCategoryDal.GetList().ToList());
        }

        [ValidationAspect(typeof(ProductCategoryValidator))]
        [CacheRemoveAspect("IProductCategoryService.Get")]
        public IResult Update(ProductCategory productCategory)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(productCategory.ProductCategoryId));

            if (result != null)
            {
                return result;
            }

            _productCategoryDal.Update(productCategory);
            return new SuccessResult(Messages.ProductCategoryUpdated);
        }

        private IResult CheckIfProductCategoryIsExists(string name)
        {
            var result = _productCategoryDal.GetList(p => p.Name == name).Any();

            if (result)
            {
                return new ErrorResult(Messages.ProductCategoryAlreadyExists);
            }

            return new SuccessResult();
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _productCategoryDal.Get(p => p.ProductCategoryId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }
    }
}
