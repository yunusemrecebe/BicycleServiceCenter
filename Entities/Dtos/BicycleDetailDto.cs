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
        public int OwnerId { get; set; }
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public int ProductionDate { get; set; }
        public string OwnerName { get; set; }
        public string? SerialNumber { get; set; }
    }
}
