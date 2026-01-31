export interface NoticeData {
    content: string
    is_container: boolean
    route: string
    timeout: number
    title: string
    type: string
}

export interface Notice {
    id: string
    title: string
    slug: string
    path: string
    data?: NoticeData
}