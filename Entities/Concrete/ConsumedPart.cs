using Core.Entities;

namespace Entities.Concrete
{
    public class ConsumedPart : IEntity
    {
        public int ConsumedPartId { get; set; }

        public int ProcessId { get; set; }
        public int ProductId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public float Discount { get; set; }
    }
}
