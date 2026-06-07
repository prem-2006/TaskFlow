'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Users,
} from 'lucide-react';
import { mockWorkspaces } from '@/lib/mockData';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobile } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-[var(--surface)] dark:bg-[var(--surface)]
          border-r border-[var(--border)]
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--border)]">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold gradient-text">TaskFlow</span>
            )}
          </Link>

          <button
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Switcher */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <div className="relative">
              <select className="w-full appearance-none bg-slate-50 dark:bg-white/5 border border-[var(--border)] text-[var(--text-primary)] text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium">
                {mockWorkspaces.map(ws => (
                  <option key={ws._id} value={ws._id}>{ws.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-muted)]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <button className="mt-2 w-full flex items-center justify-center gap-2 text-xs font-medium text-brand-600 hover:text-brand-700 py-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors">
              <Users className="w-3.5 h-3.5" /> Invite Teammates
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t border-[var(--border)] space-y-1">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleSidebar}
            className="sidebar-link w-full hidden lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
