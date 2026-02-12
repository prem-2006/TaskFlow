'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import fetcher from '@/utils/fetcher';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          dedupingInterval: 5000,
          errorRetryCount: 3,
        }}
      >
        <ThemeProvider>
          <SidebarProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: 'white',
                  },
                },
              }}
            />
          </SidebarProvider>
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
