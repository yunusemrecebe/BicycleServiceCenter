using Core.Entities;

namespace Entities.Concrete
{
    public class BicycleModel : IEntity
    {
        public int BicycleModelId { get; set; }
        public int BicycleBrand { get; set; }
        public string Name { get; set; }
    }
}
