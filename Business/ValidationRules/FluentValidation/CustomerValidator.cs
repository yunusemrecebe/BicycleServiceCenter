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
                .NotEmpty().WithMessage("Müşteri adı boş bırakılamaz!")
                .Length(2, 50).WithMessage("Müşteri adı alanı en az 2, en fazla 50 karakter içermelidir!")
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Müşteri adı bilgisi özel karakter içeremez!");

            RuleFor(c => c.LastName)
                .NotEmpty().WithMessage("Müşteri soyadı boş bırakılamaz!")
                .Length(2, 50).WithMessage("Müşteri soyadı alanı en az 2, en fazla 50 karakter içermelidir!")
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Müşteri soyadı bilgisi özel karakter içeremez!");

            RuleFor(c => c.Phone)
                .NotEmpty().WithMessage("Telefon numarası alanı boş bırakılamaz!")
                .Length(10).WithMessage("Telefon numarası alanı 10 karakterden oluşmalıdır! (5XX-XXX-XXXX)")
                .Matches(@"^[0-9]*$").WithMessage("Telefon numarası alanı yalnızca rakamlardan oluşmalıdır!");

            RuleFor(c => c.EMail)
                .MaximumLength(150).WithMessage("Email adresi 150 karakterden daha uzun olamaz!")
                .Null()
                .EmailAddress().WithMessage("Lütfen Email adresi formatına uygun bir email adresi giriniz!");

            RuleFor(c => c.Adress)
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ .-/]*$").WithMessage("Adres bilgisi özel karakter içeremez!");
        }
    }
}
