using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation
{
    public class ProcessValidator : AbstractValidator<Process>
    {
        public ProcessValidator()
        {
            RuleFor(p => p.BicycleId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(p => p.CustomerId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(p => p.EmployeeId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(p => p.CompletionDate)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(p => p.Diagnostics)
                .Matches(@"^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ ]*$").WithMessage("Model bilgisi özel karakter içeremez!");
        }
    }
}
