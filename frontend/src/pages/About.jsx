import PageHeader from '../components/PageHeader'

const About = () => {
  return (
    <div className='card mx-auto max-w-3xl p-6'>
      <PageHeader title='About Us' subtitle='We build modern shopping experiences with quality-first products.' />
      <div className='space-y-4 text-sm leading-6 text-muted'>
        <p>
          E-Commerce Web is a modern storefront focused on clean design, trusted quality, and simple shopping
          flows from product discovery to checkout.
        </p>
        <p>
          Our catalog includes topwear, bottomwear, and seasonal collections for men, women, and kids. We focus
          on curated products, transparent pricing, and a smooth purchase journey.
        </p>
      </div>
    </div>
  )
}

export default About
