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
    <div className='card mx-auto max-w-3xl p-6'>
      <PageHeader title='Contact Us' subtitle='Need help? Our support team is here for you.' />

      <form onSubmit={handleSubmit} className='grid gap-3 md:grid-cols-2'>
        <input
          required
          placeholder='Your name'
          className='input'
        />
        <input
          required
          type='email'
          placeholder='Your email'
          className='input'
        />
        <input
          required
          placeholder='Subject'
          className='input md:col-span-2'
        />
        <textarea
          required
          rows='5'
          placeholder='Your message'
          className='input md:col-span-2'
        />

        <button className='btn btn-primary px-4 py-3 text-sm md:col-span-2'>
          Send message
        </button>
      </form>

      {submitted ? <p className='mt-4 text-sm text-success'>Thanks! We received your message.</p> : null}
    </div>
  )
}

export default Contact
