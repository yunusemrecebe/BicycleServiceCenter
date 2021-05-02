using Core.Entities.Concrete;
using Core.Utilities.Security.Jwt;
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RefreshToken>()
                .HasKey(r => r.UserId);
        }

        public DbSet<Bicycle> Bicycles { get; set; }
        public DbSet<BicycleBrand> BicycleBrands { get; set; }
        public DbSet<BicycleModel> BicycleModels { get; set; }
        public DbSet<ConsumedPart> ConsumedParts { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Process> Processes { get; set; }
        public DbSet<ProcessCharge> ProcessCharges { get; set; }
        public DbSet<Inventory> Inventory { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<OperationClaim> OperationClaims { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserOperationClaim> UserOperationClaims { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
