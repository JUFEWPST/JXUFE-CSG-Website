import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  loading: boolean
  meta?: ApiMeta
}

interface ErrorResponse {
  status?: number
  name?: string
  message: string
  details?: Record<string, unknown>
}

export interface ApiMeta {
  current_page: number
  page_size: number
  total_items: number
  total_pages: number
}

const DEFAULT_BASE_URL = 'https://csec.jxufe.edu.cn/nozomi'

interface CmsEnvelope<T> {
  code: number
  message: string
  data: T
  meta?: ApiMeta
}

interface ApiError {
  status: number
  name: string
  message: string
  details: Record<string, unknown>
}

const isCmsEnvelope = <T>(value: unknown): value is CmsEnvelope<T> => {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return typeof record.code === 'number' && 'data' in record
}

const normalizeError = (err: unknown): ApiError => {
  const fallback: ApiError = {
    status: 500,
    name: 'UnknownError',
    message: 'Unknown error occurred',
    details: {},
  }

  if (typeof err !== 'object' || err === null) return fallback
  const e = err as Partial<ApiError>
  return {
    status: e.status ?? 500,
    name: e.name ?? 'UnknownError',
    message: e.message ?? 'Unknown error occurred',
    details: e.details ?? {},
  }
}

export function useApi<T>() {
  const response: Ref<ApiResponse<T>> = ref({
    data: null,
    error: null,
    loading: false,
    meta: undefined // This will be inferred as ApiMeta | undefined if I update ApiResponse
  })

  const config = useRuntimeConfig()
  const baseURL = config.public?.apiBase || DEFAULT_BASE_URL
  let activeController: AbortController | null = null
  let requestId = 0

  const fetchData = async (endpoint: string, options: RequestInit = {}) => {
    requestId += 1
    const currentId = requestId
    if (activeController) {
      activeController.abort()
    }
    activeController = new AbortController()

    response.value.loading = true
    response.value.error = null
    response.value.meta = undefined
    try {
      const url = `${baseURL}${endpoint}`
      const res = await fetch(url, {
        ...options,
        signal: activeController.signal,
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

      const payload: unknown = await res.json()
      if (currentId !== requestId) return

      if (isCmsEnvelope<T>(payload)) {
        if (payload.code !== 200) {
          throw {
            status: res.status,
            name: 'ApiError',
            message: payload.message || `API request failed with status ${payload.code}`,
            details: {},
          }
        }
        response.value.data = payload.data
        response.value.meta = payload.meta
        return
      }

      response.value.data = payload as T
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return
      response.value.error = normalizeError(err)
    } finally {
      if (currentId === requestId) {
        response.value.loading = false
      }
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
