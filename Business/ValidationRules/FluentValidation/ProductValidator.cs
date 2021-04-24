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
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ -]*$").WithMessage("Ürün Adı bilgisi özel karakter içeremez!");

            RuleFor(p => p.ProductCode)
                .NotEmpty().WithMessage("Ürün kodu boş bırakılamaz!")
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ -]*$").WithMessage("Ürün kodu bilgisi özel karakter içeremez!");

        }
    }
}
