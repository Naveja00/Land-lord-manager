import {
  QuizAnswers,
  Product,
  ProductCategory,
  Routine,
  RoutineStep,
  BudgetTier,
} from './types';
import { productDatabase } from './products';

const CATEGORY_ORDER: ProductCategory[] = [
  'Oil Cleanse',
  'Water Cleanse',
  'Toner',
  'Essence',
  'Serum',
  'Treat',
  'Moisturize',
  'SPF',
];

const ESSENTIAL_CATEGORIES: ProductCategory[] = [
  'Water Cleanse',
  'Moisturize',
  'SPF',
];

function scoreProduct(product: Product, answers: QuizAnswers): number {
  let score = 0;

  if (product.skinTypes.includes(answers.surface)) score += 3;
  if (product.climates.includes(answers.horizon)) score += 2;
  if (product.repairTargets.includes(answers.repair)) score += 2;
  if (product.poreTargets.includes(answers.pores)) score += 1;
  if (product.ageGroups.includes(answers.timeline)) score += 1;

  // Hybrid Matching: prioritize Korean Essences for Arid/Sensitive
  if (
    (answers.horizon === 'arid' || answers.shield === 'sensitive') &&
    product.category === 'Essence' &&
    isKoreanBrand(product.brand)
  ) {
    score += 3;
  }

  // Hybrid Matching: prioritize Western Actives for PIH/Aging
  if (
    (answers.repair === 'pih' ||
      answers.timeline === '41to60' ||
      answers.timeline === 'over60') &&
    (product.category === 'Serum' || product.category === 'Treat') &&
    isWesternBrand(product.brand)
  ) {
    score += 3;
  }

  // Active lifestyle bonus for lightweight/quick products
  if (answers.sweat === 'active' && product.time === '15s') {
    score += 1;
  }

  return score;
}

function isKoreanBrand(brand: string): boolean {
  const koreanBrands = [
    'Sulwhasoo',
    'Laneige',
    'Missha',
    'COSRX',
    'Dear Klairs',
    'Innisfree',
    "I'm From",
    'Beauty of Joseon',
    'Amorepacific',
    'KOSE',
  ];
  return koreanBrands.includes(brand);
}

function isWesternBrand(brand: string): boolean {
  const westernBrands = [
    'Drunk Elephant',
    'Sunday Riley',
    'Skinceuticals',
    'The Ordinary',
    "Paula's Choice",
    'La Mer',
    'Estée Lauder',
    'Tatcha',
    'CeraVe',
    'La Roche-Posay',
    'Neutrogena',
    'Supergoop!',
    'Shu Uemura',
  ];
  return westernBrands.includes(brand);
}

function generateReasoning(product: Product, answers: QuizAnswers): string {
  const parts: string[] = [];

  if (product.skinTypes.includes(answers.surface)) {
    const surfaceLabels: Record<string, string> = {
      oily: 'oily',
      combo: 'combination',
      dry: 'dry',
      balanced: 'balanced',
    };
    parts.push(
      `Supports the appearance of ${surfaceLabels[answers.surface]} skin`
    );
  }

  if (product.climates.includes(answers.horizon)) {
    const climateLabels: Record<string, string> = {
      humid: 'humid climates',
      arid: 'dry environments',
      pollution: 'urban pollution exposure',
      normal: 'temperate conditions',
    };
    parts.push(`formulated for ${climateLabels[answers.horizon]}`);
  }

  if (
    answers.repair !== 'clean' &&
    product.repairTargets.includes(answers.repair)
  ) {
    const repairLabels: Record<string, string> = {
      pih: 'may support the look of an even skin tone',
      redness: 'may help soothe the appearance of redness',
    };
    parts.push(repairLabels[answers.repair] ?? '');
  }

  if (
    answers.pores !== 'none' &&
    product.poreTargets.includes(answers.pores)
  ) {
    parts.push('may improve the look of pores');
  }

  const filtered = parts.filter(Boolean);
  if (filtered.length === 0) {
    return 'A well-rounded addition to your skincare ritual.';
  }

  let result = filtered[0];
  if (filtered.length > 1) {
    result = filtered.slice(0, -1).join(', ') + ', and ' + filtered[filtered.length - 1];
  }
  return result.charAt(0).toUpperCase() + result.slice(1) + '.';
}

