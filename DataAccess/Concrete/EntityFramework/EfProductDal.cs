using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfProductDal : EfEntityRepositoryBase<Product, BicycleServiceCenterContext>, IProductDal
    {
        public List<ProductDetailDto> GetProductDetailsList(Expression<Func<ProductDetailDto, bool>> filter)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from product in context.Products

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             join productCategory in context.ProductCategories
                             on product.CategoryId equals productCategory.ProductCategoryId

                             select new ProductDetailDto
                             {
                                 ProductId = product.ProductId,
                                 CategoryId = productCategory.ProductCategoryId,
                                 BrandId = productBrand.ProductBrandId,
                                 ProductName = product.Name,
                                 BrandName = productBrand.Name,
                                 CategoryName = productCategory.Name
                             };
                return filter == null ? result.ToList() : result.Where(filter).ToList();
            }
        }

        public ProductDetailDto GetProductDetails(Expression<Func<ProductDetailDto, bool>> filter)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from product in context.Products

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             join productCategory in context.ProductCategories
                             on product.CategoryId equals productCategory.ProductCategoryId

                             join inventory in context.Inventory
                             on product.ProductId equals inventory.ProductId

                             select new ProductDetailDto
                             {
                                 ProductId = product.ProductId,
                                 CategoryId = productCategory.ProductCategoryId,
                                 BrandId = productBrand.ProductBrandId,
                                 ProductName = product.Name,
                                 BrandName = productBrand.Name,
                                 CategoryName = productCategory.Name
                             };
                return result.Where(filter).SingleOrDefault();
            }
        }
    }
}
