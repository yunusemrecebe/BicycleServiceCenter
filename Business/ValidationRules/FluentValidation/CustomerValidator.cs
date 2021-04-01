using Entities.Concrete;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.ValidationRules.FluentValidation
{
    public class CustomerValidator : AbstractValidator<Customer>
    {
        public CustomerValidator()
        {
            RuleFor(c => c.FirstName)
                .NotEmpty()
                .Length(2, 50)
                 .Matches(@"^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Model bilgisi özel karakter içeremez!");

            RuleFor(c => c.LastName)
                .NotEmpty()
                .Length(2, 50)
                 .Matches(@"^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Model bilgisi özel karakter içeremez!");

            RuleFor(c => c.Phone)
                .NotEmpty();
        }
    }
}
