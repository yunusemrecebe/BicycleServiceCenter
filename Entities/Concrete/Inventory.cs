using Core.Entities;

namespace Entities.Concrete
{
    public class Inventory : IEntity
    {
        public int InventoryId { get; set; }
        public int ProductId { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal SellPrice { get; set; }
        public int UnitsInStock { get; set; }
        public bool Status { get; set; }
    }
}
