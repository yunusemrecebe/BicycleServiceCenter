using Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Concrete.EntityFramework.Abstract
{
    public class BicycleServiceCenterContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=DESKTOP-63SM79K;Database=BicycleServiceCenter;Trusted_Connection=true");
        }

        public DbSet<Bicycle> Bicycles { get; set; }
        public DbSet<BicycleBrand> BicycleBrands { get; set; }
        public DbSet<BicycleModel> BicycleModels { get; set; }
        public DbSet<ConsumedPart> ConsumedParts { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Process> Processes { get; set; }
    }
}
