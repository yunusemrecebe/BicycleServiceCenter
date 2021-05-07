using Core.Entities;
using System.Collections.Generic;

namespace Entities.Dtos
{
    public class ReportForCustomerDto : IDto
    {
        public int EmployeeId { get; set; }
        public int TotalQuantityOfReceivedProcesses { get; set; }
        public decimal OverallCharge { get; set; }
        public List<ProductDetailDto> PurchasedProducts { get; set; }
    }
}
