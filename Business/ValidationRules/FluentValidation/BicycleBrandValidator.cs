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
                .NotEmpty().WithMessage("Marka adı boş bırakılamaz!")
                .Length(2, 50).WithMessage("Marka adı alanı en az 2, en fazla 50 karakter içermelidir!")
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Marka adı bilgisi özel karakter içeremez!");
        }
    }
}
