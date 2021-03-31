﻿using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfBicycleDal : EfEntityRepositoryBase<Bicycle, BicycleServiceCenterContext>, IBicycleDal
    {
        public List<BicycleDetailDto> GetBicycleDetails()
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from bicyle in context.Bicycles
                             join bicycleBrand in context.BicycleBrands
                             on bicyle.BrandId equals bicycleBrand.BicycleBrandId

                             join bicyleModel in context.BicycleModels
                             on bicyle.ModelId equals bicyleModel.BicycleModelId

                             join customers in context.Customers
                             on bicyle.OwnerId equals customers.CustomerId

                             select new BicycleDetailDto
                             {
                                 BicycleId = bicyle.BicycleId,
                                 Brand = bicycleBrand.Name,
                                 Model = bicyleModel.Name,
                                 Owner = customers.FirstName + " " + customers.LastName,
                                 SerialNumber = bicyle.SerialNumber
                             };
                return result.ToList();
            }
        }
    }
}
