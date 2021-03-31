using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class BicycleDetailDto : IDto
    {
        public int BicycleId { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Owner { get; set; }
        public string? SerialNumber { get; set; }
    }
}
