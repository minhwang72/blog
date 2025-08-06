export interface Comment {
  id: number;
  content: string;
  name: string;
  postId: number;
  parentId?: number | null;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
}

export interface CommentFormData {
  content: string;
  name: string;
  password: string;
  parentId?: number | null;
}

export interface CommentUpdateData {
  commentId: number;
  content: string;
  password: string;
}

export interface CommentDeleteData {
  commentId: number;
  password: string;
}