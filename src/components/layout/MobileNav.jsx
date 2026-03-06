'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FolderKanban,
  Plus,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--border)] safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <div key={item.href} className="contents">
              {/* Add floating action button in the middle */}
              {index === 2 && (
                <Link
                  href="/tasks?new=true"
                  className="flex items-center justify-center w-12 h-12 -mt-6 rounded-full gradient-bg shadow-glow text-white active:scale-95 transition-transform"
                >
                  <Plus className="w-6 h-6" />
                </Link>
              )}

              <Link
                href={item.href}
                className={`
                  flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg
                  transition-colors duration-200
                  ${isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-[var(--text-muted)]'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
