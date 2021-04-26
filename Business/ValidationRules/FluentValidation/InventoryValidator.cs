using Entities.Concrete;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.ValidationRules.FluentValidation
{
    public class InventoryValidator : AbstractValidator<Inventory>
    {
        public InventoryValidator()
        {
            RuleFor(p => p.ProductId)
                .GreaterThan(0).WithMessage("Stok girişi ypaılacak ürün mutlaka seçilmelidir!");

            RuleFor(p => p.PurchasePrice)
                .GreaterThanOrEqualTo(0).WithMessage("Ürün alış fiyatı 0₺'den daha düşük olamaz!")
                .ScalePrecision(2, 8).WithMessage("999999.99₺'den daha yüksek bir fiyat girişi yapılamaz!")
                .NotNull().WithMessage("Ürünün alış fiyatı mutlaka girilmelidir!");

            RuleFor(p => p.SellPrice)
                .GreaterThanOrEqualTo(0).WithMessage("Ürün satış fiyatı 0₺'den daha düşük olamaz!")
                .ScalePrecision(2, 8).WithMessage("999999.99₺'den daha yüksek bir fiyat girişi yapılamaz!")
                .NotNull().WithMessage("Ürünün satış fiyatı mutlaka girilmelidir!");

            RuleFor(p => p.UnitsInStock)
               .GreaterThanOrEqualTo(0).WithMessage("Stoktaki ürün miktarı 0'dan az olamaz!")
               .NotNull().WithMessage("Stok bilgisi mutlaka girilmelidir!");
        }
    }
}
