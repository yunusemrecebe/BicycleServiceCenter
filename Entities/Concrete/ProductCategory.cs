using Core.Entities;

namespace Entities.Concrete
{
    public class ProductCategory : IEntity
    {
        public int ProductCategoryId { get; set; }
        public string Name { get; set; }
    }
}
