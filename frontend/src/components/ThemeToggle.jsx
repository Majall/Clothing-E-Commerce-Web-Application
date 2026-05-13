import { useTheme } from '../context/useTheme'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='btn btn-outline rounded-full bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted shadow-sm backdrop-blur hover:bg-accent'
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className='text-sm'>{isDark ? '🌙' : '☀️'}</span>
      {isDark ? 'Dark' : 'Light'}
    </button>
  )
}

export default ThemeToggle
