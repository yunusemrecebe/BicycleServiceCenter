using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {
            RuleFor(p => p.BrandId)
                .GreaterThan(0).WithMessage("Ürün Markası mutlaka seçilmelidir!");

            RuleFor(p => p.CategoryId)
                .GreaterThan(0).WithMessage("Ürün Kategorisi mutlaka seçilmelidir!");

            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Ürün adı mutlaka girilmelidir!")
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Ürün Adı bilgisi özel karakter içeremez!");

            RuleFor(p => p.UnitsInStock)
                .GreaterThanOrEqualTo(0).WithMessage("Stoktaki ürün miktarı 0'dan az olamaz!")
                .NotNull().WithMessage("Stok bilgisi mutlaka girilmelidir!");


            RuleFor(p => p.UnitPrice)
                .GreaterThanOrEqualTo(0).WithMessage("Ürün fiyatı en az 0₺ olabilir!")
                .NotNull().WithMessage("Fiyat bilgisi mutlaka girilmelidir!");
                
        }
    }
}
