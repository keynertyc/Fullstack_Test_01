export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectWithOwner extends Project {
  owner_name: string;
  owner_email: string;
}

export interface ProjectCollaborator {
  id: number;
  project_id: number;
  user_id: number;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  project_id: number;
  assigned_to: number | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface TaskWithDetails extends Task {
  project_name: string;
  assigned_to_name: string | null;
  assigned_to_email: string | null;
  created_by_name: string;
  created_by_email: string;
}

export interface UserStatistics {
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

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
