using Core.Entities;

namespace Entities.Concrete
{
    public class ConsumedProduct : IEntity
    {
        public int ConsumedProductId { get; set; }
        public int ProcessId { get; set; }
        public int ProductId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public double Discount { get; set; }
    }
}
