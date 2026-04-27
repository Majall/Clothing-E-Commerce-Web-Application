import { Link } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
  return (
    <section className='grid items-center gap-6 rounded-xl border border-gray-200 bg-white p-6 md:grid-cols-2 md:p-10'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-gray-500'>New arrivals</p>
        <h1 className='mt-3 text-3xl font-bold text-gray-900 md:text-5xl'>Shop styles you love</h1>
        <p className='mt-4 text-gray-600'>
          Explore fresh fashion drops with premium comfort, trusted quality, and fast shipping.
        </p>
        <div className='mt-6 flex gap-3'>
          <Link
            to='/collection'
            className='rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800'
          >
            Shop Collection
          </Link>
          <Link
            to='/about'
            className='rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100'
          >
            Learn More
          </Link>
        </div>
      </div>
      <div className='overflow-hidden rounded-xl bg-gray-100'>
        <img src={assets.hero_img} alt='Featured fashion collection' className='h-full w-full object-cover' />
      </div>
    </section>
  )
}

export default Hero
