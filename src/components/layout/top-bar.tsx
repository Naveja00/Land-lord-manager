'use client';

import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/store';
import type { Profile } from '@/types/database';
import { Users } from 'lucide-react';

export function TopBar() {
  const { currentUser, setCurrentUser, profiles } = useAppState();
  const router = useRouter();

  const handleRoleSwitch = (user: Profile) => {
    setCurrentUser(user);
    if (user.role === 'tenant') {
      router.push('/tenant');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        {/* Role switcher (demo only) */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 mr-1">Demo:</span>
          {profiles.map((user) => (
            <button
              key={user.id}
              onClick={() => handleRoleSwitch(user)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                currentUser.id === user.id
                  ? 'bg-navy-100 text-navy-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {user.full_name.split(' ')[0]} ({user.role.replace('_', ' ')})
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
