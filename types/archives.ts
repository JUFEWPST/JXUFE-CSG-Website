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
}

export interface ArchiveData extends Archive {
  content: string;
  publishedAt: string;
  publisher: string | null;
}
