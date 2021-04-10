using Core.Entities;

namespace Entities.Dtos
{
    public class BicycleModelDto : IDto
    {
        public int BicycleModelId { get; set; }
        public int BicycleBrandId { get; set; }
        public string BicycleModelName { get; set; }
        public string BicycleBrandName { get; set; }
    }
}
