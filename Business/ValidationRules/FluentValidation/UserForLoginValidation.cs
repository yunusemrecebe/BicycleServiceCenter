using Entities.Dtos;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.ValidationRules.FluentValidation
{
    public class UserForLoginValidation : AbstractValidator<UserForLoginDto>
    {
        public UserForLoginValidation()
        {
            RuleFor(u => u.Email)
                .NotEmpty().WithMessage("Email adresi boş bırakılamaz!")
                .EmailAddress().WithMessage("Lütfen Email adresi formatına uyunuz!");

            RuleFor(u => u.Password)
                .NotEmpty().WithMessage("Parola bilgisi boş bırakılamaz!");
        }
    }
}
