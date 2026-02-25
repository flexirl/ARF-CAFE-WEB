import api from './api'
import { User, Address } from '@/context/auth-context'

// Profile endpoints
export const profileAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  updateProfile: async (data: { name?: string; phone?: string }): Promise<User> => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },

  // Address endpoints
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get('/auth/addresses')
    return response.data
  },

  addAddress: async (address: Omit<Address, '_id'>): Promise<Address[]> => {
    const response = await api.post('/auth/addresses', address)
    return response.data
  },

  updateAddress: async (addressId: string, address: Partial<Address>): Promise<Address[]> => {
    const response = await api.put(`/auth/addresses/${addressId}`, address)
    return response.data
  },

  deleteAddress: async (addressId: string): Promise<Address[]> => {
    const response = await api.delete(`/auth/addresses/${addressId}`)
    return response.data
  },
}
