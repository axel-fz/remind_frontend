'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, CalendarClock, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const { token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <motion.header 
        className="glass-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="header-content">
          <div className="flex items-center gap-2">
            <CalendarClock size={20} color="var(--input-focus)" />
            <a href="/" style={{ fontWeight: 600, fontSize: '1.125rem', letterSpacing: '-0.025em', color: 'inherit', textDecoration: 'none' }}>Remind</a>
          </div>
          <div className="flex items-center gap-4">
            {!token ? (
              <>
                <a href="/login" className="nav-link hide-on-mobile" style={{ fontWeight: 500 }}>Sign In</a>
                <a href="/signup" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Get Started</a>
              </>
            ) : (
              <>
                <a href="/dashboard" className="nav-link hide-on-mobile" style={{ fontWeight: 500 }}>Dashboard</a>
                <button onClick={() => { logout(); router.push('/'); }} className="icon-btn" aria-label="Log out">
                  <LogOut size={18} />
                </button>
              </>
            )}
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 15 }} 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme} 
              className="theme-toggle" 
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.header>
      <style jsx>{`
        .nav-link {
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.95rem;
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 0.7; }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
      <main className="app-container">
        {children}
      </main>
    </>
  );
}
