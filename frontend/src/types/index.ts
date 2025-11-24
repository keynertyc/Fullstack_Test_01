export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  owner_name: string;
  owner_email: string;
  created_at: string;
  updated_at: string;
}

export interface Collaborator {
  id: number;
  email: string;
  name: string;
  added_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  project_id: number;
  project_name: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  assigned_to_email: string | null;
  created_by: number;
  created_by_name: string;
  created_by_email: string;
  created_at: string;
  updated_at: string;
}

export interface Statistics {
  total_projects: number;
  owned_projects: number;
  collaborating_projects: number;
  total_tasks: number;
  tasks_by_status: {
    pending: number;
    in_progress: number;
    completed: number;
  };
  tasks_assigned_to_me: number;
  tasks_created_by_me: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  project_id: number;
  assigned_to?: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  assigned_to?: number | null;
}

export interface TaskFilters {
  status?: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  project_id?: number;
  assigned_to?: number;
  sort_by?: "created_at" | "updated_at" | "priority" | "status";
  order?: "asc" | "desc";
}
