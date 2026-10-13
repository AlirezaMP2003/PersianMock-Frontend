import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 60000,
})

export async function fetchFieldTypes() {
  const response = await api.get('/fields/')
  return response.data
}

export async function previewData(payload) {
  const response = await api.post('/generate/', {
    ...payload,
    count: Math.min(payload.count, 5),
    include_create_table: false,
    format: 'json',
  })

  return response.data
}

export async function downloadData(payload) {
  const response = await api.post('/generate/', payload, {
    responseType: 'blob',
  })

  return response.data
}

export async function getApiError(error) {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'The server took too long to respond.'
    }

    return 'Cannot connect to the backend. Check that the API server is running.'
  }

  let data = error.response.data

  if (data instanceof Blob) {
    try {
      data = JSON.parse(await data.text())
    } catch {
      return `Request failed (HTTP ${error.response.status}).`
    }
  }

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item) => `${item.loc?.join('.') || 'Input'}: ${item.msg}`)
      .join(' | ')
  }

  if (typeof data?.detail === 'string') {
    return data.detail
  }

  if (typeof data?.message === 'string') {
    return data.message
  }

  return `Request failed (HTTP ${error.response.status}).`
}
