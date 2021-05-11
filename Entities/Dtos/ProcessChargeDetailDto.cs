using Core.Entities;

namespace Entities.Dtos
{
    public class ProcessChargeDetailDto : IDto
    {
        public int ProcessChargeId { get; set; }
        public int ProcessId { get; set; }
        public int ConsumedProductId { get; set; }
        public decimal Charge { get; set; }
    }
}
