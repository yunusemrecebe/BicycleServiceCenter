using Entities.Concrete;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.ValidationRules.FluentValidation
{
    public class ProductBrandValidator : AbstractValidator<ProductBrand>
    {
        public ProductBrandValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty()
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Marka Adı bilgisi özel karakter içeremez!");
        }
    }
}
