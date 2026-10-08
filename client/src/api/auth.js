const API_URL = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'token'

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_URL}/api/auth${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const error = new Error(data.error || 'Something went wrong')
    error.status = res.status
    throw error
  }

  return data
}

export async function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function login(email, password) {
  const { token, user } = await post('/login', { email, password })
  localStorage.setItem(TOKEN_KEY, token)
  return user
}

// role is either "client" or "business"
export async function signup(role, fields) {
  await post(`/register/${role}`, fields)
  // Log the new user straight in after registering
  return login(fields.email, fields.password)
}

export async function getCurrentUser() {
  const token = getToken();

  if (!token) return null

  try {
    return await request('/me', {method: 'GET'})
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      console.warn('Session expired or invalid token. Logging out...')
      logout()
    } else {
      console.error('Network glitch during auth check:', error.message)
    }

    return null
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}