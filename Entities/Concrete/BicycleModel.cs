using Entities.Abstract;

namespace Entities.Concrete
{
    public class BicycleModel : IEntity
    {
        public int BicycleModelId { get; set; }
        public string Name { get; set; }
    }
}
