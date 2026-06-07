'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import toast from 'react-hot-toast';
import { User, Bell, Palette, LogOut, Loader2, ArrowRight } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    reminderEmail: true,
    reminderPush: true,
    dailyDigest: false,
  });

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      // Typically we'd have a PUT /api/user/preferences endpoint here
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage your account preferences and app settings</p>
      </div>

      <div className="space-y-8">
        
        {/* Profile Section */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
            <h2 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
              <User className="w-4 h-4 text-[var(--text-muted)]" />
              Account Profile
            </h2>
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar name={session?.user?.name} image={session?.user?.image} size="lg" />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">{session?.user?.name}</h3>
              <p className="text-[var(--text-secondary)]">{session?.user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-[var(--text-muted)]">
                Signed in with Google
              </div>
            </div>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
            <h2 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
              <Bell className="w-4 h-4 text-[var(--text-muted)]" />
              Notifications & Reminders
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Email Reminders</h4>
                <p className="text-sm text-[var(--text-secondary)]">Receive an email before tasks are due.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.reminderEmail}
                  onChange={(e) => setPreferences(prev => ({ ...prev, reminderEmail: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 dark:peer-focus:ring-brand-500/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Browser Push Notifications</h4>
                <p className="text-sm text-[var(--text-secondary)]">Get notified directly in your browser.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.reminderPush}
                  onChange={(e) => setPreferences(prev => ({ ...prev, reminderPush: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 dark:peer-focus:ring-brand-500/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Daily Digest</h4>
                <p className="text-sm text-[var(--text-secondary)]">Receive a summary of today&apos;s tasks every morning.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.dailyDigest}
                  onChange={(e) => setPreferences(prev => ({ ...prev, dailyDigest: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 dark:peer-focus:ring-brand-500/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
            <h2 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
              <Palette className="w-4 h-4 text-[var(--text-muted)]" />
              Appearance
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--text-primary)]">Theme Preference</h4>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`
                      px-4 py-3 rounded-xl border flex flex-col items-center gap-2 transition-all capitalize
                      ${theme === t 
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium' 
                        : 'border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                      }
                    `}
                  >
                    <div className={`w-12 h-8 rounded border mb-1 ${
                      t === 'light' ? 'bg-white border-slate-200' :
                      t === 'dark' ? 'bg-slate-900 border-slate-700' :
                      'bg-gradient-to-r from-white to-slate-900 border-slate-300 dark:border-slate-600'
                    }`} />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Integrations Section */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
            <h2 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
              <svg className="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
              Integrations
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Google Calendar Sync</h4>
                <p className="text-sm text-[var(--text-secondary)]">Tasks with a due date will be added to your primary calendar.</p>
              </div>
              <div className="text-brand-500 font-medium text-sm flex items-center bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-full">
                Connected
              </div>
            </div>
          </div>
        </section>

      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto">
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
