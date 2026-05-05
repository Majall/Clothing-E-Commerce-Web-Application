import { useTheme } from '../context/useTheme'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800'
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className='text-sm'>{isDark ? '🌙' : '☀️'}</span>
      {isDark ? 'Dark' : 'Light'}
    </button>
  )
}

export default ThemeToggle
