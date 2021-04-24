using Core.DataAccess.EntityFramework;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Concrete;
using Entities.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.Concrete.EntityFramework.Concrete
{
    public class EfProcessDal : EfEntityRepositoryBase<Process, BicycleServiceCenterContext>, IProcessDal
    {
        public List<ProcessDetailDto> GetProcessDetails()
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from process in context.Processes
                             join employee in context.Employees
                             on process.EmployeeId equals employee.EmployeeId

                             join customer in context.Customers
                             on process.CustomerId equals customer.CustomerId

                             join bicycle in context.Bicycles
                             on process.BicycleId equals bicycle.BicycleId

                             join bicycleBrand in context.BicycleBrands
                             on bicycle.BrandId equals bicycleBrand.BicycleBrandId

                             join bicycleModel in context.BicycleModels
                             on bicycle.ModelId equals bicycleModel.BicycleModelId

                             select new ProcessDetailDto
                             {
                                 ProcessId = process.ProcessId,
                                 EmployeeId = employee.EmployeeId,
                                 CustomerId = customer.CustomerId,
                                 BicycleId = bicycle.BicycleId,
                                 EmployeeName = employee.FirstName + " " + employee.LastName,
                                 CustomerName = customer.FirstName + " " + customer.LastName,
                                 Bicycle = bicycleBrand.Name + " " + bicycleModel.Name,
                                 StartingDate = process.StartingDate,
                                 CompetitionDate = process.CompletionDate,
                                 Diagnostics = process.Diagnostics,
                                 Status = process.Status
                             };
                return result.ToList();

            }
        }

        public ProcessDetailDto GetProcessDetailsById(int id)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from process in context.Processes
                             join employee in context.Employees
                             on process.EmployeeId equals employee.EmployeeId

                             join customer in context.Customers
                             on process.CustomerId equals customer.CustomerId

                             join bicycle in context.Bicycles
                             on process.BicycleId equals bicycle.BicycleId

                             join bicycleBrand in context.BicycleBrands
                             on bicycle.BrandId equals bicycleBrand.BicycleBrandId

                             join bicycleModel in context.BicycleModels
                             on bicycle.ModelId equals bicycleModel.BicycleModelId

                             where process.ProcessId == id

                             select new ProcessDetailDto
                             {
                                 ProcessId = process.ProcessId,
                                 EmployeeId = employee.EmployeeId,
                                 CustomerId = customer.CustomerId,
                                 BicycleId = bicycle.BicycleId,
                                 EmployeeName = employee.FirstName + " " + employee.LastName,
                                 CustomerName = customer.FirstName + " " + customer.LastName,
                                 Bicycle = bicycleBrand.Name + " " + bicycleModel.Name,
                                 StartingDate = process.StartingDate,
                                 CompetitionDate = process.CompletionDate,
                                 Diagnostics = process.Diagnostics,
                                 Status = process.Status
                             };
                return result.SingleOrDefault();

            }
        }
    }
}
