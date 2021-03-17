﻿using Entities.Abstract;

namespace Entities.Concrete
{
    public class Bicycle : IEntity
    {
        public int BicycleId { get; set; }
        public int BrandId { get; set; }
        public int ModelId { get; set; }
        public int OwnerId { get; set; }
        public string? SerialNumber { get; set; }
    }
}
