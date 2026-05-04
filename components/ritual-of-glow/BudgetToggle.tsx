'use client';

import { BudgetTier } from '../../lib/ritual-of-glow/types';

interface BudgetToggleProps {
  currentTier: BudgetTier;
  onToggle: (tier: BudgetTier) => void;
}

export default function BudgetToggle({
  currentTier,
  onToggle,
}: BudgetToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-950/50 p-1 backdrop-blur-sm">
      <button
        onClick={() => onToggle('budget')}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
          currentTier === 'budget'
            ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-[0_0_16px_rgba(34,197,94,0.3)]'
            : 'text-purple-300/60 hover:text-purple-200'
        }`}
      >
        💰 Budget-Friendly
      </button>
      <button
        onClick={() => onToggle('premium')}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
          currentTier === 'premium'
            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-[0_0_16px_rgba(147,51,234,0.3)]'
            : 'text-purple-300/60 hover:text-purple-200'
        }`}
      >
        👑 Premium
      </button>
    </div>
  );
}
