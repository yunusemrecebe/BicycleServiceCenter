using Core.Entities;

namespace Entities.Concrete
{
    public class ProcessCharge : IEntity
    {
        public int ProcessChargeId { get; set; }
        public int ProcessId { get; set; }
        public decimal Charge { get; set; }
    }
}
