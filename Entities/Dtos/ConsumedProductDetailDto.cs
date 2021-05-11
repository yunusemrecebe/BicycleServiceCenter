using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
