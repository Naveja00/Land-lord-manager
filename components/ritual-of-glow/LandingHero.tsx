'use client';

interface LandingHeroProps {
  onStart: () => void;
}

export default function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-[128px]" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-pink-500/15 blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-purple-400/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center">
        {/* Brand mark */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.6)]" />
          Luxury Skin Discovery
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
            Ritual of Glow
          </span>
        </h1>

        <p className="mb-4 text-lg text-purple-200/80 sm:text-xl">
          A professional 10-point skin discovery engine blending{' '}
          <span className="text-pink-300">Western clinical science</span> with{' '}
          <span className="text-purple-300">Korean barrier-first hydration</span>.
        </p>

        <p className="mb-10 text-sm text-purple-300/60">
          Personalized routines. Legally compliant guidance. Zero medical claims.
        </p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_32px_rgba(147,51,234,0.4)] transition-all duration-300 hover:shadow-[0_0_48px_rgba(244,114,182,0.5)] hover:scale-105"
        >
          <span className="relative z-10">Begin Your Discovery</span>
          <svg
            className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>

        {/* Feature pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-purple-300/50">
          <span className="rounded-full border border-purple-500/20 px-3 py-1">
            10-Point Engine
          </span>
          <span className="rounded-full border border-purple-500/20 px-3 py-1">
            Safety-First
          </span>
          <span className="rounded-full border border-purple-500/20 px-3 py-1">
            K-Beauty + Western
          </span>
          <span className="rounded-full border border-purple-500/20 px-3 py-1">
            Budget Toggle
          </span>
        </div>
      </div>
    </div>
  );
}
