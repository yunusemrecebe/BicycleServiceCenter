using Core.Entities;
using System;

namespace Entities.Dtos
{
    public class ReportForProductDto : IDto
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Product { get; set; }
        public DateTime DateOfSale { get; set; }
        public int QuantityOfSaleByDate { get; set; }
        public int TotalQuantityOfSale { get; set; }
        public decimal TotalPriceOfSale{ get; set; }
    }
}
