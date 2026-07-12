// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  tags?: string[];
  position?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  tags?: string[];
  position?: number;
}

// Annotation Types
export interface AnnotationImage {
  id: number;
  image: string;
  image_url: string;
  uploaded_at?: string;
  created_by?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface PolygonAnnotation {
  id: number;
  image: number;
  points: Point[];
  label?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
}

export interface PolygonAnnotationCreateRequest {
  image: number;
  points: Point[];
  label?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
