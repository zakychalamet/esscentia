export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

const reviewBodies = [
  'The longevity is incredible — I still catch whispers of it on my scarf the next morning. Elegant without being overpowering.',
  'Exactly what I hoped for: sophisticated, warm, and utterly unique. It has become my signature scent for evening occasions.',
  'Beautiful packaging and an even more beautiful fragrance. The heart notes bloom slowly and feel incredibly luxurious.',
  'Received many compliments at a dinner party. Subtle sillage that draws people in rather than announcing your arrival.',
  'Worth every rupiah. The blend feels artisanal and thoughtful, not like mass-market perfumes at all.',
  'Light on the skin at first, then unfolds into something deep and memorable. Perfect for cooler evenings.',
];

const reviewAuthors = [
  'Amara K.',
  'Daniel W.',
  'Priya S.',
  'Lucas M.',
  'Elena R.',
  'James T.',
];

const reviewTitles = [
  'My new signature',
  'Luxurious and lasting',
  'Exceeded expectations',
  'Compliment magnet',
  'Artisanal quality',
  'Perfect for evenings',
];

export function getReviewsForProduct(productId: string): ProductReview[] {
  const seed = productId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const count = 4 + (seed % 3);

  return Array.from({ length: count }, (_, i) => {
    const idx = (seed + i * 7) % reviewBodies.length;
    const rating = i === 0 ? 5 : 4 + ((seed + i) % 2);
    const month = ((seed + i) % 12) + 1;
    const day = ((seed + i * 3) % 28) + 1;

    return {
      id: `${productId}-review-${i}`,
      author: reviewAuthors[(seed + i) % reviewAuthors.length],
      rating,
      date: `${day} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1]} 2024`,
      title: reviewTitles[(seed + i) % reviewTitles.length],
      body: reviewBodies[idx],
      verified: i % 2 === 0,
    };
  });
}

export function getRatingBreakdown(reviews: ProductReview[]) {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const bucket = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
    counts[bucket]++;
  });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((stars, i) => ({
    stars,
    percent: Math.round((counts[4 - i] / total) * 100),
    count: counts[4 - i],
  }));
}
