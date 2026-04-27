const EmptyState = ({ title, description, action }) => (
  <div className='rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center'>
    <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
    <p className='mt-2 text-gray-600'>{description}</p>
    {action ? <div className='mt-4'>{action}</div> : null}
  </div>
)

export default EmptyState
