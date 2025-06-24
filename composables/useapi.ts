import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface ApiResponse<T> {
  data: T | null
  error: {
    status: number
    name: string
    message: string
    details: Record<string, unknown>
  } | null
  loading: boolean
  meta?: StrapiMeta
}

interface ErrorResponse {
  status?: number
  name?: string
  message: string
  details?: Record<string, unknown>
}

export interface StrapiPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

interface StrapiMeta {
  pagination: StrapiPagination
}

export interface StrapiResponse<T> {
  data: T
  meta?: StrapiMeta
}

const BASE_URL = 'http://114.66.61.26:8080/api'

export function useApi<T>() {
  const response: Ref<ApiResponse<T>> = ref({
    data: null,
    error: null,
    loading: false,
    meta: undefined
  })

  const fetchData = async (endpoint: string, options: RequestInit = {}) => {
    response.value.loading = true
    response.value.error = null
    response.value.meta = undefined
    try {
      const url = `${BASE_URL}${endpoint}`
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!res.ok) {
        let errorData: ErrorResponse
        try {
          errorData = await res.json()
        } catch {
          errorData = { message: res.statusText }
        }

        throw {
          status: res.status,
          name: errorData.name || 'ApiError',
          message: errorData.message || `API request failed with status ${res.status}`,
          details: errorData.details || {}
        }
      }

      const data = await res.json();
      response.value.data = data.data;
      response.value.meta = data.meta;
    } catch (err) {
      response.value.error = {
        status: (err as any).status || 500,
        name: (err as any).name || 'UnknownError',
        message: (err as any).message || 'Unknown error occurred',
        details: (err as any).details || {}
      }
    } finally {
      response.value.loading = false
    }
  }

  const get = (endpoint: string) => fetchData(endpoint, { method: 'GET' })

  const post = (endpoint: string, body: unknown) =>
    fetchData(endpoint, {
      method: 'POST',
      body: JSON.stringify({ data: body }),
    })

  const put = (endpoint: string, body: unknown) =>
    fetchData(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ data: body }),
    })

  const del = (endpoint: string) => fetchData(endpoint, { method: 'DELETE' })

  return {
    data: computed(() => response.value.data),
    error: computed(() => response.value.error),
    loading: computed(() => response.value.loading),
    meta: computed(() => response.value.meta),
    get,
    post,
    put,
    del,
  }
}
