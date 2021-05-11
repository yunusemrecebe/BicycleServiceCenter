using Core.Entities;
using System;

namespace Entities.Dtos
{
    public class ConsumedProductDetailDto : IDto
    {
        public int ConsumedProductId { get; set; }
        public int ProcessId { get; set; }
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Product { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public int Quantity { get; set; }
        public double Discount { get; set; }
        public DateTime DateOfUse { get; set; }
    }
}
