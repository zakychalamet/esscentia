export interface JournalArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
}

export const journalArticles: JournalArticle[] = [
  {
    slug: 'memahami-not-parfum',
    title: 'Memahami Not Parfum: Top, Heart, dan Base',
    excerpt:
      'Pelajari bagaimana lapisan aroma membentuk karakter sebuah parfum — dari kilatan pertama hingga jejak yang tertinggal di kulit.',
    category: 'Edukasi',
    date: '12 Mei 2024',
    readTime: '6 menit',
    image:
      'https://images.unsplash.com/photo-1541643600912-78b084683601?w=800&h=500&fit=crop',
    author: 'Tim Esscentia',
    content: [
      'Setiap parfum dibangun seperti sebuah komposisi musik. Not atas (top notes) adalah kesan pertama yang Anda cium saat semprotan — biasanya segar dan ringan, seperti jeruk bergamot atau lemon. Mereka menghilang dalam 15 menit pertama.',
      'Not tengah (heart notes) muncul ketika parfum mulai berbaur dengan kimia kulit Anda. Di sinilah karakter utama terungkap: mawar, jasmine, atau kayu manis. Lapisan ini bertahan beberapa jam.',
      'Not dasar (base notes) adalah fondasi yang paling lama bertahan — amber, musk, sandalwood, atau oud. Mereka memberikan kedalaman dan memori yang sering kita kenali sebagai "signature scent" seseorang.',
      'Memahami struktur ini membantu Anda memilih parfum yang sesuai dengan kepribadian dan momen penggunaan — pagi yang cerah membutuhkan komposisi berbeda dari malam yang intim.',
    ],
  },
  {
    slug: 'tren-oud-2024',
    title: 'Tren Oud di 2024: Dari Timur ke Panggung Global',
    excerpt:
      'Oud tidak lagi eksklusif untuk parfum Timur Tengah. Simak bagaimana perfumer modern menafsirkan resin legendaris ini.',
    category: 'Tren',
    date: '28 April 2024',
    readTime: '5 menit',
    image:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=500&fit=crop',
    author: 'Amara Kusuma',
    content: [
      'Oud — resin dari pohon Aquilaria yang terinfeksi jamur — telah menjadi bahan paling mahal dalam dunia parfum. Harganya bisa melampaui emas per gram, dan aromanya tak tertandingi: smoky, animalic, dan sangat kompleks.',
      'Di 2024, kami melihat pergeseran menarik: oud tidak lagi disajikan dalam bentuk mentah yang overpowering. Perfumer artisanal memadukannya dengan mawar absolue, saffron, atau vanilla untuk menciptakan keseimbangan yang lebih wearable.',
      'Koleksi woody-spiced Esscentia terinspirasi dari tren ini — menghormati tradisi sambil membuka pintu bagi penikmat parfum baru yang ingin menjelajahi kedalaman oud tanpa intimidasi.',
      'Jika Anda baru mencoba oud, mulailah dengan komposisi yang memiliki oud di base notes, bukan sebagai protagonis tunggal. Biarkan kulit Anda berbicara sebelum memutuskan.',
    ],
  },
  {
    slug: 'cara-menyimpan-parfum',
    title: 'Cara Menyimpan Parfum agar Tahan Lama',
    excerpt:
      'Cahaya, panas, dan udara adalah musuh tersembunyi aroma favorit Anda. Berikut panduan penyimpanan dari laboratorium kami.',
    category: 'Tips',
    date: '15 April 2024',
    readTime: '4 menit',
    image:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=500&fit=crop',
    author: 'Tim Esscentia',
    content: [
      'Parfum adalah campuran minyak atsiri, alkohol, dan air yang sensitif terhadap lingkungan. Sinar UV dapat memecah molekul aroma, mengubah karakter yang dirancang dengan cermat oleh perfumer.',
      'Simpan botol di tempat sejuk dan kering — lemari pakaian lebih ideal daripada kamar mandi yang lembap. Suhu ideal berkisar 15–20°C.',
      'Hindari mengguncang botol berlebihan dan jangan membuang kotak asli jika Anda ingin melindungi botol dari cahaya. Tutup rapat setelah setiap penggunaan.',
      'Dengan perawatan yang tepat, parfum berkualitas dapat mempertahankan integritas aromanya selama 3–5 tahun, bahkan lebih untuk komposisi dengan konsentrasi tinggi seperti Extrait de Parfum.',
    ],
  },
  {
    slug: 'layering-fragrance',
    title: 'Seni Layering: Menciptakan Signature Scent Anda',
    excerpt:
      'Mengombinasikan dua atau lebih wewangian untuk menciptakan aroma yang unik — teknik yang dipraktikkan oleh perfumer profesional.',
    category: 'Edukasi',
    date: '2 April 2024',
    readTime: '7 menit',
    image:
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&h=500&fit=crop',
    author: 'Daniel Wijaya',
    content: [
      'Layering bukan sekadar menyemprot dua parfum secara berurutan. Ini adalah seni menciptakan harmoni — di mana satu aroma melengkapi yang lain tanpa saling menenggelamkan.',
      'Aturan emas: mulai dengan aroma yang lebih ringan (citrus atau floral), lalu tambahkan lapisan yang lebih dalam (woody atau gourmand). Semprotkan yang lebih ringan di pergelangan tangan, yang lebih berat di leher atau dada.',
      'Kombinasi populer di Esscentia: floral + woody untuk keseimbangan feminin-maskulin, atau citrus + amber untuk kesegaran yang berkelanjutan sepanjang hari.',
      'Eksperimen di hari libur ketika Anda tidak terburu-buru — catat kombinasi yang berhasil. Signature scent sejati lahir dari eksplorasi pribadi, bukan mengikuti tren semata.',
    ],
  },
  {
    slug: 'botanical-vs-synthetic',
    title: 'Botanical vs Sintetis: Mitos dan Fakta',
    excerpt:
      'Bahan sintetis bukan musuh — mereka membuka dimensi aroma yang mustahil dicapai hanya dengan ekstrak alami.',
    category: 'Sustainability',
    date: '20 Maret 2024',
    readTime: '6 menit',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=500&fit=crop',
    author: 'Priya Santoso',
    content: [
      'Ada kepercayaan bahwa parfum "alami" selalu lebih baik. Faktanya, industri parfum modern adalah perpaduan ilmu botani dan kimia yang canggih.',
      'Beberapa bunga — seperti gardenia atau lily-of-the-valley — hampir mustahil diekstrak secara alami dalam skala komersial. Molekul sintetis memungkinkan kita menikmati aromanya tanpa menghancurkan ekosistem.',
      'Di Esscentia, kami memprioritaskan bahan botanical yang dapat disourcing secara berkelanjutan, dan melengkapi dengan sintetis berkualitas tinggi yang bebas ftalat dan paraben.',
      'Transparansi adalah kunci. Setiap produk kami mencantumkan lapisan aroma sehingga Anda tahu persis apa yang Anda kenakan di kulit.',
    ],
  },
  {
    slug: 'parfum-untuk-setiap-momen',
    title: 'Memilih Parfum untuk Setiap Momen Hari',
    excerpt:
      'Dari rapat pagi hingga malam romantis — panduan memilih intensitas dan family aroma yang tepat.',
    category: 'Gaya',
    date: '8 Maret 2024',
    readTime: '5 menit',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa298bd6c0?w=800&h=500&fit=crop',
    author: 'Elena Rahman',
    content: [
      'Pagi hari memanggil kesegaran: citrus dan floral ringan dalam formulasi Eau de Toilette yang tidak overwhelming di ruang kerja ber-AC.',
      'Siang hingga sore, pertimbangkan floral yang lebih kaya atau woody ringan — Eau de Parfum memberikan longevity tanpa proyeksi berlebihan.',
      'Malam adalah waktu untuk eksplorasi: amber, oud, vanilla, atau kombinasi gourmand dalam Extrait de Parfum yang meninggalkan jejak memorabel.',
      'Bangun koleksi rotasi — tiga parfum untuk tiga mood berbeda lebih bernilai daripada satu botol besar yang jarang mencerminkan siapa Anda hari itu.',
    ],
  },
];

export function getArticleBySlug(slug: string): JournalArticle | undefined {
  return journalArticles.find((a) => a.slug === slug);
}
