'use client';

import { RoutineStep } from '../../lib/ritual-of-glow/types';

interface RitualTimelineProps {
  steps: RoutineStep[];
}

export default function RitualTimeline({ steps }: RitualTimelineProps) {
  const categoryIcons: Record<string, string> = {
    'Oil Cleanse': '🫧',
    'Water Cleanse': '💦',
    Toner: '🌊',
    Essence: '✨',
    Serum: '💜',
    Treat: '🎯',
    Moisturize: '🧴',
    SPF: '☀️',
    Mask: '🎭',
  };

  return (
    <div className="relative mx-auto max-w-xl">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-purple-500/40 via-pink-500/30 to-purple-500/10" />

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.product.id} className="relative flex gap-4">
            {/* Timeline node */}
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-950/80 text-lg shadow-[0_0_12px_rgba(147,51,234,0.2)] backdrop-blur-sm">
              {categoryIcons[step.category] ?? '•'}
            </div>

            {/* Content */}
            <div
              className={`flex-1 rounded-xl border border-purple-500/15 bg-purple-950/30 p-4 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 ${
                index === 0
                  ? 'shadow-[0_0_16px_rgba(147,51,234,0.1)]'
                  : ''
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                  Step {step.order} — {step.category}
                </span>
                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300/50">
                  {step.product.time}
                </span>
              </div>
              <h3 className="font-semibold text-white">
                {step.product.name}
              </h3>
              <p className="mt-1 text-xs text-purple-300/50">
                {step.product.brand} • Apply {step.product.state}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
