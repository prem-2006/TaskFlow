'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext({
  isCollapsed: false,
  isMobileOpen: false,
  toggleSidebar: () => {},
  toggleMobile: () => {},
  closeMobile: () => {},
});

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('taskflow-sidebar-collapsed');
    if (stored !== null) {
      setIsCollapsed(JSON.parse(stored));
    }
  }, []);

  function toggleSidebar() {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('taskflow-sidebar-collapsed', JSON.stringify(next));
      return next;
    });
  }

  function toggleMobile() {
    setIsMobileOpen((prev) => !prev);
  }

  function closeMobile() {
    setIsMobileOpen(false);
  }

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, isMobileOpen, toggleSidebar, toggleMobile, closeMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
