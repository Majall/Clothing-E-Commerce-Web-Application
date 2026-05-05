const QuantityInput = ({ value, onChange, min = 1 }) => {
  return (
    <div className='inline-flex items-center overflow-hidden rounded-md border border-slate-300 dark:border-slate-700'>
      <button
        type='button'
        className='px-3 py-2 text-lg leading-none transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label='Decrease quantity'
      >
        −
      </button>
      <input
        type='number'
        min={min}
        value={value}
        onChange={(event) => onChange(Math.max(min, Number(event.target.value) || min))}
        className='w-14 border-x border-slate-300 bg-white py-2 text-center text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
      />
      <button
        type='button'
        className='px-3 py-2 text-lg leading-none transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
        onClick={() => onChange(value + 1)}
        aria-label='Increase quantity'
      >
        +
      </button>
    </div>
  )
}

export default QuantityInput
