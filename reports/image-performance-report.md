# Görsel performans optimizasyonu — 25 Ekim 2026

MB = 1.000.000 byte. Bu dosyadaki boyutlar dosya boyutudur; HTTP sıkıştırması ve tek ziyaret aktarımıyla aynı şey değildir.

1. **Değiştirilen dosyalar:** Yedi HTML sayfası, css/style.css, assets/images/logo/argent-logo.png, .gitignore; scripts/ ve reports/ altında envanter, optimizasyon ve doğrulama dosyaları. js/main.js davranışı değiştirilmedi.
2. **Yeni oluşturulan görseller:** 56 WebP: 47 dönüştürülen kaynak + 9 hero varyantı. Tam yollar aşağıda ve image-mapping.json içinde.
3. **Formatı değiştirilenler:** 9 PNG ve 38 JPEG → WebP (kalite 82). Logo PNG ve alfa kanalı korundu; 2172 × 724 → 1000 × 333. Mevcut 11 WebP incelendi; yeniden kodlamada %10 tasarruf eşiğine ulaşılmadığından orijinalleri korundu.
4. **Eski toplam görsel boyutu:** assets/images tamamı 46.969 MB; kodun referans verdiği görseller 27.409 MB.
5. **Yeni toplam görsel boyutu:** assets/images tamamı 49.726 MB; kodun referans verdiği görseller, bütün srcset alternatifleri dahil 3.639 MB. Tek temel dosya üzerinden karşılaştırma: 3.227 MB.
6. **Toplam tasarruf:** Referans verilen kaynak kümesinde 23.770 MB. Orijinaller silinmediği için fiziksel klasör ve GitHub Pages tarafından yayınlanabilecek tüm görseller toplamı 2.757 MB arttı. Kullanılmayan büyük dosyalar tarayıcı tarafından istenmez. Fiziksel klasör toplamında azalma iddia edilmiyor.
7. **Yüzde küçülme:** Referans verilen kaynak kümesinde %86.72 (bütün responsive alternatifler dahil). Alternatifler aynı ziyarette birlikte indirilmez.
8. **LCP:** index, uretim, is-elbiseleri, urunler ve masaüstünde ozel-uretim ana görsellerine birer fetchpriority=high; lazy yok. Hakkımızda ve iletişimde LCP metin olduğundan yüksek öncelikli görsel yok. Ana sayfa hero: 2.169.300 → 100.336 byte; 640 px sürüm 27.646 byte. Intro ve reveal animasyonları korunuyor. Yerel ölçüm sonuçları aşağıda; PageSpeed 61 / 14,1 saniye kullanıcı başlangıç bilgisi, bu testin sonucu değil.
9. **Lazy-loading:** İki kontrol viewport'unun da altında kalan görseller lazy + async; ilk viewport görselleri eager. Özel üretimin ilk fotoğrafı masaüstü LCP olduğundan eager. Ürünlerde ilk viewport'taki ana görseller eager; sonraki galeriler ve fold altındaki küçük görseller lazy. 73 img için gerçek width/height doğrulandı; genel height:auto kuralı mevcut responsive davranışı koruyor.
10. **Responsive:** Üç hero için 640/960/1280 ve temel 1536 veya 1600 px kaynaklar, srcset ve sizes. Diğer içerikler 1200, ana sayfa kategori kartları 960 px; zaten küçük ürün fotoğrafları büyütülmedi. Galeri data-image-src yolları güncellendi; JS aynı mekanizmayı kullanıyor. İçerik fotoğrafları 1200 px ile sınırlı ve lazy; gereksiz varyant üretilmedi.
11. **Font/render-blocking:** Aynı DM Sans 400/500/600 ve Manrope 400/500/600/700 korunuyor. CSS @import kaldırıldı; aynı Google Fonts CSS'i HTML head içine alındı, iki font origin'i için preconnect eklendi. display=swap korundu; ürünler sayfasındaki yinelenen font isteği kaldırıldı. Ana stylesheet render-blocking olmaya devam ediyor, JS defer. Critical CSS inline edilmedi. Aday kurallar: temel reset, header, viewport'a göre hero ve intro kuralları. Bu ortak CSS'nin yaklaşık 62668 byte olması tek başına inline işlemini haklı çıkarmıyor; kontrollü waterfall/CPU testi olmadan sayısal fayda tahmini yapılamaz. Mimari değişiklik yapılmadı.
12. **Kullanılmayan ama silinmeyenler:** Başlangıçta 42, sonrasında 89; eklenen 47 kayıt WebP'ye geçilen eski kaynaklar. Tam liste aşağıda. Hiçbir dosya silinmedi. Orijinaller proje dışında C:/Users/KULLANICI/Desktop/argent-tekstil-image-originals-20261025/images altında; 101 SHA-256 eşleşmesi doğrulandı.
13. **Emin olunamayan noktalar:** Yeni gerçek PageSpeed skoru, kısıtlı mobil ağ/CPU LCP ve saha CLS değeri ölçülmedi. Yerel Chrome ölçümleri bu değerlerin yerine geçmez. Google Fonts harici ağ kaynağı olarak kalıyor. Görsel kalite örneklerinde hero, kumaş detayı, ürün yakası ve şeffaf logo önce/sonra gözle incelendi; tüm görüntülerde algısal eşitlik iddia edilmiyor.
14. **Commit'ler:** 417b0ec — audit and prepare; a774775 — optimize site images; 9a75b3c — update responsive image loading. Son font/rapor commit'i git log içinde.
15. **Push:** Son kontrollerden sonra origin/main'e yapılacak; gerçekleşen sonuç kullanıcıya final mesajında bildirilecek.
16. **GitHub Pages:** Legacy build, main /; yayın adresi https://kerem3409.github.io/argent-tekstil-web/. Yeni commit'in build sonucu ve canlı kaynak kontrolü final mesajında bildirilecek.

