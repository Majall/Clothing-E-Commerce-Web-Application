import { useEffect, useState } from 'react'
import AccountLayout from '../components/AccountLayout'
import EmptyState from '../components/EmptyState'
import { useShop } from '../context/useShop'

const emptyForm = {
  label: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
}

const Addresses = () => {
  const { addresses, loadAddresses, addAddress, updateAddress, deleteAddress } = useShop()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    loadAddresses()
  }, [loadAddresses])

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    const action = editingId ? updateAddress(editingId, form) : addAddress(form)
    const result = await action

    if (result.ok) {
      setStatus({ type: 'success', message: editingId ? 'Address updated.' : 'Address saved.' })
      resetForm()
    } else {
      setStatus({ type: 'error', message: result.message || 'Unable to save address.' })
    }
  }

  const handleEdit = (address) => {
    setEditingId(address.id)
    setForm({
      label: address.label || '',
      fullName: address.fullName || '',
      phone: address.phone || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || '',
      isDefault: address.isDefault || false,
    })
  }

  const handleDelete = async (id) => {
    const result = await deleteAddress(id)
    if (!result.ok) {
      setStatus({ type: 'error', message: result.message || 'Unable to delete address.' })
    }
  }

  return (
    <AccountLayout
      title='Address book'
      subtitle='Save multiple addresses and choose a default for checkout.'
    >
      <section className='card p-5'>
        <h2 className='text-lg font-semibold text-foreground'>Saved addresses</h2>
        {addresses.length === 0 ? (
          <div className='mt-4'>
            <EmptyState
              title='No addresses yet'
              description='Add an address so checkout forms can be filled in faster.'
            />
          </div>
        ) : (
          <div className='mt-4 space-y-3'>
            {addresses.map((address) => (
              <article key={address.id} className='rounded-lg border border-border p-4 text-sm text-muted'>
                <div className='flex flex-wrap items-start justify-between gap-2'>
                  <div>
                    <p className='font-semibold text-foreground'>{address.fullName}</p>
                    {address.label ? <p className='text-xs text-muted'>{address.label}</p> : null}
                    <p className='mt-2'>
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ''}
                    </p>
                    <p>
                      {address.city}
                      {address.state ? `, ${address.state}` : ''} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    {address.phone ? <p className='mt-1'>{address.phone}</p> : null}
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    {address.isDefault ? (
                      <span className='badge badge-success'>
                        Default
                      </span>
                    ) : null}
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={() => handleEdit(address)}
                        className='btn btn-outline px-3 py-1 text-xs text-muted'
                      >
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDelete(address.id)}
                        className='btn btn-destructive px-3 py-1 text-xs'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className='card p-5'>
        <h2 className='text-lg font-semibold text-foreground'>
          {editingId ? 'Edit address' : 'Add a new address'}
        </h2>
        <form onSubmit={handleSubmit} className='mt-4 grid gap-3 md:grid-cols-2'>
          <input
            value={form.label}
            onChange={(event) => updateField('label', event.target.value)}
            placeholder='Label (Home, Office)'
            className='input'
          />
          <input
            required
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            placeholder='Full name'
            className='input'
          />
          <input
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder='Phone'
            className='input'
          />
          <input
            required
            value={form.line1}
            onChange={(event) => updateField('line1', event.target.value)}
            placeholder='Address line 1'
            className='input'
          />
          <input
            value={form.line2}
            onChange={(event) => updateField('line2', event.target.value)}
            placeholder='Address line 2'
            className='input'
          />
          <input
            required
            value={form.city}
            onChange={(event) => updateField('city', event.target.value)}
            placeholder='City'
            className='input'
          />
          <input
            value={form.state}
            onChange={(event) => updateField('state', event.target.value)}
            placeholder='State / Province'
            className='input'
          />
          <input
            required
            value={form.postalCode}
            onChange={(event) => updateField('postalCode', event.target.value)}
            placeholder='Postal code'
            className='input'
          />
          <input
            required
            value={form.country}
            onChange={(event) => updateField('country', event.target.value)}
            placeholder='Country'
            className='input'
          />
          <label className='flex items-center gap-2 text-sm text-muted md:col-span-2'>
            <input
              type='checkbox'
              checked={form.isDefault}
              onChange={(event) => updateField('isDefault', event.target.checked)}
            />
            Set as default address
          </label>
          <div className='flex flex-wrap gap-2 md:col-span-2'>
            <button
              type='submit'
              className='btn btn-primary px-4 py-2 text-sm'
            >
              {editingId ? 'Update address' : 'Save address'}
            </button>
            {editingId ? (
              <button
                type='button'
                onClick={resetForm}
                className='btn btn-outline px-4 py-2 text-sm text-muted'
              >
                Cancel
              </button>
            ) : null}
          </div>
          {status.message ? (
            <p
              className={`text-sm md:col-span-2 ${status.type === 'success' ? 'text-success' : 'text-destructive'}`}
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </section>
    </AccountLayout>
  )
}

export default Addresses
