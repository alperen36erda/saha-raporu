# Gence Saha Kontrol Raporu

Elektrik saha kontrol raporlarını telefondan üreten tek dosyalık web uygulaması.
Sahada fotoğraf çekilir, altına açıklama yazılır, tek tuşla PDF veya Word çıkar.

Yayın adresi: https://alperen36erda.github.io/saha-raporu/

## Dosyalar

| Dosya | İçerik | Ne zaman yüklenir |
|---|---|---|
| `index.html` | Arayüz, veri katmanı, gömülü logolar (~71 KB) | açılışta |
| `lib-jspdf.js` | PDF motoru (357 KB) | ilk PDF çıktısında |
| `fonts.js` | PDF'in gömülü Liberation Serif/Sans altkümeleri (87 KB) | ilk PDF çıktısında |
| `lib-docx.js` | Word motoru (386 KB) | ilk Word çıktısında |
| `sw.js` | Service worker. Önbellekten açar, arka planda günceller, offline çalıştırır | — |
| `manifest.json` | PWA tanımı — ana ekrana eklenince tam ekran açılır | — |
| `icon-192.png`, `icon-512.png` | Uygulama ikonları | — |

Ağır kütüphaneler açılışta ayrıştırılmıyor; ilk kullanımda yükleniyor. Service worker
hepsini önden önbelleğe aldığı için bu yükleme çevrimdışıyken de yerelden karşılanır.
Harici bağımlılık yok, CDN yok. İlk açılıştan sonra internet gerekmez.

## Özellikler

- Kamera veya galeriden fotoğraf; uzun kenar 1280px'e indirilip JPEG olarak sıkıştırılır, EXIF dönüşü uygulanır
- Madde başına istenen sayıda fotoğraf; açıklamasız fotoğraf ve fotoğrafsız madde de mümkün
- Numaralandırma yalnızca açıklaması olan maddelere verilir, sıra değişince kendini günceller
- Madde başına kalın + altı çizili vurgu
- Birden fazla rapor, rapor listesi, önceki rapordan türetme (maddeler kopyalanır, fotoğraflar boş gelir)
- Hazır madde kütüphanesi; sık kullanılan cümleler ★ ile eklenir
- Yedek al / geri yükle (tüm raporlar ve fotoğraflar tek JSON dosyasında)
- Çıktı: PDF (jsPDF, Liberation Serif/Sans gömülü) veya Word (.docx). Android'de paylaşım menüsü açılır

## Veri

Her şey cihazda, IndexedDB'de (`gence-rapor` veritabanı, `kv` deposu). Sunucuya hiçbir şey gitmez.
Tarayıcı verisi temizlenirse raporlar silinir — düzenli yedek al.

## Rapor şablonu

Üstte GENCE ve JAS-ANZ logoları, altında kesikli çizgi; altta tarih ve sayfa numarası;
sonda imza bloğu. A4, 20 mm kenar boşluğu, 12 pt gövde metni.
PDF'te Times New Roman yerine metrik olarak aynı olan Liberation Serif gömülüdür (lisans).

## Güncelleme

`index.html` değiştirilip commit edilir. Service worker "önce önbellek, arkadan güncelle"
çalıştığı için değişiklik telefonda **ikinci açılışta** görünür.