## Doğrulama

261 yerel referans, 73 img width/height, CSS footer background, data-image-src ve srcset genişlikleri doğrulandı. Yedi sayfa × iki viewport (390 × 844, 1440 × 1000): sıfır kırık görsel / HTTP hatası; metinler aynı; görsel kutularındaki en büyük fark 1 px altında. Tüm 28 galeri düğmesi her viewport'ta kontrol edildi. Önce/sonra ekran görüntüleri yerel .image-qa klasöründe (Git'e eklenmedi). Bu tablo aynı yerel sunucu üzerinde, ağ/CPU kısıtlaması olmadan tek koşudur; font/animasyon zamanlaması dahil olduğu için PageSpeed kıyası değildir. CLS sütunu ilk viewport'ta kullanıcı girdisi hariç layout-shift toplamıdır; saha metriği değildir.

| Sayfa | Viewport | Önce LCP ms | Sonra LCP ms | Yerel CLS | İlk yüklenen görsel byte |
|---|---:|---:|---:|---:|---:|
| hakkimizda.html | 390 | 7104 | 7068 | 0.000000 | 27820 |
| iletisim.html | 390 | 1016 | 984 | 0.000000 | 27820 |
| index.html | 390 | 3392 | 3336 | 0.000000 | 206506 |
| is-elbiseleri.html | 390 | 1068 | 1016 | 0.000000 | 96594 |
| ozel-uretim.html | 390 | 1020 | 984 | 0.000000 | 128134 |
| uretim.html | 390 | 1068 | 992 | 0.000000 | 291014 |
| urunler.html | 390 | 1000 | 996 | 0.000000 | 256326 |
| hakkimizda.html | 1440 | 7148 | 7044 | 0.000000 | 27820 |
| iletisim.html | 1440 | 1060 | 968 | 0.000000 | 27820 |
| index.html | 1440 | 3396 | 3496 | 0.000000 | 329458 |
| is-elbiseleri.html | 1440 | 1068 | 1036 | 0.000000 | 234466 |
| ozel-uretim.html | 1440 | 328 | 1016 | 0.000000 | 215238 |
| uretim.html | 1440 | 1060 | 1008 | 0.000000 | 391808 |
| urunler.html | 1440 | 1024 | 1032 | 0.000000 | 529894 |

