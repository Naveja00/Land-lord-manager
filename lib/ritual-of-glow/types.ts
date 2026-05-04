export type SurfaceType = 'oily' | 'combo' | 'dry' | 'balanced';
export type PoreType = 'blackheads' | 'enlarged' | 'texture' | 'none';
export type ShieldType = 'sensitive' | 'mid' | 'resistant';
export type HorizonType = 'humid' | 'arid' | 'pollution' | 'normal';
export type SweatType = 'active' | 'minimal';
export type RepairType = 'pih' | 'redness' | 'clean';
export type TimelineType = 'under25' | '25to40' | '41to60' | 'over60';
export type ArsenalType = 'yes' | 'no';
export type TempoType = 'essential' | 'full';
export type InvestmentType = 'budget' | 'premium';

export interface QuizAnswers {
  surface: SurfaceType;
  pores: PoreType;
  shield: ShieldType;
  horizon: HorizonType;
  sweat: SweatType;
  repair: RepairType;
  timeline: TimelineType;
  arsenal: ArsenalType;
  tempo: TempoType;
  investment: InvestmentType;
}

export type ProductCategory =
  | 'Oil Cleanse'
  | 'Water Cleanse'
  | 'Toner'
  | 'Essence'
  | 'Serum'
  | 'Treat'
  | 'Moisturize'
  | 'SPF'
  | 'Mask';

export type ApplicationState = 'Damp' | 'Bone-Dry' | 'Clean';
export type BudgetTier = 'budget' | 'premium';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  reasoning: string;
  ritual: string;
  time: string;
  state: ApplicationState;
  isSafetyActive: boolean;
  tier: BudgetTier;
  skinTypes: SurfaceType[];
  climates: HorizonType[];
  repairTargets: RepairType[];
  poreTargets: PoreType[];
  ageGroups: TimelineType[];
  isWildcard?: boolean;
}

export interface QuizQuestion {
  id: keyof QuizAnswers;
  stepNumber: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
  proxyFallback: {
    prompt: string;
    mappings: Record<string, string>;
  };
}

export interface QuizOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export interface RoutineStep {
  order: number;
  category: ProductCategory;
  product: Product;
  reasoning: string;
}

export interface Routine {
  steps: RoutineStep[];
  wildcardProduct: Product | null;
  safetyWarning: boolean;
  tempo: TempoType;
  tier: BudgetTier;
}
