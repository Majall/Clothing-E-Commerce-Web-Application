import { Link } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
  return (
    <section className='card grid items-center gap-6 p-6 shadow-soft md:grid-cols-2 md:p-10'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.3em] text-muted'>New arrivals</p>
        <h1 className='mt-3 text-3xl font-semibold text-foreground md:text-5xl'>Shop styles you love</h1>
        <p className='mt-4 text-muted'>
          Explore premium fashion drops with curated looks, fast shipping, and concierge-level support.
        </p>
        <div className='mt-6 flex gap-3'>
          <Link
            to='/collection'
            className='btn btn-primary px-5 py-3 text-sm'
          >
            Shop Collection
          </Link>
          <Link
            to='/about'
            className='btn btn-outline px-5 py-3 text-sm'
          >
            Learn More
          </Link>
        </div>
      </div>
      <div className='overflow-hidden rounded-xl bg-accent'>
        <img src={assets.hero_img} alt='Featured fashion collection' className='h-full w-full object-cover' />
      </div>
    </section>
  )
}

export default Hero
