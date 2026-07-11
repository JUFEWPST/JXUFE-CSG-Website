import { ref, computed } from "vue";
import type { Ref } from "vue";

export interface ApiResponse<T> {
    data: T | null;
    error: ApiError | null;
    loading: boolean;
    meta?: ApiMeta;
}

interface ErrorResponse {
    status?: number;
    name?: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ApiMeta {
    current_page?: number;
    page_size?: number;
    total_items?: number;
    total_pages?: number;
    i18n?: {
        current: string;
        default: string;
        available: string[];
        fallback: boolean;
        fallback_to?: string;
    };
}

const DEFAULT_BASE_URL = "https://csec.jxufe.edu.cn/nozomi";

interface CmsEnvelope<T> {
    code: number;
    message: string;
    data: T;
    meta?: ApiMeta;
}

export interface ApiError {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
}

export interface CmsResult<T> {
    data: T;
    meta?: ApiMeta;
}

const isCmsEnvelope = <T>(value: unknown): value is CmsEnvelope<T> => {
    if (!value || typeof value !== "object") return false;
    const record = value as Record<string, unknown>;
    return typeof record.code === "number" && "data" in record;
};

export const normalizeApiError = (err: unknown): ApiError => {
    const fallback: ApiError = {
        status: 500,
        name: "UnknownError",
        message: "Unknown error occurred",
        details: {},
    };

    if (typeof err !== "object" || err === null) return fallback;

    // ofetch / $fetch errors
    const fetchErr = err as {
        statusCode?: number;
        statusMessage?: string;
        data?: ErrorResponse | CmsEnvelope<unknown>;
        message?: string;
        name?: string;
        status?: number;
        details?: Record<string, unknown>;
    };

    if (fetchErr.data && typeof fetchErr.data === "object") {
        const data = fetchErr.data as ErrorResponse & Partial<CmsEnvelope<unknown>>;
        return {
            status: fetchErr.statusCode ?? data.status ?? 500,
            name: data.name || "ApiError",
            message:
                data.message ||
                fetchErr.statusMessage ||
                fetchErr.message ||
                "Unknown error occurred",
            details: data.details ?? {},
        };
    }

    return {
        status: fetchErr.statusCode ?? fetchErr.status ?? 500,
        name: fetchErr.name ?? "UnknownError",
        message:
            fetchErr.statusMessage ||
            fetchErr.message ||
            "Unknown error occurred",
        details: fetchErr.details ?? {},
    };
};

const getApiBaseUrl = (): string => {
    const config = useRuntimeConfig();
    return (config.public?.apiBase as string) || DEFAULT_BASE_URL;
};

/**
 * SSR/CSR 通用 CMS 请求：基于 $fetch，可在 useAsyncData 中使用。
 */
export async function fetchCmsData<T>(
    endpoint: string,
    options: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        body?: unknown;
        signal?: AbortSignal;
    } = {},
): Promise<CmsResult<T>> {
    const baseURL = getApiBaseUrl();
    const method = options.method ?? "GET";
    const payload = await $fetch<unknown>(`${baseURL}${endpoint}`, {
        method,
        signal: options.signal,
        body:
            options.body !== undefined
                ? { data: options.body }
                : undefined,
        headers: {
            Accept: "application/json",
            ...(method !== "GET"
                ? { "Content-Type": "application/json" }
                : {}),
        },
    });

    if (isCmsEnvelope<T>(payload)) {
        if (payload.code !== 200) {
            throw {
                status: 200,
                name: "ApiError",
                message:
                    payload.message ||
                    `API request failed with status ${payload.code}`,
                details: {},
            } satisfies ApiError;
        }
        return { data: payload.data, meta: payload.meta };
    }

    return { data: payload as T };
}

/**
 * 客户端可变状态 API（分页、交互刷新等）。
 * 首屏数据请优先用 fetchCmsData + useAsyncData。
 */
export function useApi<T>() {
    const response: Ref<ApiResponse<T>> = ref({
        data: null,
        error: null,
        loading: false,
        meta: undefined,
    });

    let activeController: AbortController | null = null;
    let requestId = 0;

    const fetchData = async (endpoint: string, options: RequestInit = {}) => {
        requestId += 1;
        const currentId = requestId;
        if (activeController) {
            activeController.abort();
        }
        activeController = new AbortController();

        response.value.loading = true;
        response.value.error = null;
        response.value.meta = undefined;
        response.value.data = null;
        try {
            const method = (options.method || "GET").toUpperCase() as
                | "GET"
                | "POST"
                | "PUT"
                | "DELETE";
            let body: unknown;
            if (options.body) {
                body =
                    typeof options.body === "string"
                        ? JSON.parse(options.body)
                        : options.body;
                // useApi post/put wraps as { data } already in JSON string
                if (
                    body &&
                    typeof body === "object" &&
                    "data" in (body as object)
                ) {
                    body = (body as { data: unknown }).data;
                }
            }

            const result = await fetchCmsData<T>(endpoint, {
                method,
                body: method === "GET" || method === "DELETE" ? undefined : body,
                signal: activeController.signal,
            });

            if (currentId !== requestId) return;
            response.value.data = result.data;
            response.value.meta = result.meta;
        } catch (err) {
            const name = (err as { name?: string })?.name;
            const causeName = (err as { cause?: { name?: string } })?.cause
                ?.name;
            if (
                name === "AbortError" ||
                causeName === "AbortError" ||
                (err as { message?: string })?.message?.includes("aborted")
            ) {
                return;
            }
            if (currentId !== requestId) return;
            response.value.error = normalizeApiError(err);
        } finally {
            if (currentId === requestId) {
                response.value.loading = false;
            }
        }
    };

    const get = (endpoint: string) => fetchData(endpoint, { method: "GET" });

    const post = (endpoint: string, body: unknown) =>
        fetchData(endpoint, {
            method: "POST",
            body: JSON.stringify({ data: body }),
        });

    const put = (endpoint: string, body: unknown) =>
        fetchData(endpoint, {
            method: "PUT",
            body: JSON.stringify({ data: body }),
        });

    const del = (endpoint: string) => fetchData(endpoint, { method: "DELETE" });

    return {
        data: computed(() => response.value.data),
        error: computed(() => response.value.error),
        loading: computed(() => response.value.loading),
        meta: computed(() => response.value.meta),
        get,
        post,
        put,
        del,
    };
}
