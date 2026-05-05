const PageHeader = ({ title, subtitle }) => (
  <div className='mb-6'>
    <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>{title}</h1>
    {subtitle ? <p className='mt-2 text-slate-600 dark:text-slate-300'>{subtitle}</p> : null}
  </div>
)

export default PageHeader
