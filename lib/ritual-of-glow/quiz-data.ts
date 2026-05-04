import { QuizQuestion } from './types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'surface',
    stepNumber: 1,
    title: 'Surface Discovery',
    subtitle: 'How does your skin feel by midday?',
    options: [
      { value: 'oily', label: 'Oily', description: 'Shiny T-zone and cheeks by noon', icon: '💧' },
      { value: 'combo', label: 'Combination', description: 'Oily T-zone but dry cheeks', icon: '⚖️' },
      { value: 'dry', label: 'Dry', description: 'Tight, flaky, or rough feeling', icon: '🏜️' },
      { value: 'balanced', label: 'Balanced', description: 'Comfortable and even all day', icon: '✨' },
    ],
    proxyFallback: {
      prompt: 'Does your makeup slide off by noon?',
      mappings: {
        'Yes, it melts right off': 'oily',
        'Only around my nose and forehead': 'combo',
        'No, it clings and looks patchy': 'dry',
        'It stays pretty much the same': 'balanced',
      },
    },
  },
  {
    id: 'pores',
    stepNumber: 2,
    title: 'Pore Profile',
    subtitle: 'What is your main pore concern?',
    options: [
      { value: 'blackheads', label: 'Blackheads', description: 'Dark dots on nose, chin, or forehead', icon: '⚫' },
      { value: 'enlarged', label: 'Enlarged', description: 'Visible, open-looking pores', icon: '🔍' },
      { value: 'texture', label: 'Texture', description: 'Bumpy or uneven skin surface', icon: '🌊' },
      { value: 'none', label: 'No Concern', description: 'Pores are not a priority for me', icon: '🌸' },
    ],
    proxyFallback: {
      prompt: 'Does your nose feel bumpy or smooth?',
      mappings: {
        'Bumpy with dark spots': 'blackheads',
        'Bumpy with visible holes': 'enlarged',
        'Generally rough or uneven': 'texture',
        'Smooth and clear': 'none',
      },
    },
  },
  {
    id: 'shield',
    stepNumber: 3,
    title: 'Shield Strength',
    subtitle: 'How reactive is your skin?',
    options: [
      { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated, redness-prone, stings with new products', icon: '🛡️' },
      { value: 'mid', label: 'Moderate', description: 'Occasionally reacts to strong actives', icon: '⚡' },
      { value: 'resistant', label: 'Resistant', description: 'Rarely reacts, tolerates most products', icon: '💪' },
    ],
    proxyFallback: {
      prompt: 'When you try a new product, what usually happens?',
      mappings: {
        'My skin turns red or stings': 'sensitive',
        'Sometimes irritation, sometimes fine': 'mid',
        'I can use almost anything': 'resistant',
      },
    },
  },
  {
    id: 'horizon',
    stepNumber: 4,
    title: 'Environment Horizon',
    subtitle: 'What best describes your daily climate?',
    options: [
      { value: 'humid', label: 'Humid', description: 'Tropical, sticky, high-moisture air', icon: '🌴' },
      { value: 'arid', label: 'Arid', description: 'Dry desert, low humidity, or heated indoor air', icon: '☀️' },
      { value: 'pollution', label: 'Pollution', description: 'Urban, high-traffic, smog exposure', icon: '🏙️' },
      { value: 'normal', label: 'Normal', description: 'Temperate, moderate conditions', icon: '🌤️' },
    ],
    proxyFallback: {
      prompt: 'Does your skin feel dry or sticky most days?',
      mappings: {
        'Very sticky and damp': 'humid',
        'Very dry and cracked': 'arid',
        'Dull and grimy by evening': 'pollution',
        'Comfortable most of the time': 'normal',
      },
    },
  },
  {
    id: 'sweat',
    stepNumber: 5,
    title: 'Sweat Factor',
    subtitle: 'What is your daily activity level?',
    options: [
      { value: 'active', label: 'Active', description: 'Daily gym, sports, or physical labor', icon: '🏋️' },
      { value: 'minimal', label: 'Minimal', description: 'Desk work, light movement', icon: '💻' },
    ],
    proxyFallback: {
      prompt: 'Do you sweat heavily most days?',
      mappings: {
        'Yes, I work out or do physical work daily': 'active',
        'No, I mostly sit during the day': 'minimal',
      },
    },
  },
  {
    id: 'repair',
    stepNumber: 6,
    title: 'Repair Mission',
    subtitle: 'What does your skin need to recover from?',
    options: [
      { value: 'pih', label: 'Dark Marks / PIH', description: 'Post-acne spots, sun spots, or hyperpigmentation', icon: '🎯' },
      { value: 'redness', label: 'Redness', description: 'Rosacea-like flush, irritation, or visible capillaries', icon: '🌹' },
      { value: 'clean', label: 'No Repair Needed', description: 'Even tone, no major recovery goals', icon: '💎' },
    ],
    proxyFallback: {
      prompt: 'After a blemish heals, what does it leave behind?',
      mappings: {
        'A dark or brown spot that lingers': 'pih',
        'A red or pink mark that stays': 'redness',
        'Nothing noticeable': 'clean',
      },
    },
  },
  {
    id: 'timeline',
    stepNumber: 7,
    title: 'Timeline',
    subtitle: 'Your age range helps us calibrate ingredient strength.',
    options: [
      { value: 'under25', label: 'Under 25', description: 'Focus on prevention and oil control', icon: '🌱' },
      { value: '25to40', label: '25 – 40', description: 'Balance of prevention and early correction', icon: '🌿' },
      { value: '41to60', label: '41 – 60', description: 'Firmness support and tone correction', icon: '🌳' },
      { value: 'over60', label: '61+', description: 'Deep hydration and barrier reinforcement', icon: '🏵️' },
    ],
    proxyFallback: {
      prompt: 'What matters most to you right now?',
      mappings: {
        'Preventing breakouts': 'under25',
        'Keeping things balanced and youthful': '25to40',
        'Firming and brightening': '41to60',
        'Deep comfort and nourishment': 'over60',
      },
    },
  },
  {
    id: 'arsenal',
    stepNumber: 8,
    title: 'The Arsenal (Safety Check)',
    subtitle: 'Are you currently using any Retinol or Prescription Medications?',
    options: [
      { value: 'yes', label: 'Yes', description: 'Tretinoin, Accutane, Adapalene, Retinol, or other Rx actives', icon: '⚠️' },
      { value: 'no', label: 'No', description: 'Not using any prescription-strength actives', icon: '✅' },
    ],
    proxyFallback: {
      prompt: 'Are you using any of these? Tretinoin, Accutane, Adapalene, Retinol, Differin, or any product prescribed by a dermatologist.',
      mappings: {
        'Yes, I use one or more of those': 'yes',
        'No, none of those': 'no',
      },
    },
  },
  {
    id: 'tempo',
    stepNumber: 9,
    title: 'Your Tempo',
    subtitle: 'How much time can you dedicate to your ritual?',
    options: [
      { value: 'essential', label: 'Essential (3 min)', description: 'Quick core steps: Cleanse, Moisturize, SPF', icon: '⏱️' },
      { value: 'full', label: 'Full Ritual (10 min)', description: 'Complete layered routine with all steps', icon: '🕐' },
    ],
    proxyFallback: {
      prompt: 'How much time do you realistically spend on skincare?',
      mappings: {
        'Under 5 minutes, I like it quick': 'essential',
        'I enjoy a longer, layered routine': 'full',
      },
    },
  },
  {
    id: 'investment',
    stepNumber: 10,
    title: 'Your Investment',
    subtitle: 'What is your preferred budget tier?',
    options: [
      { value: 'budget', label: 'Budget-Friendly', description: 'Effective products at accessible prices', icon: '💰' },
      { value: 'premium', label: 'Premium / Luxury', description: 'High-end formulations and luxury brands', icon: '👑' },
    ],
    proxyFallback: {
      prompt: 'How much would you spend on a single serum?',
      mappings: {
        'Under $25': 'budget',
        '$25 or more': 'premium',
      },
    },
  },
];
