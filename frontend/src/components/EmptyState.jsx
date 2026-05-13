const EmptyState = ({ title, description, action }) => (
  <div className='rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-sm'>
    <h3 className='text-xl font-semibold text-foreground'>{title}</h3>
    <p className='mt-2 text-muted'>{description}</p>
    {action ? <div className='mt-4'>{action}</div> : null}
  </div>
)

export default EmptyState
