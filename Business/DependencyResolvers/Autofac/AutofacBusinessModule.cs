using Autofac;
using Autofac.Extras.DynamicProxy;
using Business.Abstract;
using Business.Concrete;
using Castle.DynamicProxy;
using Core.Utilities.Interceptors;
using Core.Utilities.Security.Jwt;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework;
using DataAccess.Concrete.EntityFramework.Concrete;

namespace Business.DependencyResolvers.Autofac
{
    public class AutofacBusinessModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<BicycleBrandManager>().As<IBicycleBrandService>();
            builder.RegisterType<EfBicycleBrandDal>().As<IBicycleBrandDal>();

            builder.RegisterType<BicycleModelManager>().As<IBicycleModelService>();
            builder.RegisterType<EfBicycleModelDal>().As<IBicycleModelDal>();

            builder.RegisterType<BicycleManager>().As<IBicycleService>();
            builder.RegisterType<EfBicycleDal>().As<IBicycleDal>();

            builder.RegisterType<ConsumedProductManager>().As<IConsumedProductService>();
            builder.RegisterType<EfConsumedProductDal>().As<IConsumedProductDal>();

            builder.RegisterType<CustomerManager>().As<ICustomerService>();
            builder.RegisterType<EfCustomerDal>().As<ICustomerDal>();

            builder.RegisterType<EmployeeManager>().As<IEmployeeService>();
            builder.RegisterType<EfEmployeeDal>().As<IEmpoloyeeDal>();

            builder.RegisterType<ProcessManager>().As<IProcessService>();
            builder.RegisterType<EfProcessDal>().As<IProcessDal>();

            builder.RegisterType<ProcessChargeManager>().As<IProcessChargeService>();
            builder.RegisterType<EfProcessChargeDal>().As<IProcessChargeDal>();

            builder.RegisterType<InventoryManager>().As<IInventoryService>();
            builder.RegisterType<EfInventoryDal>().As<IInventoryDal>();

            builder.RegisterType<ProductManager>().As<IProductService>();
            builder.RegisterType<EfProductDal>().As<IProductDal>();

            builder.RegisterType<ProductBrandManager>().As<IProductBrandService>();
            builder.RegisterType<EfProductBrandDal>().As<IProductBrandDal>();

            builder.RegisterType<ProductCategoryManager>().As<IProductCategoryService>();
            builder.RegisterType<EfProductCategoryDal>().As<IProductCategoryDal>();

            builder.RegisterType<ReportManager>().As<IReportService>();
            builder.RegisterType<EfReportDal>().As<IReportDal>();

            builder.RegisterType<UserManager>().As<IUserService>();
            builder.RegisterType<EfUserDal>().As<IUserDal>();

            builder.RegisterType<AuthManager>().As<IAuthService>();
            builder.RegisterType<JwtHelper>().As<ITokenHelper>();

            builder.RegisterType<RefreshTokenManager>().As<IRefreshTokenService>();
            builder.RegisterType<EfRefreshTokenDal>().As<IRefreshTokenDal>();

            var assembly = System.Reflection.Assembly.GetExecutingAssembly();

            builder.RegisterAssemblyTypes(assembly).AsImplementedInterfaces()
                .EnableInterfaceInterceptors(new ProxyGenerationOptions()
                {
                    Selector = new AspectInterceptorSelector()
                }).SingleInstance();
        }
    }
}
