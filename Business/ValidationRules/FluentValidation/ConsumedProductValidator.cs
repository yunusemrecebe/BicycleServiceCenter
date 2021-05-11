using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation
{
    public class ConsumedProductValidator : AbstractValidator<ConsumedProduct>
    {
        public ConsumedProductValidator()
        {
            RuleFor(c => c.ProcessId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Ürünün ekleneceği servis hizmeti mutlaka belirtilmelidir!");

            RuleFor(c => c.ProductId)
                .NotNull()
                .GreaterThan(0).WithMessage("Eklenecek ürün mutlaka seçilmelidir!");

            RuleFor(c => c.Quantity)
                .NotNull()
                .GreaterThan(0).WithMessage("Adet 0'dan büyük olmalıdır!");

            RuleFor(c => c.UnitPrice)
                .NotNull()
                .GreaterThanOrEqualTo(0).WithMessage("Ürün fiyatı 0'dan küçük olmamalıdır");

            RuleFor(c => c.Discount)
                .NotNull()
                .GreaterThanOrEqualTo(0).WithMessage("İndirim oranı 0'dan küçük olamaz!");

        }
    }
}
