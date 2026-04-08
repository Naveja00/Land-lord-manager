'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold">PropManager</h1>
        <p className="text-navy-300 mt-2">Loading...</p>
      </div>
    </div>
  );
}