## Önce en ağır 10 (tüm klasör)

| Dosya | Byte | Ölçü |
|---|---:|---|
| assets/images/products/polo-yaka/polo-detail-1.jpg.png | 3509068 | 1122 × 1402 |
| assets/images/home/kategori-tisort.png | 3008452 | 1536 × 1024 |
| assets/images/products/polo-yaka/polo-detail-2.jpg.png | 2985909 | 1122 × 1402 |
| assets/images/home/kategori-sweatshirt.png | 2740387 | 1536 × 1024 |
| assets/images/ozel-uretim/private-label-product-development.png | 2670467 | 1536 × 1024 |
| assets/images/ozel-uretim/etiket-aksesuar-ambalaj.png | 2434073 | 1536 × 1024 |
| assets/images/home/ozel-uretim.png | 2417912 | 1536 × 1024 |
| assets/images/home/is-elbiseleri.png | 2212342 | 1536 × 1024 |
| assets/images/home/hakkimizda-uretim-alani.png | 2190934 | 1536 × 1024 |
| assets/images/hero-home.jpg | 2173872 | 1672 × 941 |

## Sonra en ağır 10 (tüm klasör — korunan eski kaynaklar dahil)

| Dosya | Byte | Ölçü |
|---|---:|---|
| assets/images/products/polo-yaka/polo-detail-1.jpg.png | 3509068 | 1122 × 1402 |
| assets/images/home/kategori-tisort.png | 3008452 | 1536 × 1024 |
| assets/images/products/polo-yaka/polo-detail-2.jpg.png | 2985909 | 1122 × 1402 |
| assets/images/home/kategori-sweatshirt.png | 2740387 | 1536 × 1024 |
| assets/images/ozel-uretim/private-label-product-development.png | 2670467 | 1536 × 1024 |
| assets/images/ozel-uretim/etiket-aksesuar-ambalaj.png | 2434073 | 1536 × 1024 |
| assets/images/home/ozel-uretim.png | 2417912 | 1536 × 1024 |
| assets/images/home/is-elbiseleri.png | 2212342 | 1536 × 1024 |
| assets/images/home/hakkimizda-uretim-alani.png | 2190934 | 1536 × 1024 |
| assets/images/hero-home.jpg | 2173872 | 1672 × 941 |

## Sonra en ağır 10 (kodun kullandığı kaynaklar)

| Dosya | Byte | Ölçü |
|---|---:|---|
| assets/images/is-elbiseleri/ozel-etiket.webp | 222272 | 1100 × 825 |
| assets/images/uretim/etiket-aksesuar.webp | 173376 | 1200 × 900 |
| assets/images/uretim/kumas-arastirma.webp | 105822 | 1200 × 900 |
| assets/images/home/hero-uretim.webp | 100336 | 1536 × 1024 |
| assets/images/ozel-uretim/private-label-product-development.webp | 100314 | 1200 × 800 |
| assets/images/uretim/uretim-hero.webp | 95336 | 1600 × 900 |
| assets/images/home/ozel-uretim.webp | 93186 | 1200 × 800 |
| assets/images/home/hakkimizda-uretim-alani.webp | 91290 | 1200 × 800 |
| assets/images/ozel-uretim/etiket-aksesuar-ambalaj.webp | 87104 | 1200 × 800 |
| assets/images/products/esofman/esofman-detail-1.webp | 84560 | 561 × 701 |

## Yeni dosyalar

