using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {
            RuleFor(p => p.BrandId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(p => p.CategoryId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(p => p.Name)
                .NotEmpty()
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Ürün Adı bilgisi özel karakter içeremez!");

            RuleFor(p => p.UnitsInStock)
                .NotEmpty()
                .GreaterThanOrEqualTo(1);         

            RuleFor(p => p.UnitPrice)
                .NotEmpty()
                .GreaterThanOrEqualTo(1);
        }
    }
}
