const PageHeader = ({ title, subtitle }) => (
  <div className='mb-6'>
    <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
    {subtitle ? <p className='mt-2 text-gray-600'>{subtitle}</p> : null}
  </div>
)

export default PageHeader
