using Autofac;
using Business.Abstract;
using Business.Concrete;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DependencyResolvers.Autofac
{
    public class AutofacBusinessModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<BicycleBrandManager>().As<IBicycleBrandService>().SingleInstance();
            builder.RegisterType<EfBicycleBrandDal>().As<IBicycleBrandDal>().SingleInstance();

            builder.RegisterType<BicycleModelManager>().As<IBicycleModelService>().SingleInstance();
            builder.RegisterType<EfBicycleModelDal>().As<IBicycleModelDal>().SingleInstance();

            builder.RegisterType<BicycleManager>().As<IBicycleService>().SingleInstance();
            builder.RegisterType<EfBicycleDal>().As<IBicycleDal>().SingleInstance();

            builder.RegisterType<ConsumedPartManager>().As<IConsumedPartService>().SingleInstance();
            builder.RegisterType<EfConsumedPartDal>().As<IConsumedPartDal>().SingleInstance();

            builder.RegisterType<CustomerManager>().As<ICustomerService>().SingleInstance();
            builder.RegisterType<EfCustomerDal>().As<ICustomerDal>().SingleInstance();

            builder.RegisterType<EmployeeManager>().As<IEmployeeService>().SingleInstance();
            builder.RegisterType<EfEmployeeDal>().As<IEmpoloyeeDal>().SingleInstance();

            builder.RegisterType<ProcessManager>().As<IProcessService>().SingleInstance();
            builder.RegisterType<EfProcessDal>().As<IProcessDal>().SingleInstance();

            builder.RegisterType<ProductManager>().As<IProductService>().SingleInstance();
            builder.RegisterType<EfProductDal>().As<IProductDal>().SingleInstance();

            builder.RegisterType<ProductBrandManager>().As<IProductBrandService>().SingleInstance();
            builder.RegisterType<EfProductBrandDal>().As<IProductBrandDal>().SingleInstance();

            builder.RegisterType<ProductCategoryManager>().As<IProductCategoryService>().SingleInstance();
            builder.RegisterType<EfProductCategoryDal>().As<IProductCategoryDal>().SingleInstance();
        }
    }
}
