using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Constants
{
    public static class Messages
    {
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
    }
}
