using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Constants
{
    public static class Messages
    {
        //General Messages
        public static string IdValueIsInvalid = "İşlem Yapmak İstediğiniz Kayıt Bulunamadı!";

        //User Messages
        public static string UserAdded = "Kullanıcı Eklendi!";
        public static string UserDeleted = "Kullanıcı Silindi!";
        public static string UserUpdated = "Kullanıcı Güncellendi!";
        public static string UserNotFound = "Kullanıcı Bulunamadı!";
        public static string PasswordError = "Parola Hatalı!";
        public static string SuccessfulLogin = "Giriş Başarılı!";
        public static string UserAlreadyExists = "Bu Kullanıcı Zaten Mevcut!";
        public static string UserRegistered = "Kullanıcı Kaydedildi!";
        public static string AccessTokenCreated = "Access Token Üretildi!";
        public static string AuthorizationDenied = "Bu İşlem İçin Yeterli Yetkiye Sahip Değilsiniz!";
        
        //Bicycle Brand Messages
        public static string BicyleBrandAdded = "Marka Eklendi!";
        public static string BicycleBrandDeleted = "Marka Silindi!";
        public static string BicycleBrandUpdated = "Marka Güncellendi!";
        public static string BrandAlreadyExists = "Sistemde Kayıtlı Olan Bir Marka Adı Girdiniz!";

        //Bicycle Model Messages
        public static string BicycleModelAdded = "Model Eklendi!";
        public static string BicycleModelDeleted = "Model Silindi!";
        public static string BicycleModelUpdated = "Model Güncellendi!";
        public static string BicycleModelExists = "Sistemde Kayıtlı Olan Bir Model Adı Girdiniz!";

        //Bicycle Messages
        public static string BicycleAdded = "Bisiklet Eklendi!";
        public static string BicycleDeleted = "Bisiklet Silindi!";
        public static string BicycleUpdated = "Bisiklet Güncellendi!";
        public static string BicycleExists = "Sistemde Kayıtlı Olan Bir Bisiklet Girdiniz!";

        //Consumed Part Messages
        public static string ConsumedPartAdded = "İşlemde Kullanılan Ürün Eklendi!";
        public static string ConsumedPartDeleted = "İşlemde Kullanılan Ürün Silindi!";
        public static string ConsumedPartUpdated = "İşlemde Kullanılan Ürün Güncellendi!";

        //Customer Messages
        public static string CustomerAdded = "Müşteri Eklendi!";
        public static string CustomerDeleted = "Müşteri Silindi!";
        public static string CustomerUpdated = "Müşteri Bilgileri Güncellendi!";
        public static string CustomerHasProcess = "Silmek istediğiniz müşteri, bir servis hizmeti aldığı için silinemedi!";
        public static string CustomerHasBike = "Silmek istediğiniz müşteri, üzerine kayıtlı bir bisiklet olduğu için silinemedi!";
        public static string CustomerAlreadyExists = "Sistemde Bu Numara İle Kayıt Edilmiş Bir Kullanıcı Zaten Mevcut!";

        //Process Messages
        public static string ProcessAdded = "Servis Hizmeti Eklendi!";
        public static string ProcessDeleted = "Servis Hizmeti Silindi!";
        public static string ProcessUpdated = "Servis Hizmeti Güncellendi!";

        //Product Brand Messages
        public static string ProductBrandAdded = "Ürün Markası Eklendi!";
        public static string ProductBrandDeleted= "Ürün Markası Silindi!";
        public static string ProductBrandUpdated = "Ürün Markası Güncellendi!";
        public static string ProductBrandAlreadyExists = "Sistemde Kayıtlı Olan Bir Ürün Markası Girdiniz!";

        //Product Category Messages
        public static string ProductCategoryAdded = "Ürün Kategorisi Eklendi!";
        public static string ProductCategoryDeleted = "Ürün Kategorisi Silindi!";
        public static string ProductCategoryUpdated = "Ürün Kategorisi Güncellendi!";
        public static string ProductCategoryAlreadyExists = "Sistemde Kayıtlı Olan Bir Ürün Kategorisi Girdiniz!";

        //Product Messages
        public static string ProductAdded = "Ürün Eklendi!";
        public static string ProductDeleted = "Ürün Silindi!";
        public static string ProductUpdated = "Ürün Güncellendi!";
        public static string ProductAlreadyExists = "Sistemde Kayıtlı Olan Bir Ürün Girdiniz!";

        //Employee Messages
        public static string EmployeeAdded = "Personel Eklendi!";
        public static string EmployeeDeleted = "Personel Silindi!";
        public static string EmployeeUpdated = "Personel Güncellendi!";
        public static string EmployeeHasProcess = "Silmek istediğiniz personel, bir servis hizmetinden sorumlu olduğu için silinemedi!";
        public static string EmployeeAlreadyExists = "Sistemde Bu Numara İle Kayıt Edilmiş Bir Personel Zaten Mevcut!";
    }
}
