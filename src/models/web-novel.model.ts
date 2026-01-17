
export interface WebNovelChapter {
  id: string;
  title: string;
  content: string; // HTML or Markdown text
  publishedAt: number;
}

export interface WebNovel {
  id: string;
  creatorId: string;
  author: string;
  title: string;
  description: string;
  coverUrl: string;
  tags: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  
  chapters: WebNovelChapter[];
  
  // Stats
  readCount: number;
  likes: number;
  createdAt: number;
  updatedAt: number;
}
