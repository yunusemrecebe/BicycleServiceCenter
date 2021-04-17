using Core.Entities;
using System;

namespace Entities.Dtos
{
    public class ProcessDetailDto : IDto
    {
        public int ProcessId { get; set; }
        public int EmployeeId { get; set; }
        public int CustomerId { get; set; }
        public int BicycleId { get; set; }
        public string EmployeeName { get; set; }
        public string CustomerName { get; set; }
        public string Bicycle { get; set; }
        public DateTime StartingDate { get; set; }
        public string CompetitionDate { get; set; }
        public string? Diagnostics { get; set; }
    }
}
