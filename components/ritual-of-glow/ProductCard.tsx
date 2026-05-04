'use client';

import { Product } from '../../lib/ritual-of-glow/types';

interface ProductCardProps {
  product: Product;
  stepNumber?: number;
  isWildcard?: boolean;
}

export default function ProductCard({
  product,
  stepNumber,
  isWildcard = false,
}: ProductCardProps) {
  const stateColors: Record<string, string> = {
    Damp: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    'Bone-Dry': 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    Clean: 'text-green-300 bg-green-500/10 border-green-500/20',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
        isWildcard
          ? 'border-pink-500/30 bg-gradient-to-br from-pink-950/50 to-purple-950/50 shadow-[0_0_30px_rgba(244,114,182,0.15)]'
          : 'border-purple-500/20 bg-purple-950/40 hover:border-purple-500/40 hover:shadow-[0_0_24px_rgba(147,51,234,0.15)]'
      }`}
    >
      {/* Glow effect on hover */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${
          isWildcard
            ? 'bg-gradient-to-br from-pink-500/5 to-transparent'
            : 'bg-gradient-to-br from-purple-500/5 to-transparent'
        }`}
      />

      {/* Header */}
      <div className="relative mb-4 flex items-start justify-between gap-2">
        <div className="flex-1">
          {stepNumber && (
            <span className="mb-1 inline-block rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-300">
              Step {stepNumber}
            </span>
          )}
          {isWildcard && (
            <span className="mb-1 inline-block rounded-full bg-pink-500/20 px-2 py-0.5 text-xs font-medium text-pink-300">
              Discovery Spotlight
            </span>
          )}
          <h3 className="text-lg font-bold text-white">{product.name}</h3>
          <p className="text-sm text-purple-300/60">{product.brand}</p>
        </div>
        <span className="shrink-0 rounded-lg border border-purple-500/20 bg-purple-900/40 px-2 py-1 text-xs font-medium text-purple-300">
          {product.category}
        </span>
      </div>

      {/* Reasoning */}
      <p className="relative mb-4 text-sm leading-relaxed text-purple-200/70">
        {product.reasoning}
      </p>

      {/* Ritual guide */}
      <div className="relative mb-4 rounded-lg border border-purple-500/10 bg-purple-900/20 p-3">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-purple-400/60">
          Application Ritual
        </div>
        <p className="text-sm text-purple-200/80">{product.ritual}</p>
      </div>

      {/* Meta tags */}
      <div className="relative flex flex-wrap gap-2">
        <span className="rounded-full border border-purple-500/20 bg-purple-900/30 px-2.5 py-1 text-xs text-purple-300/60">
          ⏱ {product.time}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs ${stateColors[product.state]}`}
        >
          {product.state === 'Damp' && '💧'}
          {product.state === 'Bone-Dry' && '☀️'}
          {product.state === 'Clean' && '✨'} Apply {product.state}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs ${
            product.tier === 'premium'
              ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
              : 'border-green-500/20 bg-green-500/10 text-green-300'
          }`}
        >
          {product.tier === 'premium' ? '👑 Premium' : '💰 Budget'}
        </span>
      </div>
    </div>
  );
}
