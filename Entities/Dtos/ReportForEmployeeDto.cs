using System;

namespace Entities.Dtos
{
    public class ReportForEmployeeDto
    {
        public int EmployeeId { get; set; }
        public string Employee { get; set; }
        public string ServedCustomer { get; set; }
        public DateTime DateOfProcess { get; set; }
        public decimal ChargeOfHandledService { get; set; }
        public decimal TotalChargeOfHandledServices { get; set; }
        public int TotalQuantityOfHandledService { get; set; }
    }
}
