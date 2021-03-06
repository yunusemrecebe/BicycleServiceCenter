using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation
{
    public class ProductCategoryValidator : AbstractValidator<ProductCategory>
    {
        public ProductCategoryValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Kategori adı boş bırakılamaz!")
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Kategori Adı bilgisi özel karakter içeremez!");
        }
    }
}
