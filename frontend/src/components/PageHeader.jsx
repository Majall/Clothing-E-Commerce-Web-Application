const PageHeader = ({ title, subtitle }) => (
  <div className='mb-6'>
    <h1 className='text-3xl font-semibold text-foreground'>{title}</h1>
    {subtitle ? <p className='mt-2 text-muted'>{subtitle}</p> : null}
  </div>
)

export default PageHeader
