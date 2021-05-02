using Entities.Concrete;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.ValidationRules.FluentValidation
{
   public class ProcessChargeValidator : AbstractValidator<ProcessCharge>
    {
        public ProcessChargeValidator()
        {
            RuleFor(p => p.ConsumedPartId)
                .GreaterThan(0).WithMessage("Ücreti hesaplanacak olan servis hizmeti belirtilmelidir!");

            RuleFor(p => p.Charge)
                .GreaterThanOrEqualTo(0).WithMessage("Servis hizmeti ücreti 0₺'den daha düşük olamaz!")
                .NotNull().WithMessage("Servis hizmeti ücreti mutlaka girilmelidir!");
        }
    }
}
