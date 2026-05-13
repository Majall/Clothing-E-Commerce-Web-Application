const QuantityInput = ({ value, onChange, min = 1 }) => {
  return (
    <div className='inline-flex items-center overflow-hidden rounded-md border border-input bg-background'>
      <button
        type='button'
        className='px-3 py-2 text-lg leading-none text-muted transition hover:bg-accent'
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
        className='w-14 border-x border-input bg-transparent py-2 text-center text-sm text-foreground focus:outline-none'
      />
      <button
        type='button'
        className='px-3 py-2 text-lg leading-none text-muted transition hover:bg-accent'
        onClick={() => onChange(value + 1)}
        aria-label='Increase quantity'
      >
        +
      </button>
    </div>
  )
}

export default QuantityInput
