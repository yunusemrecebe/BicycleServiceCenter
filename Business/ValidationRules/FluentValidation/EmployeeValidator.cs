using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation
{
    public class EmployeeValidator : AbstractValidator<Employee>
    {
        public EmployeeValidator()
        {
            RuleFor(e => e.FirstName)
                .NotEmpty().WithMessage("İsim alanı boş bırakılamaz!")
                .Length(2, 50).WithMessage("İsim alanı en az 2, en fazla 50 karakter içermelidir!")
                .Matches(@"^[a-zA-ZğüşıöçĞÜŞİÖÇ ]*$").WithMessage("İsim bilgisi yalnızca harflerden oluşabilir!");

            RuleFor(e => e.LastName)
                .NotEmpty().WithMessage("Soyisim alanı boş bırakılamaz!")
                .Length(2, 50).WithMessage("Soyisim alanı en az 2, en fazla 50 karakter içermelidir!")
                .Matches(@"^[a-zA-ZğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Soyisim bilgisi yalnızca harflerden oluşabilir!");


            RuleFor(e => e.Phone)
                .NotEmpty().WithMessage("Telefon numarası alanı boş bırakılamaz!")
                .Length(10).WithMessage("Telefon numarası alanı 10 karakterden oluşmalıdır! (5XX-XXX-XXXX)")
                .Matches(@"^[0-9]*$").WithMessage("Telefon numarası alanı yalnızca rakamlardan oluşmalıdır!");
        }
    }
}
