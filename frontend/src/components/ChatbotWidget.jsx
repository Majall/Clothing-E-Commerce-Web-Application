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
        <div className='w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-soft'>
          <header className='flex items-center justify-between border-b border-border px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-foreground'>Style Assistant</p>
              <p className='text-xs text-muted'>AI-powered shopping help</p>
            </div>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='rounded-full p-2 text-muted hover:bg-accent'
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
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground'
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
            className='flex items-center gap-2 border-t border-border px-3 py-2'
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='Ask about fit, style, or trends'
              className='flex-1 rounded-full border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            />
            <button
              type='submit'
              className='btn btn-primary rounded-full px-3 py-2 text-xs'
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='btn btn-primary rounded-full px-5 py-3 text-sm shadow-soft'
      >
        {isOpen ? 'Close' : 'Chat'}
      </button>
    </div>
  )
}

export default ChatbotWidget