- assets/images/home/hakkimizda-uretim-alani.webp
- assets/images/home/hero-uretim-1280.webp
- assets/images/home/hero-uretim-640.webp
- assets/images/home/hero-uretim-960.webp
- assets/images/home/hero-uretim.webp
- assets/images/home/is-elbiseleri.webp
- assets/images/home/kategori-is-elbiseleri.webp
- assets/images/home/kategori-sweatshirt.webp
- assets/images/home/kategori-tisort.webp
- assets/images/home/ozel-uretim.webp
- assets/images/is-elbiseleri/hero-is-elbiseleri-1280.webp
- assets/images/is-elbiseleri/hero-is-elbiseleri-640.webp
- assets/images/is-elbiseleri/hero-is-elbiseleri-960.webp
- assets/images/ozel-uretim/etiket-aksesuar-ambalaj.webp
- assets/images/ozel-uretim/private-label-product-development.webp
- assets/images/products/esofman/esofman-back.webp
- assets/images/products/esofman/esofman-detail-1.webp
- assets/images/products/esofman/esofman-detail-2.webp
- assets/images/products/esofman/esofman-front.webp
- assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-back.webp
- assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-detail-1.webp
- assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-detail-2.webp
- assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-front.webp
- assets/images/products/hoodie/hoodie-back.webp
- assets/images/products/hoodie/hoodie-detail-1.webp
- assets/images/products/hoodie/hoodie-detail-2.webp
- assets/images/products/hoodie/hoodie-front.webp
- assets/images/products/oversize/oversize-back.webp
- assets/images/products/oversize/oversize-detail-1.webp
- assets/images/products/oversize/oversize-detail-2.webp
- assets/images/products/oversize/oversize-front.webp
- assets/images/products/polo-yaka/polo-back.webp
- assets/images/products/polo-yaka/polo-detail-1.webp
- assets/images/products/polo-yaka/polo-detail-2.webp
- assets/images/products/polo-yaka/polo-front.webp
- assets/images/products/sifir-yaka/sifir-yaka-back.webp
- assets/images/products/sifir-yaka/sifir-yaka-detail-1.webp
- assets/images/products/sifir-yaka/sifir-yaka-detail-2.webp
- assets/images/products/sifir-yaka/sifir-yaka-front.webp
- assets/images/products/sortlu-takim/sortlu-takim-back.webp
- assets/images/products/sortlu-takim/sortlu-takim-detail-1.webp
- assets/images/products/sortlu-takim/sortlu-takim-detail-2.webp
- assets/images/products/sortlu-takim/sortlu-takim-front.webp
- assets/images/uretim/baski-nakis.webp
- assets/images/uretim/dikim.webp
- assets/images/uretim/etiket-aksesuar.webp
- assets/images/uretim/kalip-urun-gelistirme.webp
- assets/images/uretim/kalite-kontrol.webp
- assets/images/uretim/kesim.webp
- assets/images/uretim/kumas-arastirma.webp
- assets/images/uretim/numune.webp
- assets/images/uretim/uretim-hero-1280.webp
- assets/images/uretim/uretim-hero-640.webp
- assets/images/uretim/uretim-hero-960.webp
- assets/images/uretim/uretim-hero.webp
- assets/images/uretim/utu-paketleme.webp

## Dönüşümler

