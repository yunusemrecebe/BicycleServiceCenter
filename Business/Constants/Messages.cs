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
        public static string CustomerAlreadyExists = "Sistemde Bu Numara İle Kayıt Edilmiş Bir Kullanıcı Zaten Mevcut!";
    }
}
