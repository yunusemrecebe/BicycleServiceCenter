using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.Concrete.EntityFramework
{
    public class EfReportDal : IReportDal
    {
        //public ReportForCustomerDto GetReportForCustomer(int customerId)
        //{
        //    using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
        //    {
        //        int TotalQuantityOfReceivedProcesses = context.Processes.Where(p => p.CustomerId == customerId).Count();
                
        //        decimal OverallCharge = from processCharge in context.ProcessCharges
                                        
        //                                join process in context.Processes
        //                                on processCharge.

        //    }
        //}

        public ReportForEmployeeDto GetReportForEmployee(int employeeId)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                int TotalQuantityOfHandledService = context.Processes.Where(p => p.EmployeeId == employeeId).Count();
                var employee = context.Employees.Where(e => e.EmployeeId == employeeId).SingleOrDefault();

                return new ReportForEmployeeDto
                {
                    EmployeeId = employee.EmployeeId,
                    Employee = $"{employee.FirstName} {employee.LastName}",
                    TotalQuantityOfHandledService = TotalQuantityOfHandledService
                };
            }
        }

        public ReportForProductDto GetReportForProduct(int productId)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                int TotalQuantityOfSale = context.ConsumedParts.Where(p => p.ProductId == productId).Sum(p => p.Quantity);
                decimal TotalPriceOfSale = context.ConsumedParts.Where(p => p.ProductId == productId).Sum(p => p.UnitPrice * p.Quantity);

                var result = from product in context.Products

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             select new ReportForProductDto
                             {
                                 ProductId = product.ProductId,
                                 ProductCode = product.ProductCode,
                                 Product = $"{productBrand.Name} {product.Name}",
                                 TotalQuantityOfSale = TotalQuantityOfSale,
                                 TotalPriceOfSale = TotalPriceOfSale
                             };

                return result.Where(p => p.ProductId == productId).SingleOrDefault();
            }
        }
    }
}
