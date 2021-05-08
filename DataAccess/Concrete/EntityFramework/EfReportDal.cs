using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Abstract;
using Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace DataAccess.Concrete.EntityFramework
{
    public class EfReportDal : IReportDal
    {
        public ReportForCustomerDto GetReportForCustomer(int customerId)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                int TotalQuantityOfReceivedProcesses = context.Processes.Where(p => p.CustomerId == customerId).Count();

                var OverallCharge = from processCharge in context.ProcessCharges

                                    join process in context.Processes
                                    on processCharge.ProcessId equals process.ProcessId

                                    where process.CustomerId == customerId

                                    select processCharge.Charge;

                var PurchasedProducts = from consumedPart in context.ConsumedParts

                                        join product in context.Products
                                        on consumedPart.ProductId equals product.ProductId

                                        join productBrand in context.ProductBrands
                                        on product.BrandId equals productBrand.ProductBrandId

                                        join process in context.Processes
                                        on consumedPart.ProcessId equals process.ProcessId

                                        where process.CustomerId == customerId

                                        select new ConsumedPartDetailDto
                                        {
                                            ConsumedPartId = consumedPart.ConsumedPartId,
                                            ProcessId = process.ProcessId,
                                            ProductId = product.ProductId,
                                            ProductCode = product.ProductCode,
                                            Product = $"{productBrand.Name} {product.Name}",
                                            Quantity = consumedPart.Quantity,
                                            Discount = consumedPart.Discount,
                                            UnitPrice = consumedPart.UnitPrice,
                                            TotalPrice = consumedPart.UnitPrice * consumedPart.Quantity
                                        };

                return new ReportForCustomerDto
                {
                    CustomerId = customerId,
                    OverallCharge = OverallCharge.Sum(),
                    PurchasedProducts = PurchasedProducts.ToList(),
                    TotalQuantityOfReceivedProcesses = TotalQuantityOfReceivedProcesses
                };

            }
        }

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

        public List<ReportForEmployeeDto> GetReportForEmployeeList(Expression<Func<bool, ReportForEmployeeDto>> filter = null)
        {
            List<ReportForEmployeeDto> employees = new List<ReportForEmployeeDto>();

            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                foreach (var employee in context.Employees)
                {
                    BicycleServiceCenterContext context1 = new BicycleServiceCenterContext();
                    int TotalQuantityOfHandledService = context1.Processes.Where(p => p.EmployeeId == employee.EmployeeId).Count();

                    employees.Add(new ReportForEmployeeDto
                    {
                        EmployeeId = employee.EmployeeId,
                        Employee = $"{employee.FirstName} {employee.LastName}",
                        TotalQuantityOfHandledService = TotalQuantityOfHandledService
                    });
                }

            }

            return employees;
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

        public List<ReportForProductDto> GetReportForProductList(Expression<Func<bool, ReportForProductDto>> filter = null)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                List<ReportForProductDto> products = new List<ReportForProductDto>();

                foreach (var product in context.Products)
                {

                    BicycleServiceCenterContext context1 = new BicycleServiceCenterContext();
                    int TotalQuantityOfSale = context1.ConsumedParts.Where(p => p.ProductId == product.ProductId).Sum(p => p.Quantity);
                    decimal TotalPriceOfSale = context1.ConsumedParts.Where(p => p.ProductId == product.ProductId).Sum(p => p.UnitPrice * p.Quantity);
                    var productBrand = context1.ProductBrands.Where(p => p.ProductBrandId == product.BrandId).SingleOrDefault();

                    products.Add(
                        new ReportForProductDto
                        {
                            ProductId = product.ProductId,
                            ProductCode = product.ProductCode,
                            Product = $"{productBrand.Name} {product.Name}",
                            TotalQuantityOfSale = TotalQuantityOfSale,
                            TotalPriceOfSale = TotalPriceOfSale
                        });
                }

                return products;
            }
        }
    }
}
