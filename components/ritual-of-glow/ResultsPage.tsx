'use client';

import { Routine, QuizAnswers, BudgetTier } from '../../lib/ritual-of-glow/types';
import SafetyAdvisory from './SafetyAdvisory';
import RitualTimeline from './RitualTimeline';
import ProductCard from './ProductCard';
import BudgetToggle from './BudgetToggle';

interface ResultsPageProps {
  routine: Routine;
  answers: QuizAnswers;
  onTierToggle: (tier: BudgetTier) => void;
  onRestart: () => void;
}

export default function ResultsPage({
  routine,
  answers,
  onTierToggle,
  onRestart,
}: ResultsPageProps) {
  const surfaceLabels: Record<string, string> = {
    oily: 'Oily',
    combo: 'Combination',
    dry: 'Dry',
    balanced: 'Balanced',
  };

  const tempoLabels: Record<string, string> = {
    essential: 'Essential (3 min)',
    full: 'Full Ritual (10 min)',
  };

  return (
    <div className="relative min-h-screen px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-[128px]" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-pink-500/10 blur-[128px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.6)]" />
            Your Personal Discovery
          </div>
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              Your Glow Ritual
            </span>
          </h1>
          <p className="text-purple-200/60">
            {surfaceLabels[answers.surface]} skin •{' '}
            {tempoLabels[answers.tempo]} •{' '}
            {routine.tier === 'premium' ? 'Premium' : 'Budget-Friendly'}
          </p>
        </div>

        {/* Safety Advisory */}
        {routine.safetyWarning && <SafetyAdvisory />}

        {/* Budget Toggle */}
        <div className="mb-8 flex justify-center">
          <BudgetToggle currentTier={routine.tier} onToggle={onTierToggle} />
        </div>

        {/* Ritual Timeline */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-xl font-semibold text-purple-200">
            Your Step-by-Step Ritual
          </h2>
          <RitualTimeline steps={routine.steps} />
        </div>

        {/* Product Cards Grid */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-xl font-semibold text-purple-200">
            Your Curated Products
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {routine.steps.map((step) => (
              <ProductCard
                key={step.product.id}
                product={step.product}
                stepNumber={step.order}
              />
            ))}
          </div>
        </div>

        {/* Wildcard Spotlight */}
        {routine.wildcardProduct && (
          <div className="mb-12">
            <div className="mb-4 text-center">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-sm text-pink-300">
                <span className="text-base">💎</span>
                Architect Discovery Spotlight
              </div>
              <p className="text-sm text-purple-300/60">
                A curated wildcard targeting your specific pore and repair needs
              </p>
            </div>
            <div className="mx-auto max-w-lg">
              <ProductCard
                product={routine.wildcardProduct}
                isWildcard
              />
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mb-8 rounded-xl border border-purple-500/10 bg-purple-950/30 p-4 text-center text-xs text-purple-300/40 backdrop-blur-sm">
          <p>
            <strong className="text-purple-300/60">Discovery Notice:</strong>{' '}
            This is a personalized skincare discovery tool, not a medical
            consultation. All language supports the appearance of skin health.
            No medical claims are made. Always patch-test new products and
            consult a dermatologist for medical skin concerns.
          </p>
        </div>

        {/* Restart */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-2 text-sm text-purple-300 transition-all hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-300"
          >
            Retake Discovery Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
