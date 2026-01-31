export interface Tag {
  id: string;
  name: string;
}

export interface ContentData {
  title?: string;
  publish_time: string;
  isTop?: boolean;
  body?: string;
  publisher?: string;
  [key: string]: any;
}

export interface Archive {
  id: string;
  title: string;
  slug: string;
  path: string;
  tags: Tag[];
  data: ContentData;
  type: {
    id: string;
    name: string;
    slug: string;
  }
}

export type ArchiveData = Archive;
