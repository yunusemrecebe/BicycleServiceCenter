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

                var PurchasedProducts = from consumedProduct in context.ConsumedProducts

                                        join product in context.Products
                                        on consumedProduct.ProductId equals product.ProductId

                                        join productBrand in context.ProductBrands
                                        on product.BrandId equals productBrand.ProductBrandId

                                        join process in context.Processes
                                        on consumedProduct.ProcessId equals process.ProcessId

                                        where process.CustomerId == customerId

                                        select new ConsumedProductDetailDto
                                        {
                                            ConsumedProductId = consumedProduct.ConsumedProductId,
                                            ProcessId = process.ProcessId,
                                            ProductId = product.ProductId,
                                            ProductCode = product.ProductCode,
                                            Product = $"{productBrand.Name} {product.Name}",
                                            Quantity = consumedProduct.Quantity,
                                            Discount = consumedProduct.Discount,
                                            UnitPrice = consumedProduct.UnitPrice,
                                            TotalPrice = consumedProduct.UnitPrice * consumedProduct.Quantity,
                                            DateOfUse = consumedProduct.DateOfUse

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

        public List<ReportForEmployeeDto> GetReportForEmployee(int employeeId)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from employee in context.Employees

                             join process in context.Processes
                             on employee.EmployeeId equals process.EmployeeId

                             where employee.EmployeeId == employeeId

                             select new ReportForEmployeeDto
                             {
                                 EmployeeId = employee.EmployeeId,
                                 Employee = $"{employee.FirstName} {employee.LastName}",
                                 DateOfProcess = process.StartingDate,
                                 TotalQuantityOfHandledService = context.Processes.Where(p => p.EmployeeId == employeeId).Count()
                             };

                return result.ToList();
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

        public List<ReportForProductDto> GetReportForProduct(int productId)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from product in context.Products

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             join consumedProduct in context.ConsumedProducts
                             on product.ProductId equals consumedProduct.ProductId

                             where product.ProductId == productId

                             select new ReportForProductDto
                             {
                                 ProductId = product.ProductId,
                                 ProductCode = product.ProductCode,
                                 Product = $"{productBrand.Name} {product.Name}",
                                 DateOfSale = consumedProduct.DateOfUse,
                                 QuantityOfSaleByDate = consumedProduct.Quantity,
                                 TotalQuantityOfSale = context.ConsumedProducts.Where(p => p.ProductId == productId).Sum(p => p.Quantity),
                                 TotalPriceOfSale = context.ConsumedProducts.Where(p => p.ProductId == productId).Sum(p => p.UnitPrice * p.Quantity)
                             };

                return result.ToList();
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

                    int TotalQuantityOfSale = context1.ConsumedProducts.Where(p => p.ProductId == product.ProductId).Sum(p => p.Quantity);
                    decimal TotalPriceOfSale = context1.ConsumedProducts.Where(p => p.ProductId == product.ProductId).Sum(p => p.UnitPrice * p.Quantity);
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

        public ReportForCustomerDto GetFilteredReportForCustomerByDateRange(int customerId, string begin, string end)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                int TotalQuantityOfReceivedProcesses = context.Processes.Where(p => p.CustomerId == customerId && p.StartingDate.Day >= Convert.ToDateTime(begin).Day && p.StartingDate.Day <= Convert.ToDateTime(end).Day).Count();

                var OverallCharge = from processCharge in context.ProcessCharges

                                    join process in context.Processes
                                    on processCharge.ProcessId equals process.ProcessId

                                    where process.CustomerId == customerId && (process.StartingDate.Day >= Convert.ToDateTime(begin).Day && process.StartingDate.Day <= Convert.ToDateTime(end).Day)

                                    select processCharge.Charge;

                var PurchasedProducts = from consumedProduct in context.ConsumedProducts

                                        join product in context.Products
                                        on consumedProduct.ProductId equals product.ProductId

                                        join productBrand in context.ProductBrands
                                        on product.BrandId equals productBrand.ProductBrandId

                                        join process in context.Processes
                                        on consumedProduct.ProcessId equals process.ProcessId

                                        where process.CustomerId == customerId && (consumedProduct.DateOfUse.Day >= Convert.ToDateTime(begin).Day && consumedProduct.DateOfUse.Day <= Convert.ToDateTime(end).Day)

                                        select new ConsumedProductDetailDto
                                        {
                                            ConsumedProductId = consumedProduct.ConsumedProductId,
                                            ProcessId = process.ProcessId,
                                            ProductId = product.ProductId,
                                            ProductCode = product.ProductCode,
                                            Product = $"{productBrand.Name} {product.Name}",
                                            Quantity = consumedProduct.Quantity,
                                            Discount = consumedProduct.Discount,
                                            UnitPrice = consumedProduct.UnitPrice,
                                            TotalPrice = consumedProduct.UnitPrice * consumedProduct.Quantity,
                                            DateOfUse = consumedProduct.DateOfUse

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

        public List<ReportForProductDto> GetFilteredReportForProductByDateRange(int productId, string begin, string end)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from product in context.Products

                             join productBrand in context.ProductBrands
                             on product.BrandId equals productBrand.ProductBrandId

                             join consumedProduct in context.ConsumedProducts
                             on product.ProductId equals consumedProduct.ProductId

                             where product.ProductId == productId && (consumedProduct.DateOfUse.Day >= Convert.ToDateTime(begin).Day && consumedProduct.DateOfUse.Day <= Convert.ToDateTime(end).Day)

                             select new ReportForProductDto
                             {
                                 ProductId = product.ProductId,
                                 ProductCode = product.ProductCode,
                                 Product = $"{productBrand.Name} {product.Name}",
                                 DateOfSale = consumedProduct.DateOfUse,
                                 QuantityOfSaleByDate = consumedProduct.Quantity,
                                 TotalQuantityOfSale = context.ConsumedProducts.Where(p => p.ProductId == productId && (p.DateOfUse.Day >= Convert.ToDateTime(begin).Day && p.DateOfUse.Day <= Convert.ToDateTime(end).Day))
                                 .Sum(p => p.Quantity),
                                 TotalPriceOfSale = context.ConsumedProducts.Where(p => p.ProductId == productId && (p.DateOfUse.Day >= Convert.ToDateTime(begin).Day && p.DateOfUse.Day <= Convert.ToDateTime(end).Day))
                                 .Sum(p => p.UnitPrice * p.Quantity)
                             };

                return result.ToList();
            }
        }

        public List<ReportForEmployeeDto> GetFilteredReportForEmployeeByDateRange(int employeeId, string begin, string end)
        {
            using (BicycleServiceCenterContext context = new BicycleServiceCenterContext())
            {
                var result = from employee in context.Employees

                             join process in context.Processes
                             on employee.EmployeeId equals process.EmployeeId

                             where employee.EmployeeId == employeeId && (process.StartingDate.Day >= Convert.ToDateTime(begin).Day && process.StartingDate.Day <= Convert.ToDateTime(end).Day)

                             select new ReportForEmployeeDto
                             {
                                 EmployeeId = employee.EmployeeId,
                                 Employee = $"{employee.FirstName} {employee.LastName}",
                                 DateOfProcess = process.StartingDate,
                                 TotalQuantityOfHandledService = context.Processes.Where(p => p.EmployeeId == employeeId && (p.StartingDate.Day >= Convert.ToDateTime(begin).Day && p.StartingDate.Day <= Convert.ToDateTime(end).Day))
                                 .Count()
                             };

                return result.ToList();
            }
        }
    }
}
