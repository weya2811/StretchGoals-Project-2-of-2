const API_URL = import.meta.env.VITE_API_URL ?? ''

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

async function post(path, body) {
  const res = await fetch(`${API_URL}/api/auth${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }
  return data
}

export async function login(email, password) {
  const { token, user } = await post('/login', { email, password })
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

// role is either "student" or "business"
export async function signup(role, fields) {
  await post(`/register/${role}`, fields)
  // Log the new user straight in after registering
  return login(fields.email, fields.password)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
