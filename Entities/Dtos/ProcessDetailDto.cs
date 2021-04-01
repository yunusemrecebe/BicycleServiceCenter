using Core.Entities;
using System;

namespace Entities.Dtos
{
    public class ProcessDetailDto : IDto
    {
        public int ProcessId { get; set; }
        public string Employee { get; set; }
        public string Customer { get; set; }
        public string BicycleBrand { get; set; }
        public string BicycleModel { get; set; }
        public DateTime StartingDate { get; set; }
        public string CompetitionDate { get; set; }
        public string? Diagnostics { get; set; }
    }
}
