# Dusche Glass — Personel Yönetimi v0.2 (Expo prototip)

## Çalıştırma
Node.js LTS yükleyin. Proje klasöründe `npm install` ardından `npx expo start` çalıştırın. Android/iPhone'da Expo Go ile QR kodunu tarayın. Expo SDK ve Expo Go sürümleri uyumlu olmalıdır.

## Bu sürümde
- 6 personelin rol bazlı **demo görünümü** (Mehmet Kaynak süper yönetici; Tuncer Konuk ve Kemal Kırbaş yönetici; Mesut Özbilgiç montaj; Abdülhamit Kaya imalat; İbrahim Nalbant marangoz).
- Yönetici iş emri oluşturur, personel kendine atanan işleri görür.
- Personel işi bitirdiğinde **Onay bekliyor** durumuna geçirir. Yönetici onaylarsa **Tamamlandı** olur; reddederse yeniden **Başlandı** durumuna döner.
- Durum ve notların kim tarafından ne zaman işlendiği yerel geçmişte gösterilir.
- Yerel AsyncStorage ile cihaz üzerinde saklama.

## Üretim için kritik eksikler
Bu uygulama **gerçek personel girişine veya gerçek yetkilendirmeye sahip değildir**. Personel düğmelerinden herkes farklı rolü seçebilir; gerçek müşteri verilerini girmeyin. Cihazlar arasında ortak veritabanı, gerçek zamanlı senkronizasyon, fotoğraf yükleme, bildirim, sunucu tarafı erişim kontrolleri, güvenli oturum açma, KVKK gereklilikleri ve mağaza yayınlama henüz uygulanmadı. Demo onayı yalnızca yerel arayüzde çalışır ve güvenlik garantisi değildir.
