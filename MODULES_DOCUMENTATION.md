# Dokumentasi Fungsionalitas Modul - Esscentia Premium Parfum

Dokumen ini menyajikan panduan lengkap mengenai arsitektur, fungsionalitas, fitur utama, dan aturan otorisasi berbasis peran (Role-Based Access Control) yang diterapkan pada platform e-commerce dan sistem CRM **Esscentia**. Platform ini dibangun menggunakan **Next.js**, **React**, **TypeScript**, dan **Tailwind CSS**, dengan basis data **MySQL** untuk manajemen transaksi dan analitik.

---

## Daftar Isi
1. [Modul 1: Sistem Autentikasi & Otorisasi Peran (RBAC)](#modul-1-sistem-autentikasi--otorisasi-peran-rbac)
2. [Modul 2: Analisis Intelijen Bisnis (RFM + K-Means)](#modul-2-analisis-intelijen-bisnis-rfm--k-means)
3. [Modul 3: Direktori & Detail Profil Pelanggan (CRM)](#modul-3-direktori--detail-profil-pelanggan-crm)
4. [Modul 4: Pengelola Kampanye Pemasaran (Campaign Designer)](#modul-4-pengelola-kampanye-pemasaran-campaign-designer)
5. [Modul 5: Katalog & Manajemen Produk (CRUD)](#modul-5-katalog--manajemen-produk-crud)
6. [Modul 6: Manajemen Decant (Takaran Sampel)](#modul-6-manajemen-decant-takaran-sampel)
7. [Modul 7: Kuis Karakter Aroma (Fragrance Quiz)](#modul-7-kuis-karakter-aroma-fragrance-quiz)
8. [Modul 8: Sistem Jurnal & Artikel Edukasi](#modul-8-sistem-jurnal--artikel-edukasi)
9. [Modul 9: Keranjang Belanja & Alur Transaksi (Checkout)](#modul-9-keranjang-belanja--alur-transaksi-checkout)
10. [Modul 10: Skema Data & Persistensi](#modul-10-skema-data--persistensi)

---

## Modul 1: Sistem Autentikasi & Otorisasi Peran (RBAC)

Modul ini mengelola pendaftaran, masuk log (login), serta pembatasan hak akses di sisi Admin Dashboard maupun Client Interface melalui berkas [auth-context.tsx](file:///d:/Tugas/CRM/esscentia/lib/auth-context.tsx) dan [admin-permissions.ts](file:///d:/Tugas/CRM/esscentia/lib/admin-permissions.ts).

### Peran Pengguna & Hak Akses
Sistem mengelompokkan pengguna ke dalam 5 peran utama dengan tingkat visibilitas dan kontrol yang disesuaikan:

| Peran (Role) | Label | Hak Akses Utama |
| :--- | :--- | :--- |
| `admin` | **Super Admin** | Akses penuh atas seluruh sistem. Dapat melakukan CRUD produk, decant, jurnal, mengelola pesanan (orders), memproses kampanye, dan melihat analitik. |
| `marketing` | **Marketing Desk** | Akses ke desainer kampanye pemasaran, analitik visual, dan pengelolaan artikel jurnal. Hak akses katalog produk bersifat *Read-Only* (tidak bisa menambah/mengedit/menghapus produk & decant). |
| `crm` | **CRM Manager / Analyst** | Akses ke analitik visual RFM, direktori pelanggan, dan melihat riwayat kampanye. Tidak dapat membuat kampanye baru atau mengubah data produk. |
| `executive` | **Executive / Decision Maker** | Akses visual eksklusif untuk memantau performa keuangan (revenue), melihat daftar pesanan, dan mengamati ringkasan segmentasi pelanggan tanpa hak memodifikasi data. |
| `user` | **Regular User / Pelanggan** | Akses ke antarmuka belanja, pengisian kuis aroma, pengisian keranjang, checkout pesanan, dan profil pribadi. |

---

## Modul 2: Analisis Intelijen Bisnis (RFM + K-Means)

Modul ini adalah jantung CRM Esscentia yang bertugas menganalisis perilaku transaksi pelanggan menggunakan model **RFM (Recency, Frequency, Monetary)** dan algoritma klasterisasi **K-Means** secara real-time di [customer-rfm.ts](file:///d:/Tugas/CRM/esscentia/lib/customer-rfm.ts).

### Parameter Analisis & Algoritma
1. **Recency (R)**: Jumlah hari sejak transaksi terakhir pelanggan. Semakin kecil nilainya (baru bertransaksi), skornya semakin baik.
2. **Frequency (F)**: Total transaksi yang diselesaikan pelanggan. Semakin sering berbelanja, skornya semakin baik.
3. **Monetary (M)**: Total nilai nominal yang telah dibelanjakan pelanggan. Semakin besar nominalnya, skornya semakin baik.

### Fitur Utama
* **Konfigurasi Bobot Dinamis**: Admin dapat mengatur persentase prioritas untuk masing-masing parameter (Recency, Frequency, Monetary) melalui slider antarmuka. Sistem secara otomatis menyeimbangkan nilai sliders agar total akumulatif tetap bernilai 100%.
* **Konfigurasi Jumlah Klaster (k)**: Klasterisasi K-Means mendukung opsi 3, 4, atau 5 klaster dengan inisialisasi deterministik (`seed = 42`) untuk menjaga konsistensi hasil pengelompokan.
* **Segmentasi Matriks RFM**: Memetakan klaster hasil K-Means ke dalam 11 kategori segmentasi standar industri:
  * *Champions*, *Loyal Customers*, *Potential Loyalists*, *New Customers*, *Promising*, *Need Attention*, *About To Sleep*, *At Risk*, *Cannot Lose Them*, *Hibernating*, dan *Lost Customers*.
* **Indikator Churn Exposure**: Menghitung tingkat risiko pelanggan meninggalkan merek (*churn risk*) ke dalam tingkatan: `low` (aktif), `medium` (mulai lambat), dan `high` (lama tidak aktif).
* **Segment Shifts Tracker**: Mencatat pergeseran status segmen pelanggan secara dinamis (misal: pelanggan naik kelas ke *Champions* atau turun kelas ke *At Risk*).
* **Charts Representasi Visual**:
  * *Sales Trend Chart*: Grafik tren pendapatan harian dan volume pesanan 30 hari terakhir.
  * *Churn Pie Chart*: Distribusi persentase risiko churn database.
  * *RFM Cluster Chart (Scatter/Bubble)*: Pemetaan dimensi R-F-M secara grafis, dengan diameter gelembung mewakili kontribusi pengeluaran moneter.

---

## Modul 3: Direktori & Detail Profil Pelanggan (CRM)

Modul ini berfungsi memvisualisasikan database pelanggan yang terdaftar dan teranalisis untuk kebutuhan personalisasi layanan pelanggan di [app/admin/customers/page.tsx](file:///d:/Tugas/CRM/esscentia/app/admin/customers/page.tsx).

### Fitur Utama
* **Customer Directory**:
  * Pencarian instan menggunakan nama, email, atau ID pelanggan.
  * Penyaringan cepat (filter) berdasarkan segmen RFM spesifik.
  * Penyajian metrik penting langsung di tabel utama (total pesanan, akumulasi nominal belanja, tanggal aktivitas terakhir, dan jumlah riwayat masuk log).
* **Customer Detail Profile**:
  * Menampilkan ringkasan profil personal, kontak (Email, Telpon), serta tanggal pendaftaran.
  * Detail skor quantiles visual untuk masing-masing pilar RFM (skor skala 1-5).
  * Statistik nilai pesanan rata-rata (*Average Order Value*).
  * Blok penilaian risiko churn beserta saran strategi re-engagement yang disesuaikan secara dinamis.
  * Log katalog pesanan terakhir yang memuat tanggal belanja, nomor pesanan unik, deskripsi produk, total nominal, dan status pengiriman.

---

## Modul 4: Pengelola Kampanye Pemasaran (Campaign Designer)

Modul ini memfasilitasi pembuatan dan distribusi pesan promosi/informasi yang sangat bertarget kepada segmen pelanggan tertentu di [app/admin/campaigns/page.tsx](file:///d:/Tugas/CRM/esscentia/app/admin/campaigns/page.tsx).

### Fitur Utama
* **Target Segmen Spesifik**: Kampanye dapat diarahkan ke seluruh database pelanggan atau secara khusus membidik salah satu dari 11 segmen RFM yang dinilai memerlukan stimulasi.
* **Tipe Promosi (Promo Type)**:
  1. *Private Collection Access*: Penawaran akses awal sebelum produk diluncurkan secara publik.
  2. *Discount Code*: Kode kupon potongan harga khusus.
  3. *Event Invitation*: Undangan VIP eksklusif untuk acara butik fisik.
* **Penyalinan Pesan Terbantu AI (AI Assistent Refine)**: Simulasi penyempurnaan gaya bahasa pesan agar terdengar premium, persuasif, dan elegan.
* **Saluran Pengiriman (Outreach Channel)**: Mendukung pengiriman melalui *Email* (surat elektronik) atau *In-App Push* (notifikasi langsung di aplikasi pengguna).
* **Live Preview**: Pratinjau visual langsung untuk melihat bagaimana notifikasi akan tampil di layar perangkat pelanggan.
* **History & Revoke Campaign**: Menampilkan daftar log riwayat kampanye yang sudah diterbitkan. Modul ini menyediakan opsi bagi admin yang berwenang untuk membatalkan kampanye aktif, sehingga notifikasi promo akan langsung ditarik dari akun pengguna secara real-time.

---

## Modul 5: Katalog & Manajemen Produk (CRUD)

Modul ini mengelola siklus hidup produk parfum botol orisinal yang ditawarkan di Esscentia di [components/admin/ProductForm.tsx](file:///d:/Tugas/CRM/esscentia/components/admin/ProductForm.tsx).

### Fitur Utama
* **Penyajian Produk Belanja (Shop Catalog)**:
  * Mekanisme pencarian wewangian berdasarkan nama, merek, atau karakteristik aroma.
  * Penyaringan berbasis kategori (Pria, Wanita, Unisex) dan famili aroma (Woody, Floral, Citrus, Fresh, Amber, dll.).
  * Pengurutan berdasarkan tanggal rilis, rating ulasan bintang pelanggan, serta harga terendah/tertinggi.
* **Pengelolaan Inventaris (CRUD Produk)**:
  * Form terperinci untuk menambahkan atau mengedit item: Nama Parfum, Merek, Harga Botol Asli, Deskripsi Produk, Kategori, Klasifikasi Famili Aroma, Intensitas Aroma, serta Atribut Scent Signature (Sillage, Longevity, Projection).
  * Pengunggahan gambar botol parfum (terintegrasi dengan API pengunggahan [upload-image.ts](file:///d:/Tugas/CRM/esscentia/lib/upload-image.ts)).
  * Pengelolaan volume standar (ml) dan status persediaan barang.
* **Alert Stok Kritis (Low Stock Alert)**: Sistem admin secara cerdas melacak dan memunculkan peringatan apabila stok botol parfum utama tersisa $\le 5$ pcs.

---

## Modul 6: Manajemen Decant (Takaran Sampel)

Untuk menyiasati harga parfum premium botol besar yang mahal, Esscentia menyediakan modul **Decant** di [app/admin/decants/page.tsx](file:///d:/Tugas/CRM/esscentia/app/admin/decants/page.tsx) dan [lib/decant-db.ts](file:///d:/Tugas/CRM/esscentia/lib/decant-db.ts) yang memungkinkan penjualan parfum dalam botol sampel mini (vial).

### Fitur Utama
* **Pengaturan Takaran & Harga Independen**: Setiap parfum induk dapat dikonfigurasikan agar memiliki varian decant dengan 4 pilihan volume standar: **1 ml**, **2 ml**, **5 ml**, dan **10 ml**.
* **Manajemen Stok Mandiri**: Setiap ukuran decant memiliki status ketersediaan (*Ready* / *Habis*) dan jumlah persediaan stok terpisah dari botol parfum orisinalnya.
* **Integrasi Dashboard**: Sisa stok decant yang berada di bawah ambang batas kritis dipantau dan dilaporkan secara terpadu di halaman utama Admin Dashboard.

---

## Modul 7: Kuis Karakter Aroma (Fragrance Quiz)

Modul interaktif di sisi pelanggan untuk membantu mereka menemukan wewangian yang merepresentasikan kepribadiannya di [lib/fragrance-quiz.ts](file:///d:/Tugas/CRM/esscentia/lib/fragrance-quiz.ts).

### Alur Kuis
1. Pelanggan menjawab 5 pertanyaan visual yang meliputi:
   * *Estetika Personal* (Klasik, Romantis, Dinamis, Hangat).
   * *Suasana Impian* (Pondok Kayu, Taman Bunga, Tepi Pantai, Kafe Sore).
   * *Momen Penggunaan* (Formal, Kencan, Pagi/Olahraga, Malam/Pesta).
   * *Aroma Alami Favorit* (Cendana/Kulit, Mawar/Rempah, Bergamot/Laut, Vanila/Amber).
   * *Karakter Wewangian Representatif* (Misterius, Eksotis, Bersih, Unik).
2. **Sistem Scoring**: Setiap opsi jawaban memiliki pembobotan numerik untuk masing-masing tipe rumpun aroma (*Scent Family*).
3. **Penentuan Profil & Rekomendasi**: Algoritma menjumlahkan skor dan menetapkan profil aroma dominan pengguna (misalnya: *The Woody Connoisseur*, *The Floral Romantic*, atau *The Citrus Voyager*) serta menyajikan rekomendasi 3 produk parfum terbaik dari katalog yang memiliki relevansi kecocokan tertinggi.

---

## Modul 8: Sistem Jurnal & Artikel Edukasi

Modul penerbitan majalah/blog internal di [app/admin/journal/page.tsx](file:///d:/Tugas/CRM/esscentia/app/admin/journal/page.tsx) dan [lib/journal-articles.ts](file:///d:/Tugas/CRM/esscentia/lib/journal-articles.ts) untuk mendidik pelanggan mengenai cara pemakaian parfum, tren wewangian, dan informasi merek.

### Fitur Utama
* **Edukasi Scent Layering & Not Aroma**: Menyajikan artikel informatif terkurasi (seperti panduan mencampur wewangian, cara penyimpanan botol agar awet, dan penjelasan not atas/tengah/dasar).
* **Formulir Penulisan Jurnal**:
  * Pengisian judul, slug URL ramah SEO, kutipan singkat (*excerpt*), kategori artikel (Edukasi, Tren, Tips, Sustainability, Gaya), serta estimasi waktu membaca (*read time*).
  * Unggah gambar sampul artikel.
  * Editor paragraf konten yang dinamis.

---

## Modul 9: Keranjang Belanja & Alur Transaksi (Checkout)

Modul transaksi e-commerce inti di [cart-context.tsx](file:///d:/Tugas/CRM/esscentia/lib/cart-context.tsx) yang memfasilitasi pembelian produk parfum maupun takaran decant secara mulus.

### Fitur Utama
* **Shopping Cart Context**: Menyimpan data belanja di `localStorage` agar tidak hilang saat tab browser ditutup. Mendukung penambahan item, pengurangan kuantitas, dan penghapusan produk.
* **Promo Code Engine**: Mendukung penerapan kode promo dinamis (contoh: kupon **DISKON10** untuk potongan 10%, kupon **DISKON20** untuk potongan 20%).
* **Free Shipping Threshold**: Menerapkan gratis biaya pengiriman secara otomatis apabila total belanja pelanggan melampaui batas nominal tertentu (misal: belanja di atas Rp 500.000).
* **Checkout & Order Records**: Mengumpulkan alamat pengiriman pelanggan, metode pembayaran, menghitung total biaya akhir, serta membuat data pesanan resmi di database penjualan.

---

## Modul 10: Skema Data & Persistensi

Platform Esscentia mengombinasikan dua jenis persistensi data untuk performa yang optimal:

1. **Client-Side Persistence (`localStorage`)**:
   * Digunakan untuk menjaga status masuk log pengguna (*Authentication Session*) dan isi keranjang belanja pelanggan (*Cart Data*) secara instan tanpa membebani server database.
2. **Server-Side Persistence (MySQL Database)**:
   * Menggunakan koneksi pool terenkripsi di [db.ts](file:///d:/Tugas/CRM/esscentia/lib/db.ts).
   * Mengelola data tabel permanen untuk:
     * **Products**: Menyimpan informasi botol parfum premium.
     * **Decants**: Mengatur relasi harga takaran sampel mini.
     * **Orders**: Menyimpan transaksi checkout pelanggan lengkap untuk umpan analitik RFM.
     * **Users**: Manajemen akun terdaftar dengan sandi terenkripsi.
     * **Campaigns**: Menyimpan kampanye aktif untuk didistribusikan ke notifikasi in-app pengguna.
     * **Journal**: Menyimpan artikel edukasi yang dipublikasikan.
