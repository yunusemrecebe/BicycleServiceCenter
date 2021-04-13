using Core.Entities;

namespace Entities.Dtos
{
    public class ProductDetailDto : IDto
    {
        public int ProductId { get; set; }
        public int BrandId { get; set; }
        public int CategoryId { get; set; }
        public string ProductName { get; set; }
        public string BrandName { get; set; }
        public string CategoryName { get; set; }
        public decimal UnitPrice { get; set; }
        public int UnitsInStock { get; set; }
        public bool StockStatus { get; set; }
    }
}
