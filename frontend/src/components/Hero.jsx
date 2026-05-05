import { Link } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
  return (
    <section className='grid items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10 dark:border-slate-800 dark:bg-slate-900'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400'>New arrivals</p>
        <h1 className='mt-3 text-3xl font-bold text-slate-900 md:text-5xl dark:text-white'>Shop styles you love</h1>
        <p className='mt-4 text-slate-600 dark:text-slate-300'>
          Explore premium fashion drops with curated looks, fast shipping, and concierge-level support.
        </p>
        <div className='mt-6 flex gap-3'>
          <Link
            to='/collection'
            className='rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
          >
            Shop Collection
          </Link>
          <Link
            to='/about'
            className='rounded-md border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          >
            Learn More
          </Link>
        </div>
      </div>
      <div className='overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800'>
        <img src={assets.hero_img} alt='Featured fashion collection' className='h-full w-full object-cover' />
      </div>
    </section>
  )
}

export default Hero