| Eski | Yeni | Önce byte | Sonra byte |
|---|---|---:|---:|
| assets/images/home/hakkimizda-uretim-alani.png | assets/images/home/hakkimizda-uretim-alani.webp | 2190934 | 91290 |
| assets/images/home/hero-uretim.png | assets/images/home/hero-uretim.webp | 2169300 | 100336 |
| assets/images/home/is-elbiseleri.png | assets/images/home/is-elbiseleri.webp | 2212342 | 76916 |
| assets/images/home/kategori-is-elbiseleri.png | assets/images/home/kategori-is-elbiseleri.webp | 2124971 | 52522 |
| assets/images/home/kategori-sweatshirt.png | assets/images/home/kategori-sweatshirt.webp | 2740387 | 47958 |
| assets/images/home/kategori-tisort.png | assets/images/home/kategori-tisort.webp | 3008452 | 59750 |
| assets/images/home/ozel-uretim.png | assets/images/home/ozel-uretim.webp | 2417912 | 93186 |
| assets/images/ozel-uretim/etiket-aksesuar-ambalaj.png | assets/images/ozel-uretim/etiket-aksesuar-ambalaj.webp | 2434073 | 87104 |
| assets/images/ozel-uretim/private-label-product-development.png | assets/images/ozel-uretim/private-label-product-development.webp | 2670467 | 100314 |
| assets/images/products/esofman/esofman-back.jpg | assets/images/products/esofman/esofman-back.webp | 58450 | 20286 |
| assets/images/products/esofman/esofman-detail-1.jpg | assets/images/products/esofman/esofman-detail-1.webp | 155603 | 84560 |
| assets/images/products/esofman/esofman-detail-2.jpg | assets/images/products/esofman/esofman-detail-2.webp | 113014 | 51436 |
| assets/images/products/esofman/esofman-front.jpg | assets/images/products/esofman/esofman-front.webp | 60727 | 20482 |
| assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-back.jpg | assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-back.webp | 77258 | 27766 |
| assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-detail-1.jpg | assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-detail-1.webp | 144245 | 81720 |
| assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-detail-2.jpg | assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-detail-2.webp | 136859 | 76160 |
| assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-front.jpg | assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-front.webp | 81178 | 30690 |
| assets/images/products/hoodie/hoodie-back.jpg | assets/images/products/hoodie/hoodie-back.webp | 60568 | 17552 |
| assets/images/products/hoodie/hoodie-detail-1.jpg | assets/images/products/hoodie/hoodie-detail-1.webp | 122547 | 68080 |
| assets/images/products/hoodie/hoodie-detail-2.jpg | assets/images/products/hoodie/hoodie-detail-2.webp | 121255 | 72864 |
| assets/images/products/hoodie/hoodie-front.jpg | assets/images/products/hoodie/hoodie-front.webp | 65361 | 19404 |
| assets/images/products/oversize/oversize-back.jpg | assets/images/products/oversize/oversize-back.webp | 44283 | 7344 |
| assets/images/products/oversize/oversize-detail-1.jpg | assets/images/products/oversize/oversize-detail-1.webp | 102723 | 47108 |
| assets/images/products/oversize/oversize-detail-2.jpg | assets/images/products/oversize/oversize-detail-2.webp | 85962 | 31668 |
| assets/images/products/oversize/oversize-front.jpg | assets/images/products/oversize/oversize-front.webp | 44859 | 8016 |
| assets/images/products/polo-yaka/polo-back.jpg | assets/images/products/polo-yaka/polo-back.webp | 43566 | 6954 |
| assets/images/products/polo-yaka/polo-detail-1.jpg | assets/images/products/polo-yaka/polo-detail-1.webp | 139649 | 74524 |
| assets/images/products/polo-yaka/polo-detail-2.jpg | assets/images/products/polo-yaka/polo-detail-2.webp | 119943 | 56694 |
| assets/images/products/polo-yaka/polo-front.jpg | assets/images/products/polo-yaka/polo-front.webp | 45013 | 8330 |
| assets/images/products/sifir-yaka/sifir-yaka-back.jpg | assets/images/products/sifir-yaka/sifir-yaka-back.webp | 40327 | 6240 |
| assets/images/products/sifir-yaka/sifir-yaka-detail-1.jpg | assets/images/products/sifir-yaka/sifir-yaka-detail-1.webp | 101577 | 43536 |
| assets/images/products/sifir-yaka/sifir-yaka-detail-2.jpg | assets/images/products/sifir-yaka/sifir-yaka-detail-2.webp | 68070 | 17314 |
| assets/images/products/sifir-yaka/sifir-yaka-front.jpg | assets/images/products/sifir-yaka/sifir-yaka-front.webp | 41440 | 6898 |
| assets/images/products/sortlu-takim/sortlu-takim-back.jpg | assets/images/products/sortlu-takim/sortlu-takim-back.webp | 45671 | 10202 |
| assets/images/products/sortlu-takim/sortlu-takim-detail-1.jpg | assets/images/products/sortlu-takim/sortlu-takim-detail-1.webp | 122035 | 61322 |
| assets/images/products/sortlu-takim/sortlu-takim-detail-2.jpg | assets/images/products/sortlu-takim/sortlu-takim-detail-2.webp | 117980 | 54362 |
| assets/images/products/sortlu-takim/sortlu-takim-front.jpg | assets/images/products/sortlu-takim/sortlu-takim-front.webp | 46738 | 11468 |
| assets/images/uretim/baski-nakis.jpg | assets/images/uretim/baski-nakis.webp | 179765 | 67176 |
| assets/images/uretim/dikim.jpg | assets/images/uretim/dikim.webp | 172818 | 57478 |
| assets/images/uretim/etiket-aksesuar.jpg | assets/images/uretim/etiket-aksesuar.webp | 351426 | 173376 |
| assets/images/uretim/kalip-urun-gelistirme.jpg | assets/images/uretim/kalip-urun-gelistirme.webp | 218341 | 75046 |
| assets/images/uretim/kalite-kontrol.jpg | assets/images/uretim/kalite-kontrol.webp | 164169 | 47678 |
| assets/images/uretim/kesim.jpg | assets/images/uretim/kesim.webp | 222447 | 80814 |
| assets/images/uretim/kumas-arastirma.jpg | assets/images/uretim/kumas-arastirma.webp | 248728 | 105822 |
| assets/images/uretim/numune.jpg | assets/images/uretim/numune.webp | 170360 | 49772 |
| assets/images/uretim/uretim-hero.jpg | assets/images/uretim/uretim-hero.webp | 231711 | 95336 |
| assets/images/uretim/utu-paketleme.jpg | assets/images/uretim/utu-paketleme.webp | 191570 | 60642 |

