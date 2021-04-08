using Entities.Concrete;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.ValidationRules.FluentValidation
{
    public class BicycleModelValidator : AbstractValidator<BicycleModel>
    {
        public BicycleModelValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Kategori adı boş bırakılamaz!")
                .Length(2, 50).WithMessage("Kategori adı alanı en az 2, en fazla 50 karakter içermelidir!")
                .Matches(@"^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Kategori adı bilgisi özel karakter içeremez!");
        }
    }
}
