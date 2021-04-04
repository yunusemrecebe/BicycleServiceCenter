﻿using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation
{
    public class ConsumedPartValidator : AbstractValidator<ConsumedPart>
    {
        public ConsumedPartValidator()
        {
            RuleFor(c => c.ProcessId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(c => c.ProductId)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Bu alan mutlaka seçilmelidir!");

            RuleFor(c => c.Quantity)
                .NotEmpty()
                .LessThan(0).WithMessage("Miktar 0'dan küçük olmamalıdır!");

            RuleFor(c => c.UnitPrice)
                .NotEmpty()
                .GreaterThan(0).WithMessage("Ürün fiyatı 0'dan büyük olmalıdır")
                .ScalePrecision(2, 8).WithMessage("999999.99₺'den daha yüksek bir fiyat girişi yapılamaz!");

            RuleFor(c => c.Discount)
                .NotEmpty()
                .LessThan(0).WithMessage("İndirim oranı 0'dan küçük olmamalıdır!");

        }
    }
}