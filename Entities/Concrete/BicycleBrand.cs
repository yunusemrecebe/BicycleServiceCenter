using Entities.Abstract;

namespace Entities.Concrete
{
    public class BicycleBrand : IEntity
    {
        public int BrandId { get; set; }
        public string Name { get; set; }
    }
}
