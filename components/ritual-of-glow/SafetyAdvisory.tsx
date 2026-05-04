'use client';

export default function SafetyAdvisory() {
  return (
    <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-950/30 p-6 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xl">
          ⚠️
        </div>
        <div>
          <h3 className="mb-1 text-lg font-bold text-red-300">
            Safety Advisory Note
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-red-200/80">
            You indicated that you are currently using <strong>Retinol or
            prescription-strength actives</strong> (such as Tretinoin, Accutane,
            Adapalene, or Differin).
          </p>
          <p className="mb-3 text-sm leading-relaxed text-red-200/80">
            To support your skin barrier&apos;s integrity, all{' '}
            <strong>AHA, BHA, and Retinol-based products</strong> have been
            automatically removed from your routine. Combining these active
            ingredients may compromise the appearance of your skin&apos;s
            protective barrier.
          </p>
          <p className="text-xs text-red-300/50">
            This is not medical advice. Please consult your dermatologist for
            personalized guidance on combining active ingredients.
          </p>
        </div>
      </div>
    </div>
  );
}
