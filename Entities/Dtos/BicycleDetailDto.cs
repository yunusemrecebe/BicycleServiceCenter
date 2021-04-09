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
        public int BrandId { get; set; }
        public int ModelId { get; set; }
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public string Owner { get; set; }
        public string? SerialNumber { get; set; }
    }
}
