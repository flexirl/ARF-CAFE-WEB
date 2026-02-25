'use client'

import { useState, useEffect } from 'react'
import { useAuth, Address } from '@/context/auth-context'
import { profileAPI } from '@/lib/profile-api'
import styles from './address-management.module.css'

export default function AddressManagement() {
  const { user, updateUser } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: 'home' as const,
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    isDefault: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const data = await profileAPI.getAddresses()
      setAddresses(data)
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to load addresses',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      let updatedAddresses
      if (editingId) {
        updatedAddresses = await profileAPI.updateAddress(editingId, formData)
      } else {
        updatedAddresses = await profileAPI.addAddress(formData as Omit<Address, '_id'>)
      }
      setAddresses(updatedAddresses)
      updateUser({ addresses: updatedAddresses })
      setMessage({
        type: 'success',
        text: editingId ? 'Address updated successfully!' : 'Address added successfully!',
      })
      resetForm()
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save address',
      })
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    })
    setEditingId(address._id || null)
    setShowForm(true)
  }

  const handleDelete = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return

    try {
      const updatedAddresses = await profileAPI.deleteAddress(addressId)
      setAddresses(updatedAddresses)
      updateUser({ addresses: updatedAddresses })
      setMessage({ type: 'success', text: 'Address deleted successfully!' })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete address',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'home',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phoneNumber: '',
      isDefault: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className={styles.loading}>Loading addresses...</div>
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>Delivery Addresses</h2>

      {message && (
        <div className={`${styles.alert} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.addressesGrid}>
        {addresses.map((address) => (
          <div key={address._id} className={styles.addressCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.addressType}>{address.type.charAt(0).toUpperCase() + address.type.slice(1)}</h3>
              {address.isDefault && <span className={styles.badge}>Default</span>}
            </div>
            <p className={styles.addressText}>{address.street}</p>
            <p className={styles.addressText}>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className={styles.addressText}>{address.country}</p>
            <p className={styles.phone}>📞 {address.phoneNumber}</p>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => handleEdit(address)}>
                Edit
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(address._id || '')}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <p className={styles.empty}>No addresses saved yet</p>
      )}

      {!showForm && (
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + Add New Address
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.formTitle}>{editingId ? 'Edit Address' : 'Add New Address'}</h3>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.label}>
                Address Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="street" className={styles.label}>
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street address"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state" className={styles.label}>
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="postalCode" className={styles.label}>
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="country" className={styles.label}>
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="isDefault" className={styles.checkboxLabel}>
              Set as default address
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              {editingId ? 'Update Address' : 'Add Address'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
