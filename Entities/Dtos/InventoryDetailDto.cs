using Core.Entities;

namespace Entities.Dtos
{
    public class InventoryDetailDto : IDto
    {
        public int InventoryId { get; set; }
        public int ProductId { get; set; }
        public string Product { get; set; }
        public string ProductCode { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal SellPrice { get; set; }
        public int UnitsInStock { get; set; }
        public string Status { get; set; }
    }
}
