import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const Contact = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <div className='mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6'>
      <PageHeader title='Contact Us' subtitle='Need help? Our support team is here for you.' />

      <form onSubmit={handleSubmit} className='grid gap-3 md:grid-cols-2'>
        <input
          required
          placeholder='Your name'
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
        />
        <input
          required
          type='email'
          placeholder='Your email'
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
        />
        <input
          required
          placeholder='Subject'
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none md:col-span-2'
        />
        <textarea
          required
          rows='5'
          placeholder='Your message'
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none md:col-span-2'
        />

        <button className='rounded-md bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 md:col-span-2'>
          Send message
        </button>
      </form>

      {submitted ? <p className='mt-4 text-sm text-green-700'>Thanks! We received your message.</p> : null}
    </div>
  )
}

export default Contact
