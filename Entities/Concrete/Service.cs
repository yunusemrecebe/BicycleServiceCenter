﻿using Entities.Abstract;
using System;

namespace Entities.Concrete
{
    public class Service : IEntity
    {
        public int ServiceId { get; set; }
        public int EmployeeId { get; set; }
        public int CustomerId { get; set; }
        public int BicycleId { get; set; }
        public int? ConsumedPartsId { get; set; }
        public DateTime StartingDate { get; set; }
        public string CompletionDate { get; set; }
        public string? RepairsToBeMade { get; set; }
    }
}
