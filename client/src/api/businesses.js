import { getToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL ?? ''
const BASE = `${API_URL}/api/businesses`

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }
  return data
}

// Every business, with `joined` set if the logged-in student is already a client
export function getBusinesses() {
  return request('')
}

// Student selects a business and becomes its client
export function joinBusiness(businessId) {
  return request(`/${businessId}/join`, { method: 'POST' })
}

// Student stops being a client of a business
export function leaveBusiness(businessId) {
  return request(`/${businessId}/join`, { method: 'DELETE' })
}

// Business owner's own clients
export function getMyClients() {
  return request('/me/clients')
}
