using Entities.Concrete;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.ValidationRules.FluentValidation
{
    class BicycleBrandValidator : AbstractValidator<BicycleBrand>
    {
        public BicycleBrandValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty()
                .Length(2, 50)
                .Matches(@"^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]*$").WithMessage("Marka bilgisi özel karakter içeremez!");
        }
    }
}