## Kullanılmayan ve silinmeyen dosyalar

- assets/images/hero-home.jpg
- assets/images/home/hakkimizda-uretim-alani.png
- assets/images/home/hero-uretim.png
- assets/images/home/is-elbiseleri.png
- assets/images/home/kategori-is-elbiseleri.png
- assets/images/home/kategori-sweatshirt.png
- assets/images/home/kategori-tisort.png
- assets/images/home/ozel-uretim.png
- assets/images/ozel-uretim/etiket-aksesuar-ambalaj.png
- assets/images/ozel-uretim/private-label-product-development.png
- assets/images/products/crew-neck-tshirt.jpg
- assets/images/products/esofman/back.jpg
- assets/images/products/esofman/detail-1.jpg
- assets/images/products/esofman/detail-2.jpg
- assets/images/products/esofman/esofman-back.jpg
- assets/images/products/esofman/esofman-detail-1.jpg
- assets/images/products/esofman/esofman-detail-2.jpg
- assets/images/products/esofman/esofman-front.jpg
- assets/images/products/esofman/front.jpg
- assets/images/products/fabric-detail.jpg
- assets/images/products/fermuarli-sweatshirt/back.jpg
- assets/images/products/fermuarli-sweatshirt/detail-1.jpg
- assets/images/products/fermuarli-sweatshirt/detail-2.jpg
- assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-back.jpg
- assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-detail-1.jpg
- assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-detail-2.jpg
- assets/images/products/fermuarli-sweatshirt/fermuarli-sweatshirt-front.jpg
- assets/images/products/fermuarli-sweatshirt/front.jpg
- assets/images/products/hoodie/back.jpg
- assets/images/products/hoodie/detail-1.jpg
- assets/images/products/hoodie/detail-2.jpg
- assets/images/products/hoodie/front.jpg
- assets/images/products/hoodie/hoodie-back.jpg
- assets/images/products/hoodie/hoodie-detail-1.jpg
- assets/images/products/hoodie/hoodie-detail-2.jpg
- assets/images/products/hoodie/hoodie-front.jpg
- assets/images/products/hoodie.jpg
- assets/images/products/jogger.jpg
- assets/images/products/oversize/back.jpg
- assets/images/products/oversize/detail-1.jpg
- assets/images/products/oversize/detail-2.jpg
- assets/images/products/oversize/front.jpg
- assets/images/products/oversize/oversize-back.jpg
- assets/images/products/oversize/oversize-detail-1.jpg
- assets/images/products/oversize/oversize-detail-2.jpg
- assets/images/products/oversize/oversize-front.jpg
- assets/images/products/oversize-tshirt.jpg
- assets/images/products/polo-shirt.jpg
- assets/images/products/polo-yaka/back.jpg
- assets/images/products/polo-yaka/detail-1.jpg
- assets/images/products/polo-yaka/detail-2.jpg
- assets/images/products/polo-yaka/front.jpg
- assets/images/products/polo-yaka/polo - front.jpg.png
- assets/images/products/polo-yaka/polo-back.jpg
- assets/images/products/polo-yaka/polo-back.jpg.png
- assets/images/products/polo-yaka/polo-detail-1.jpg
- assets/images/products/polo-yaka/polo-detail-1.jpg.png
- assets/images/products/polo-yaka/polo-detail-2.jpg
- assets/images/products/polo-yaka/polo-detail-2.jpg.png
- assets/images/products/polo-yaka/polo-front.jpg
- assets/images/products/short-set.jpg
- assets/images/products/sifir-yaka/back.jpg
- assets/images/products/sifir-yaka/detail-1.jpg
- assets/images/products/sifir-yaka/detail-2.jpg
- assets/images/products/sifir-yaka/front.jpg
- assets/images/products/sifir-yaka/sifir-yaka-back.jpg
- assets/images/products/sifir-yaka/sifir-yaka-detail-1.jpg
- assets/images/products/sifir-yaka/sifir-yaka-detail-2.jpg
- assets/images/products/sifir-yaka/sifir-yaka-front.jpg
- assets/images/products/sortlu-takim/back.jpg
- assets/images/products/sortlu-takim/detail-1.jpg
- assets/images/products/sortlu-takim/detail-2.jpg
- assets/images/products/sortlu-takim/front.jpg
- assets/images/products/sortlu-takim/sortlu-takim-back.jpg
- assets/images/products/sortlu-takim/sortlu-takim-detail-1.jpg
- assets/images/products/sortlu-takim/sortlu-takim-detail-2.jpg
- assets/images/products/sortlu-takim/sortlu-takim-front.jpg
- assets/images/products/sweatpants.jpg
- assets/images/products/zip-sweatshirt.jpg
- assets/images/uretim/baski-nakis.jpg
- assets/images/uretim/dikim.jpg
- assets/images/uretim/etiket-aksesuar.jpg
- assets/images/uretim/kalip-urun-gelistirme.jpg
- assets/images/uretim/kalite-kontrol.jpg
- assets/images/uretim/kesim.jpg
- assets/images/uretim/kumas-arastirma.jpg
- assets/images/uretim/numune.jpg
- assets/images/uretim/uretim-hero.jpg
- assets/images/uretim/utu-paketleme.jpg

## Tam envanterler

images-before.csv / images-before.json ve images-after.csv / images-after.json tüm dosyaların yolunu, gerçek formatını, byte boyutunu, piksel ölçülerini ve kullanım dosyalarını içerir. image-audit-before.md başlangıçtaki en ağır 15'i ve tüm başlangıç envanterini içerir.
