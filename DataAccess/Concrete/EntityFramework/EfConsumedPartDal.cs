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
    public class EfConsumedPartDal : EfEntityRepositoryBase<ConsumedPart, BicycleServiceCenterContext>, IConsumedPartDal
    {
        public ConsumedPartDetailDto GetConsumedPartDetails(Expression<Func<ConsumedPartDetailDto, bool>> filter)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from consumedPart in context.ConsumedParts

                             join product in context.Products
                             on consumedPart.ProductId equals product.ProductId

                             join process in context.Processes
                             on consumedPart.ProcessId equals process.ProcessId

                             join inventory in context.Inventory
                             on consumedPart.ProductId equals inventory.ProductId

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             select new ConsumedPartDetailDto
                             {
                                 ConsumedPartId = consumedPart.ConsumedPartId,
                                 ProductId = product.ProductId,
                                 ProcessId = process.ProcessId,
                                 ProductCode = product.ProductCode,
                                 Product = productBrand.Name + " " + product.Name,
                                 UnitPrice = inventory.SellPrice,
                                 TotalPrice = inventory.SellPrice * consumedPart.Quantity,
                                 Quantity = consumedPart.Quantity,
                                 Discount = consumedPart.Discount
                             };
                return result.Where(filter).SingleOrDefault();
            }
        }

        public List<ConsumedPartDetailDto> GetConsumedPartDetailsList(Expression<Func<ConsumedPartDetailDto, bool>> filter = null)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from consumedPart in context.ConsumedParts

                             join product in context.Products
                             on consumedPart.ProductId equals product.ProductId

                             join process in context.Processes
                             on consumedPart.ProcessId equals process.ProcessId

                             join inventory in context.Inventory
                             on consumedPart.ProductId equals inventory.ProductId

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             select new ConsumedPartDetailDto
                             {
                                 ConsumedPartId = consumedPart.ConsumedPartId,
                                 ProductId = product.ProductId,
                                 ProcessId = process.ProcessId,
                                 ProductCode = product.ProductCode,
                                 Product = productBrand.Name + " " + product.Name,
                                 UnitPrice = inventory.SellPrice,
                                 TotalPrice = inventory.SellPrice * consumedPart.Quantity,
                                 Quantity = consumedPart.Quantity,
                                 Discount = consumedPart.Discount
                             };
                return filter == null ? result.ToList() : result.Where(filter).ToList();
            }
        }
    }
}
