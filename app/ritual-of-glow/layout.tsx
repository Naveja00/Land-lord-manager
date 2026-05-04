import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ritual of Glow — Luxury Skin Discovery',
  description:
    'A professional 10-point skin discovery engine blending Western clinical science with Korean barrier-first hydration.',
};

export default function RitualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rog-app min-h-screen bg-[#0f0a1e] text-white antialiased selection:bg-purple-500/30">
      {children}
    </div>
  );
}
