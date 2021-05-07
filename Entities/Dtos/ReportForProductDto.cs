using Core.Entities;

namespace Entities.Dtos
{
    public class ReportForProductDto : IDto
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Product { get; set; }
        public int TotalQuantityOfSale { get; set; }
        public decimal TotalPriceOfSale{ get; set; }
    }
}
