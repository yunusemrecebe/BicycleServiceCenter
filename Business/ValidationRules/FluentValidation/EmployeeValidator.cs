using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation
{
    public class EmployeeValidator : AbstractValidator<Employee>
    {
        public EmployeeValidator()
        {
            RuleFor(e => e.FirstName)
                .NotEmpty()
                .Length(2, 50)
                 .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("İsim bilgisi özel karakter içeremez!");


            RuleFor(e => e.LastName)
                .NotEmpty()
                .Length(2, 50)
                 .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Soyisim bilgisi özel karakter içeremez!");


            RuleFor(e => e.Phone)
                .NotEmpty();
        }
    }
}
