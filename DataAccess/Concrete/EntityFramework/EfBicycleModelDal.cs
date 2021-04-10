using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfBicycleModelDal : EfEntityRepositoryBase<BicycleModel, BicycleServiceCenterContext>, IBicycleModelDal
    {
        public List<BicycleModelDto> GetBicycleModelDetails()
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from model in context.BicycleModels
                             join brand in context.BicycleBrands
                             on model.BicycleBrand equals brand.BicycleBrandId
                             select new BicycleModelDto
                             {
                                 BicycleModelId = model.BicycleModelId,
                                 BicycleBrandId = brand.BicycleBrandId,
                                 BicycleModelName = model.Name,
                                 BicycleBrandName = brand.Name
                             };
                return result.ToList();
            }
        }

        public BicycleModelDto GetBicycleModelDetailsById(int id)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from model in context.BicycleModels
                             join brand in context.BicycleBrands
                             on model.BicycleBrand equals brand.BicycleBrandId
                             where model.BicycleModelId == id
                             select new BicycleModelDto
                             {
                                 BicycleModelId = model.BicycleModelId,
                                 BicycleBrandId = brand.BicycleBrandId,
                                 BicycleModelName = model.Name,
                                 BicycleBrandName = brand.Name
                             };
                return result.SingleOrDefault();
            }
        }
    }
}
