using Core.Entities;

namespace Entities.Concrete
{
    public class ProductBrand : IEntity
    {
        public int ProductBrandId { get; set; }
        public string Name { get; set; }
    }
}
