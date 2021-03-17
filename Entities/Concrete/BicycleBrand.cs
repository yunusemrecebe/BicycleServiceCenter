using Entities.Abstract;

namespace Entities.Concrete
{
    public class BicycleBrand : IEntity
    {
        public int BicycleBrandId { get; set; }
        public string Name { get; set; }
    }
}
