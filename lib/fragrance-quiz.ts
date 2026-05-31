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
    id: 'atmosphere',
    question: 'Which atmosphere calls to you today?',
    options: [
      {
        id: 'cozy',
        label: 'Cozy',
        description: 'Cashmere, amber, and fireplace embers',
        image:
          'https://images.unsplash.com/photo-1513694203232-719a280e20f0?w=600&h=600&fit=crop',
        scores: { Gourmand: 3, Woody: 2 },
      },
      {
        id: 'energetic',
        label: 'Energetic',
        description: 'Sunlit citrus, sea salt, and green tea',
        image:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
        scores: { Citrus: 3, Fresh: 2 },
      },
      {
        id: 'formal',
        label: 'Formal',
        description: 'Sandalwood, iris, and refined musk',
        image:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop',
        scores: { Woody: 3, Floral: 2 },
      },
    ],
  },
  {
    id: 'occasion',
    question: 'When do you reach for fragrance most?',
    options: [
      {
        id: 'morning',
        label: 'Morning Ritual',
        description: 'Bright bergamot and soft florals',
        image:
          'https://images.unsplash.com/photo-1490750967868-88aa298bd6c0?w=600&h=600&fit=crop',
        scores: { Citrus: 3, Floral: 2 },
      },
      {
        id: 'evening',
        label: 'Evening Out',
        description: 'Deep oud, rose, and smoky vanilla',
        image:
          'https://images.unsplash.com/photo-1514938298603-c8148c4dae35?w=600&h=600&fit=crop',
        scores: { Woody: 2, Gourmand: 3 },
      },
      {
        id: 'anytime',
        label: 'Anytime',
        description: 'Versatile blends for every hour',
        image:
          'https://images.unsplash.com/photo-1596081223915-b4dc8b5a0b19?w=600&h=600&fit=crop',
        scores: { Floral: 2, Citrus: 1, Woody: 1, Gourmand: 1 },
      },
    ],
  },
  {
    id: 'notes',
    question: 'Which note family speaks to your soul?',
    options: [
      {
        id: 'floral',
        label: 'Floral',
        description: 'Rose absolue, peony, and white petals',
        image:
          'https://images.unsplash.com/photo-1518895949257-762f457f584f?w=600&h=600&fit=crop',
        scores: { Floral: 4 },
      },
      {
        id: 'woody',
        label: 'Woody',
        description: 'Cedar, vetiver, and sacred sandalwood',
        image:
          'https://images.unsplash.com/photo-1602928322639-0a6860196d4b?w=600&h=600&fit=crop',
        scores: { Woody: 4 },
      },
      {
        id: 'fresh',
        label: 'Fresh',
        description: 'Lemon zest, neroli, and ocean breeze',
        image:
          'https://images.unsplash.com/photo-1571975414439-27d4b93f5f2d?w=600&h=600&fit=crop',
        scores: { Citrus: 4, Fresh: 2 },
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
  Gourmand: {
    title: 'The Gourmand Dreamer',
    description:
      'Anda menyukai kehangatan vanilla, amber, dan rempah yang membalut seperti selimut. Aroma gourmand Anda intimate dan memorable.',
    tagline: 'Gourmand & Sweet',
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
