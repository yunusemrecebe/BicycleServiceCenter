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
using Entities.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace Business.Concrete
{
    public class ProductManager : IProductService
    {
        IProductDal _productDal;
        IInventoryService _inventoryService;
        IConsumedPartService _consumedPartService;

        public ProductManager(IProductDal productDal, IInventoryService inventoryService, IConsumedPartService consumedPartService)
        {
            _productDal = productDal;
            _inventoryService = inventoryService;
            _consumedPartService = consumedPartService;
        }

        [ValidationAspect(typeof(ProductValidator))]
        [CacheRemoveAspect("IProductService.Get")]
        public IResult Add(Product product)
        {
            IResult result = BusinessRules.Run(CheckIfProductIsExists(product.Name), CheckIfProductCodeIsExists(product.ProductCode));

            if (result != null)
            {
                return result;
            }

            _productDal.Add(product);
            _inventoryService.Add(new Inventory { ProductId = product.ProductId });
            return new SuccessResult(Messages.ProductAdded);
        }

        [CacheRemoveAspect("IProductService.Get")]
        public IResult Delete(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id), CheckIfProductHasStock(id), CheckIfProductUsedInConsumedParts(id));

            if (result != null)
            {
                return result;
            }

            var product = _productDal.Get(p => p.ProductId == id);
            _productDal.Delete(product);
            return new SuccessResult(Messages.ProductDeleted);
        }

        public IDataResult<Product> GetById(int id)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(id));

            if (result != null)
            {
                return new ErrorDataResult<Product>(Messages.IdValueIsInvalid);
            }

            return new SuccessDataResult<Product>(_productDal.Get(p => p.ProductId == id));
        }

        public IDataResult<ProductDetailDto> GetProductDetailsById(int id)
        {
            return new SuccessDataResult<ProductDetailDto>(_productDal.GetProductDetails(p => p.ProductId == id));
        }

        [CacheAspect]
        public IDataResult<List<Product>> GetList()
        {
            return new SuccessDataResult<List<Product>>(_productDal.GetList().ToList());
        }

        [CacheAspect]
        public IDataResult<List<ProductDetailDto>> GetListByCategoryId(int id)
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetailsList(p => p.CategoryId == id).ToList());
        }

        [CacheAspect]
        public IDataResult<List<ProductDetailDto>> GetListOnSaleByCategoryId(int id)
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetailsList(p => p.CategoryId == id && p.Status == true).ToList());
        }

        [CacheAspect]
        public IDataResult<List<ProductDetailDto>> GetProductDetails()
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetailsList().ToList());
        }

        [ValidationAspect(typeof(ProductValidator))]
        [CacheRemoveAspect("IProductService.Get")]
        public IResult Update(Product product)
        {
            IResult result = BusinessRules.Run(CheckIdValueIsTrue(product.ProductId));

            if (result != null)
            {
                return result;
            }

            _productDal.Update(product);
            return new SuccessResult(Messages.ProductUpdated);
        }

        private IResult CheckIfProductIsExists(string name)
        {
            var result = _productDal.GetList(p => p.Name == name).Any();

            if (result)
            {
                return new ErrorResult(Messages.ProductAlreadyExists);
            }

            return new SuccessResult();
        }

        private IResult CheckIfProductCodeIsExists(string productCode)
        {
            var result = _productDal.GetList(p => p.ProductCode == productCode).Any();

            if (result)
            {
                return new ErrorResult(Messages.ProductCodeAlreadyExists);
            }

            return new SuccessResult();
        }

        private IResult CheckIdValueIsTrue(int id)
        {
            var result = _productDal.Get(p => p.ProductId == id);

            if (result == null)
            {
                return new ErrorResult(Messages.IdValueIsInvalid);
            }

            return new SuccessResult();
        }

        private IResult CheckIfProductHasStock(int id)
        {
            var result = _inventoryService.GetListByFilter(s => s.ProductId == id).Data.Any();

            if (result)
            {
                return new ErrorResult(Messages.ProductHasStock);
            }

            return new SuccessResult();
        }

        private IResult CheckIfProductUsedInConsumedParts(int id)
        {
            var result = _consumedPartService.GetByProductId(id).Data;

            if (result != null)
            {
                return new ErrorResult(Messages.ProductIsUsedInConsumedParts);
            }

            return new SuccessResult();
        }
    }
}
