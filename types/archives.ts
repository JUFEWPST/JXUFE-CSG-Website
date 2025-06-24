export interface Archive {
  id: number
  documentId: string
  title: string
  tags: {
    tags: string[]
  } | null
  publishedAt: string
}

export interface ArchiveData extends Archive {
  content: string;
  publishedAt: string;
  publisher: string | null;
}
