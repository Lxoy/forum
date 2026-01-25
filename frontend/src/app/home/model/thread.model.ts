export interface Thread {
  id: number;
  title: string;
  userId: number;
  username: string;
  categoryId: number;
  category: string;
  createdAt: Date;
  postsCount: number;
}