function filterSafetyProducts(
  products: Product[],
  arsenalActive: boolean
): Product[] {
  if (!arsenalActive) return products;
  return products.filter((p) => !p.isSafetyActive);
}

function selectBestProduct(
  products: Product[],
  category: ProductCategory,
  answers: QuizAnswers,
  tier: BudgetTier
): Product | null {
  const candidates = products.filter(
    (p) => p.category === category && p.tier === tier
  );

  if (candidates.length === 0) {
    const fallback = products.filter((p) => p.category === category);
    if (fallback.length === 0) return null;
    return fallback.reduce((best, p) =>
      scoreProduct(p, answers) > scoreProduct(best, answers) ? p : best
    );
  }

  return candidates.reduce((best, p) =>
    scoreProduct(p, answers) > scoreProduct(best, answers) ? p : best
  );
}

function selectWildcard(
  products: Product[],
  answers: QuizAnswers,
  tier: BudgetTier
): Product | null {
  const wildcards = products.filter(
    (p) => p.isWildcard === true && p.tier === tier
  );

  if (wildcards.length === 0) {
    const allWildcards = products.filter((p) => p.isWildcard === true);
    if (allWildcards.length === 0) return null;
    return allWildcards.reduce((best, p) =>
      scoreProduct(p, answers) > scoreProduct(best, answers) ? p : best
    );
  }

  // Prioritize based on Pore or Repair answer
  const targeted = wildcards.filter(
    (p) =>
      p.poreTargets.includes(answers.pores) ||
      p.repairTargets.includes(answers.repair)
  );

  const pool = targeted.length > 0 ? targeted : wildcards;
  return pool.reduce((best, p) =>
    scoreProduct(p, answers) > scoreProduct(best, answers) ? p : best
  );
}

export function buildRoutine(
  answers: QuizAnswers,
  tierOverride?: BudgetTier
): Routine {
  const tier = tierOverride ?? answers.investment;
  const arsenalActive = answers.arsenal === 'yes';
  const safeProducts = filterSafetyProducts(productDatabase, arsenalActive);

  const categories =
    answers.tempo === 'essential' ? ESSENTIAL_CATEGORIES : CATEGORY_ORDER;

  const steps: RoutineStep[] = [];
  let order = 1;

  for (const category of categories) {
    const product = selectBestProduct(safeProducts, category, answers, tier);
    if (product) {
      steps.push({
        order,
        category,
        product: {
          ...product,
          reasoning: generateReasoning(product, answers),
        },
        reasoning: generateReasoning(product, answers),
      });
      order++;
    }
  }

  const wildcardProduct = selectWildcard(safeProducts, answers, tier);
  const wildcardWithReasoning = wildcardProduct
    ? {
        ...wildcardProduct,
        reasoning: generateWildcardReasoning(wildcardProduct, answers),
      }
    : null;

  return {
    steps,
    wildcardProduct: wildcardWithReasoning,
    safetyWarning: arsenalActive,
    tempo: answers.tempo,
    tier,
  };
}

function generateWildcardReasoning(
  product: Product,
  answers: QuizAnswers
): string {
  const poreLabels: Record<string, string> = {
    blackheads: 'blackhead concerns',
    enlarged: 'enlarged pores',
    texture: 'textural irregularities',
    none: 'overall skin clarity',
  };
  const repairLabels: Record<string, string> = {
    pih: 'uneven tone',
    redness: 'redness and sensitivity',
    clean: 'skin maintenance',
  };

  return `Architect Discovery Spotlight: This ${product.category.toLowerCase()} specifically targets your ${poreLabels[answers.pores]} and supports ${repairLabels[answers.repair]}. A curated addition to elevate your ritual.`;
}

export function swapTier(routine: Routine, answers: QuizAnswers, newTier: BudgetTier): Routine {
  return buildRoutine(answers, newTier);
}
