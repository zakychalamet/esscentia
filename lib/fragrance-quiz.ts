import { Product, products } from './products';
import { FRAGRANCE_FAMILIES, type FragranceFamily } from './fragrance-families';

export type ScentFamily = FragranceFamily;

export interface QuizOption {
  id: string;
  label: string;
  description: string;
  image: string;
  scores: Partial<Record<ScentFamily, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'personality',
    question: 'Bagaimana Anda mendeskripsikan estetika personal Anda?',
    options: [
      {
        id: 'classic',
        label: 'Klasik & Berwibawa',
        description: 'Menyukai kerapian, kekuatan karakter, dan kesan dewasa yang timeless.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop',
        scores: { Woody: 3, Leather: 2 },
      },
      {
        id: 'romantic',
        label: 'Anggun & Romantis',
        description: 'Lembut, elegan, menyukai estetika bunga dan kemewahan yang natural.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop',
        scores: { Floral: 3, Amber: 2 },
      },
      {
        id: 'vibrant',
        label: 'Aktif & Dinamis',
        description: 'Penuh energi, menyukai petualangan luar ruangan dan kesegaran alam bebas.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
        scores: { Citrus: 3, Fresh: 2 },
      },
      {
        id: 'sweet',
        label: 'Hangat & Cozy',
        description: 'Menyenangkan, menyukai kenyamanan, manisnya hidup, dan keintiman.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop',
        scores: { Vanilla: 3, Aromatic: 2 },
      },
    ],
  },
  {
    id: 'atmosphere',
    question: 'Suasana impian mana yang paling menenangkan jiwa Anda?',
    options: [
      {
        id: 'cabin',
        label: 'Pondok Kayu & Perapian',
        description: 'Menikmati aroma kayu pinus basah dan ketenangan hutan di musim dingin.',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=600&fit=crop',
        scores: { Woody: 3, Leather: 2 },
      },
      {
        id: 'garden',
        label: 'Taman Bunga Pagi Hari',
        description: 'Menghirup kesegaran kelopak bunga mawar, melati, dan embun pagi.',
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=600&fit=crop',
        scores: { Floral: 3, Aromatic: 2 },
      },
      {
        id: 'beach',
        label: 'Tepi Pantai yang Berangin',
        description: 'Merasakan deburan ombak, aroma garam laut, dan kesegaran pantai tropis.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop',
        scores: { Citrus: 3, Fresh: 2 },
      },
      {
        id: 'bakery',
        label: 'Kafe Hangat di Sore Hari',
        description: 'Menikmati aroma kue karamel, kopi segar, dan vanila manis.',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=600&fit=crop',
        scores: { Vanilla: 3, Amber: 2 },
      },
    ],
  },
  {
    id: 'occasion',
    question: 'Kapan Anda paling suka menyemprotkan parfum Anda?',
    options: [
      {
        id: 'formal',
        label: 'Acara Formal & Kerja',
        description: 'Membutuhkan rasa percaya diri, wibawa, dan kesan profesional yang kuat.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=600&fit=crop',
        scores: { Woody: 3, Leather: 3 },
      },
      {
        id: 'date',
        label: 'Kencan Romantis & Hangout',
        description: 'Ingin tampil memikat, manis, dan meninggalkan kesan mendalam yang intim.',
        image: 'https://images.unsplash.com/photo-1514938298603-c8148c4dae35?w=600&h=600&fit=crop',
        scores: { Floral: 3, Vanilla: 3 },
      },
      {
        id: 'daily',
        label: 'Pagi Hari & Olahraga',
        description: 'Memulai hari dengan kesegaran maksimal untuk membangkitkan semangat beraktivitas.',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=600&fit=crop',
        scores: { Citrus: 3, Fresh: 3 },
      },
      {
        id: 'evening',
        label: 'Malam Santai & Acara Sosial',
        description: 'Mengikuti pesta malam, makan malam elegan, atau momen relaksasi mewah.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop',
        scores: { Amber: 3, Aromatic: 3 },
      },
    ],
  },
  {
    id: 'elements',
    question: 'Aroma alami mana yang paling memikat penciuman Anda?',
    options: [
      {
        id: 'woods',
        label: 'Kayu Cendana & Kulit Mewah',
        description: 'Kombinasi aroma kayu yang creamy dan sentuhan smoky leather yang elegan.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
        scores: { Woody: 3, Leather: 3 },
      },
      {
        id: 'flowers',
        label: 'Mawar Segar & Rempah Ringan',
        description: 'Keharuman kelopak bunga mawar mekar dipadu dengan dedaunan hijau.',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=600&fit=crop',
        scores: { Floral: 3, Aromatic: 2 },
      },
      {
        id: 'citrus_fruits',
        label: 'Bergamot & Hembusan Air Laut',
        description: 'Kesegaran kulit jeruk purut yang cerah dipadu hembusan air laut yang bersih.',
        image: 'https://images.unsplash.com/photo-1571975414439-27d4b93f5f2d?w=600&h=600&fit=crop',
        scores: { Citrus: 3, Fresh: 3 },
      },
      {
        id: 'vanilla_pods',
        label: 'Vanilla Pods & Amber Emas',
        description: 'Kehangatan ekstrak vanila manis dipadu dengan resin amber yang sensual.',
        image: 'https://images.unsplash.com/photo-1506755855726-85d82b8b34ec?w=600&h=600&fit=crop',
        scores: { Vanilla: 3, Amber: 3 },
      },
    ],
  },
  {
    id: 'profile',
    question: 'Karakter wewangian seperti apa yang mewakili diri Anda?',
    options: [
      {
        id: 'mysterious',
        label: 'Misterius, Bold & Berkarakter',
        description: 'Aroma yang meninggalkan jejak kuat, mendalam, dan tegas.',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop',
        scores: { Leather: 3, Woody: 2 },
      },
      {
        id: 'exotic',
        label: 'Eksotis, Hangat & Sensual',
        description: 'Aroma yang manis hangat, membalut kulit dengan kemewahan emas.',
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&h=600&fit=crop',
        scores: { Amber: 3, Floral: 2 },
      },
      {
        id: 'clean',
        label: 'Bersih, Menyegarkan & Sporty',
        description: 'Aroma yang membuat Anda merasa segar dan energetic sepanjang hari.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=600&fit=crop',
        scores: { Fresh: 3, Citrus: 2 },
      },
      {
        id: 'unique',
        label: 'Unik, Rileks & Berbeda',
        description: 'Aroma herbal menenangkan yang khas dan tidak pasaran.',
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=600&fit=crop',
        scores: { Aromatic: 3, Vanilla: 2 },
      },
    ],
  },
];

