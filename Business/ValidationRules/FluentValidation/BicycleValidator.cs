using Entities.Concrete;
using FluentValidation;
using System;

namespace Business.ValidationRules.FluentValidation
{
    public class BicycleValidator : AbstractValidator<Bicycle>
    {
        public BicycleValidator()
        {
            RuleFor(x => x.BrandId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");
            
            RuleFor(x => x.ModelId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(x => x.OwnerId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(x => x.SerialNumber)
                .Matches(@"^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ -]*$").WithMessage("Seri Numarası yalnızca harfler, sayılar, '_' veya '-' işareti içerebilir!");
        }
    }
}
