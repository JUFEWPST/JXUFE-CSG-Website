export interface Archive {
  id: number
  documentId: string
  title: string
  tags: {
    tags: string[]
  } | null
  publishedAt: string
  createdAt: string
  updatedAt: string
  isTop:boolean
}

export interface ArchiveData extends Archive {
  content: string;
  publisher: string | null;
}
