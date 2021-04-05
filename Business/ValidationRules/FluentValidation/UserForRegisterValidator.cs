using Entities.Dtos;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.ValidationRules.FluentValidation
{
    public class UserForRegisterValidator : AbstractValidator<UserForRegisterDto>
    {
        public UserForRegisterValidator()
        {
            RuleFor(u => u.FirstName)
                .NotEmpty().WithMessage("İsim bilgisi boş bırakılamaz!")
                .Length(2, 50).WithMessage("İsim bilgisi en az 2, en fazla 50 karakter içerebilir!")
                .Matches(@"^[a-zA-ZğüşıöçĞÜŞİÖÇ ]*$").WithMessage("İsim bilgisi yalnızca harflerden oluşabilir!");

            RuleFor(u => u.LastName)
                .NotEmpty().WithMessage("Soyisim bilgisi boş bırakılamaz!")
                .Length(2, 50).WithMessage("Soyisim bilgisi en az 2, en fazla 50 karakter içerebilir!")
                .Matches(@"^[a-zA-ZğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Soyisim bilgisi yalnızca harflerden oluşabilir!");

            RuleFor(u => u.Email)
                .NotEmpty().WithMessage("Email adresi boş bırakılamaz!")
                .EmailAddress().WithMessage("Lütfen Email adresi formatına uyunuz!");

            RuleFor(u => u.Password)
                .NotEmpty().WithMessage("Parola bilgisi boş bırakılamaz!")
                .MinimumLength(8).WithMessage("Parola en az 8 karakterden oluşmalıdır!");
        }
    }
}
