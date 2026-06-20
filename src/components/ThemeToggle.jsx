import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border border-slate-200 bg-slate-100/90 p-1 shadow-inner transition-all duration-300 hover:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-emerald-500/20 dark:bg-surface-overlay/90 dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.35)] dark:hover:border-brand-400/30 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span
        className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-500 shadow-md transition-all duration-300 dark:bg-gradient-to-br dark:from-brand-400 dark:to-emerald-600 dark:text-white dark:shadow-glow-brand ${
          isDark ? 'translate-x-[2.125rem]' : 'translate-x-0'
        }`}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
      <Sun
        className={`absolute left-2 h-3.5 w-3.5 text-amber-500 transition-opacity duration-300 ${
          isDark ? 'opacity-30' : 'opacity-0'
        }`}
        aria-hidden
      />
      <Moon
        className={`absolute right-2 h-3.5 w-3.5 text-slate-400 transition-opacity duration-300 ${
          isDark ? 'opacity-0' : 'opacity-40'
        }`}
        aria-hidden
      />
    </button>
  );
}