const familyProfiles: Record<
  ScentFamily,
  { title: string; description: string; tagline: string }
> = {
  Woody: {
    title: 'The Woody Connoisseur',
    description:
      'Anda tertarik pada kedalaman kayu, resin, dan kehangatan yang tenang. Parfum woody Anda memancarkan kepercayaan diri yang halus dan timeless.',
    tagline: 'Woody & Spiced',
  },
  Floral: {
    title: 'The Floral Romantic',
    description:
      'Jiwa Anda berbicara melalui kelopak mawar, peony, dan bunga putih. Aroma floral Anda elegan, feminin, dan penuh emosi.',
    tagline: 'Floral & Delicate',
  },
  Citrus: {
    title: 'The Citrus Voyager',
    description:
      'Kesegaran adalah identitas Anda — jeruk, bergamot, dan angin laut. Parfum citrus membawa energi dan optimisme ke setiap langkah.',
    tagline: 'Citrus & Bright',
  },
  Fresh: {
    title: 'The Fresh Explorer',
    description:
      'Anda menyukai kesegaran aquatic dan green notes yang ringan. Aroma fresh Anda clean, modern, dan penuh vitalitas.',
    tagline: 'Fresh & Aquatic',
  },
  Amber: {
    title: 'The Amber Enthusiast',
    description:
      'Kehangatan resin dan amber membalut kulit Anda dengan sensualitas yang dalam. Aroma Anda rich, golden, dan memorable.',
    tagline: 'Amber & Warm',
  },
  Vanilla: {
    title: 'The Vanilla Dreamer',
    description:
      'Anda menyukai kehangatan vanilla, amber, dan rempah yang membalut seperti selimut. Aroma Vanilla Anda intimate dan memorable.',
    tagline: 'Vanilla & Sweet',
  },
  Aromatic: {
    title: 'The Aromatic Artisan',
    description:
      'Herbal, spices, dan aromatic notes adalah bahasa Anda. Parfum Anda refined, sophisticated, dan penuh karakter.',
    tagline: 'Aromatic & Herbal',
  },
  Leather: {
    title: 'The Leather Maverick',
    description:
      'Anda drawn to smoky leather, dark woods, dan bold compositions. Aroma Anda powerful, maskulin, dan commanding.',
    tagline: 'Leather & Smoky',
  },
};

function emptyFamilyTotals(): Record<ScentFamily, number> {
  return Object.fromEntries(FRAGRANCE_FAMILIES.map((f) => [f, 0])) as Record<
    ScentFamily,
    number
  >;
}

export function calculateQuizResult(
  answers: Record<string, string>
): { family: ScentFamily; profile: (typeof familyProfiles)[ScentFamily] } {
  const totals = emptyFamilyTotals();

  for (const question of quizQuestions) {
    const optionId = answers[question.id];
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const [family, points] of Object.entries(option.scores) as [ScentFamily, number][]) {
      if (family in totals) totals[family] += points;
    }
  }

  const family = (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    'Woody') as ScentFamily;

  return { family, profile: familyProfiles[family] };
}

export function getRecommendedProductsForFamily(
  family: ScentFamily,
  limit = 3
): Product[] {
  return products
    .filter((p) => p.family === family)
    .sort(
      (a, b) =>
        (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.rating - a.rating
    )
    .slice(0, limit);
}
