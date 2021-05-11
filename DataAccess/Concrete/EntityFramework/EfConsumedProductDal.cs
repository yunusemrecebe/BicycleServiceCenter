using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfConsumedProductDal : EfEntityRepositoryBase<ConsumedProduct, BicycleServiceCenterContext>, IConsumedProductDal
    {
        public ConsumedProductDetailDto GetConsumedProductDetails(Expression<Func<ConsumedProductDetailDto, bool>> filter)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from consumedProduct in context.ConsumedProducts

                             join product in context.Products
                             on consumedProduct.ProductId equals product.ProductId

                             join process in context.Processes
                             on consumedProduct.ProcessId equals process.ProcessId

                             join inventory in context.Inventory
                             on consumedProduct.ProductId equals inventory.ProductId

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             select new ConsumedProductDetailDto
                             {
                                 ConsumedProductId = consumedProduct.ConsumedProductId,
                                 ProductId = product.ProductId,
                                 ProcessId = process.ProcessId,
                                 ProductCode = product.ProductCode,
                                 Product = productBrand.Name + " " + product.Name,
                                 UnitPrice = inventory.SellPrice,
                                 TotalPrice = inventory.SellPrice * consumedProduct.Quantity,
                                 Quantity = consumedProduct.Quantity,
                                 Discount = consumedProduct.Discount
                             };
                return result.Where(filter).SingleOrDefault();
            }
        }

        public List<ConsumedProductDetailDto> GetConsumedProductDetailsList(Expression<Func<ConsumedProductDetailDto, bool>> filter = null)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from consumedProduct in context.ConsumedProducts

                             join product in context.Products
                             on consumedProduct.ProductId equals product.ProductId

                             join process in context.Processes
                             on consumedProduct.ProcessId equals process.ProcessId

                             join inventory in context.Inventory
                             on consumedProduct.ProductId equals inventory.ProductId

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             select new ConsumedProductDetailDto
                             {
                                 ConsumedProductId = consumedProduct.ConsumedProductId,
                                 ProductId = product.ProductId,
                                 ProcessId = process.ProcessId,
                                 ProductCode = product.ProductCode,
                                 Product = productBrand.Name + " " + product.Name,
                                 UnitPrice = inventory.SellPrice,
                                 TotalPrice = consumedProduct.UnitPrice * consumedProduct.Quantity,
                                 Quantity = consumedProduct.Quantity,
                                 Discount = consumedProduct.Discount
                             };
                return filter == null ? result.ToList() : result.Where(filter).ToList();
            }
        }
    }
}
