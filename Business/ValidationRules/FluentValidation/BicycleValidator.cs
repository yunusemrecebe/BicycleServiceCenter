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
                .NotEmpty().WithMessage("Marka bilgisi mutlaka seçilmelidir!")
                .GreaterThan(0).WithMessage("Marka bilgisi mutlaka seçilmelidir!");
            
            RuleFor(x => x.ModelId)
                .NotEmpty().WithMessage("Model bilgisi mutlaka seçilmelidir!")
                .GreaterThan(0).WithMessage("Model bilgisi mutlaka seçilmelidir!");

            RuleFor(x => x.OwnerId)
                .NotEmpty().WithMessage("Sahip bilgisi mutlaka seçilmelidir!")
                .GreaterThan(0).WithMessage("Sahip bilgisi mutlaka seçilmelidir!");

            RuleFor(x => x.SerialNumber)
                .Matches(@"^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ -]*$").WithMessage("Seri Numarası yalnızca harfler, sayılar, '_' veya '-' işareti içerebilir!");
        }
    }
}
