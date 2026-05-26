import { useTheme } from '../context/useTheme'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='rounded-md p-2 text-muted transition hover:bg-accent hover:text-foreground'
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className='text-base'>{isDark ? '🌙' : '☀️'}</span>
    </button>
  )
}

export default ThemeToggle
