using Entities.Abstract;

namespace Entities.Concrete
{
    public class ConsumedPart : IEntity
    {
        public int ConsumedPartId { get; set; }
        public string ConsumedParts { get; set; }
    }
}
