const EmptyState = ({ title, description, action }) => (
  <div className='rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900'>
    <h3 className='text-xl font-semibold text-slate-900 dark:text-white'>{title}</h3>
    <p className='mt-2 text-slate-600 dark:text-slate-300'>{description}</p>
    {action ? <div className='mt-4'>{action}</div> : null}
  </div>
)

export default EmptyState
