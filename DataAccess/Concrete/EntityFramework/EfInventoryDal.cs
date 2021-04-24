using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.Concrete.EntityFramework
{
    public class EfInventoryDal : EfEntityRepositoryBase<Inventory, BicycleServiceCenterContext>, IInventoryDal
    {
        public List<InventoryDetailDto> GetInventoryDetails()
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from inventory in context.Inventory

                             join product in context.Products
                             on inventory.ProductId equals product.ProductId

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             select new InventoryDetailDto
                             {
                                 InventoryId = inventory.InventoryId,
                                 ProductId = product.ProductId,
                                 Product = productBrand.Name + " " + product.Name,
                                 ProductCode = product.ProductCode,
                                 PurchasePrice = inventory.PurchasePrice,
                                 SellPrice = inventory.SellPrice,
                                 UnitsInStock = inventory.UnitsInStock,
                                 Status = (inventory.Status == false ? "Satılamaz" : "Satılabilir")
                             };
                return result.ToList();
            }
        }

        public InventoryDetailDto GetInventoryDetailsById(int id)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from inventory in context.Inventory

                             join product in context.Products
                             on inventory.ProductId equals product.ProductId

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             where inventory.InventoryId == id

                             select new InventoryDetailDto
                             {
                                 InventoryId = inventory.InventoryId,
                                 ProductId = product.ProductId,
                                 Product = productBrand.Name + " " + product.Name,
                                 ProductCode = product.ProductCode,
                                 PurchasePrice = inventory.PurchasePrice,
                                 SellPrice = inventory.SellPrice,
                                 UnitsInStock = inventory.UnitsInStock,
                                 Status = (inventory.Status == false ? "Satılamaz" : "Satılabilir")
                             };
                return result.SingleOrDefault();
            }
        }
    }
}
