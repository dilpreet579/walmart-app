export async function apiFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwt_token')
    if (!token) throw new Error('Not logged in')
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    })
  }