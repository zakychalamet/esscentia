export const FRAGRANCE_FAMILIES = [
  'Woody',
  'Floral',
  'Citrus',
  'Fresh',
  'Amber',
  'Vanilla',
  'Aromatic',
  'Leather',
] as const;

export type FragranceFamily = (typeof FRAGRANCE_FAMILIES)[number];

export function isFragranceFamily(value: string | null): value is FragranceFamily {
  return value !== null && (FRAGRANCE_FAMILIES as readonly string[]).includes(value);
}

export const FRAGRANCE_FAMILY_TAGS: Record<FragranceFamily, string> = {
  Woody: 'WOODY & SPICED',
  Floral: 'FLORAL',
  Citrus: 'CITRUS',
  Fresh: 'FRESH & AQUATIC',
  Amber: 'AMBER & WARM',
  Vanilla: 'VANILLA',
  Aromatic: 'AROMATIC & HERBAL',
  Leather: 'LEATHER & SMOKY',
};

export function getFragranceFamilyTag(family: string): string {
  if (isFragranceFamily(family)) return FRAGRANCE_FAMILY_TAGS[family];
  return family.toUpperCase();
}
