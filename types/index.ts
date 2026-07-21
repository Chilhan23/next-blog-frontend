export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  author_name?: string;
  category_id: number | null;
  category_name?: string;
  total_likes: number;
  is_liked?: boolean;
}

export interface Comment {
  id: number;
  blog_id: number;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface LikeResponse {
  message: string;
  is_liked: boolean;
  total_likes: number;
}

export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  blogs?: Blog[];
  blog?: Blog;
  categories?: Category[];
  category?: Category;
  comments?: Comment[];
  comment?: Comment;
  token?: string;
  user?: User;
  data?: T;
}
