import { useMemo, useState } from 'react'
import { useShop } from '../context/useShop'

const initialMessages = [
  { id: 'welcome', sender: 'bot', text: 'Hi! I can help you find outfits, sizes, or trending picks.' },
]

const ChatbotWidget = () => {
  const { products } = useShop()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const quickSuggestions = useMemo(
    () => products.slice(0, 3).map((product) => product.name),
    [products],
  )

  const handleSend = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const nextMessage = { id: `user-${Date.now()}`, sender: 'user', text: trimmed }
    const response = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: `Here are a few picks I recommend: ${quickSuggestions.join(', ')}. Want to filter by color or fabric?`,
    }

    setMessages((prev) => [...prev, nextMessage, response])
    setInput('')
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3'>
      {isOpen ? (
        <div className='w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900'>
          <header className='flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800'>
            <div>
              <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>Style Assistant</p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>AI-powered shopping help</p>
            </div>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            >
              ✕
            </button>
          </header>
          <div className='max-h-64 space-y-3 overflow-y-auto px-4 py-3 text-sm'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-lg px-3 py-2 ${
                  message.sender === 'user'
                    ? 'ml-auto bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSend(input)
            }}
            className='flex items-center gap-2 border-t border-slate-200 px-3 py-2 dark:border-slate-800'
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='Ask about fit, style, or trends'
              className='flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
            />
            <button
              type='submit'
              className='rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900'
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900'
      >
        {isOpen ? 'Close' : 'Chat'}
      </button>
    </div>
  )
}

export default ChatbotWidget
