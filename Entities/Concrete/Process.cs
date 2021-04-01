using Core.Entities;
using System;

namespace Entities.Concrete
{
    public class Process : IEntity
    {
        public int ProcessId { get; set; }
        public int EmployeeId { get; set; }
        public int CustomerId { get; set; }
        public int BicycleId { get; set; }
        public DateTime StartingDate { get; set; }
        public string CompletionDate { get; set; }
        public string? Diagnostics { get; set; }
    }
}
