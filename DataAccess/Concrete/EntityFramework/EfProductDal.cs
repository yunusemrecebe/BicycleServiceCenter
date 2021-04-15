using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfProductDal : EfEntityRepositoryBase<Product, BicycleServiceCenterContext>, IProductDal
    {
        public List<ProductDetailDto> GetProductDetails()
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
                return result.ToList();
            }
        }

        public List<ProductDetailDto> GetProductDetailsById(int id)
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

                             where product.ProductId == id

                             select new ProductDetailDto
                             {
                                 ProductId = product.ProductId,
                                 CategoryId = productCategory.ProductCategoryId,
                                 BrandId = productBrand.ProductBrandId,
                                 ProductName = product.Name,
                                 BrandName = productBrand.Name,
                                 CategoryName = productCategory.Name
                             };
                return result.ToList();
            }
        }
    }
}
