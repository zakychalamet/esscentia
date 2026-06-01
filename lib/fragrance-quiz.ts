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
    question: 'How would you describe your core personal aesthetic?',
    options: [
      {
        id: 'classic',
        label: 'Classic & Grounded',
        description: 'Refined, tailored, timeless, and deeply intellectual.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop',
        scores: { Woody: 3, Leather: 2 },
      },
      {
        id: 'romantic',
        label: 'Romantic & Sensual',
        description: 'Warm, emotional, artistic, and passionately intimate.',
        image: 'https://images.unsplash.com/photo-1518895949257-762f457f584f?w=600&h=600&fit=crop',
        scores: { Floral: 3, Amber: 2, Vanilla: 1 },
      },
      {
        id: 'vibrant',
        label: 'Vibrant & Clean',
        description: 'Energizing, optimistic, active, and filled with crisp vitality.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
        scores: { Citrus: 3, Fresh: 2, Aromatic: 1 },
      },
    ],
  },
  {
    id: 'atmosphere',
    question: 'Which dream atmosphere calls to your soul today?',
    options: [
      {
        id: 'library',
        label: 'Antique Library',
        description: 'Aged paper, mahogany shelves, and worn leather armchairs.',
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=600&fit=crop',
        scores: { Leather: 4, Woody: 2 },
      },
      {
        id: 'garden',
        label: 'Herbal Garden',
        description: 'Wild lavender, crushed mint, green leaves, and wet moss.',
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=600&fit=crop',
        scores: { Aromatic: 4, Fresh: 2, Floral: 1 },
      },
      {
        id: 'cozy',
        label: 'Cozy Cabin',
        description: 'Crackling fireplace embers, wool blankets, and sweet vanilla pods.',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e20f0?w=600&h=600&fit=crop',
        scores: { Vanilla: 4, Amber: 3, Woody: 1 },
      },
    ],
  },
  {
    id: 'occasion',
    question: 'When do you reach for a fragrance most?',
    options: [
      {
        id: 'formal',
        label: 'Formal & Professional',
        description: 'Executive meetings, high-stakes styling, and formal dinners.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=600&fit=crop',
        scores: { Woody: 3, Leather: 3, Aromatic: 2 },
      },
      {
        id: 'casual',
        label: 'Casual Getaway',
        description: 'Weekend travels, sunlit coffee runs, and creative daily wear.',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=600&fit=crop',
        scores: { Citrus: 4, Fresh: 3, Aromatic: 1 },
      },
      {
        id: 'date',
        label: 'Intimate Date Night',
        description: 'Dim lights, close conversations, and unforgettable impressions.',
        image: 'https://images.unsplash.com/photo-1514938298603-c8148c4dae35?w=600&h=600&fit=crop',
        scores: { Amber: 4, Vanilla: 3, Floral: 2 },
      },
    ],
  },
  {
    id: 'elements',
    question: 'Which natural scent profile captivates you most?',
    options: [
      {
        id: 'blooms',
        label: 'Rich Blooms',
        description: 'Petals of luxury rose, sweet jasmine, and fresh peony.',
        image: 'https://images.unsplash.com/photo-1490750967868-88aa298bd6c0?w=600&h=600&fit=crop',
        scores: { Floral: 4, Amber: 1 },
      },
      {
        id: 'resins',
        label: 'Resins & Spices',
        description: 'Cinnamon bark, sweet incense smoke, and golden amber oils.',
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&h=600&fit=crop',
        scores: { Amber: 4, Vanilla: 2 },
      },
      {
        id: 'coastal',
        label: 'Coastal Rain',
        description: 'Salty ocean waves, pine needles, and clean ozone.',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=600&fit=crop',
        scores: { Fresh: 4, Aromatic: 2, Citrus: 1 },
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
