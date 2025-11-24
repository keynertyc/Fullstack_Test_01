import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Project,
  Task,
  Statistics,
  PaginatedResponse,
  CreateProjectData,
  UpdateProjectData,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  Collaborator,
  ApiResponse,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          // Clear auth data and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post(
      "/auth/register",
      data
    );
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post(
      "/auth/login",
      credentials
    );
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get(
      "/auth/profile"
    );
    return response.data;
  }

  // Project endpoints
  async getProjects(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Project>> {
    const response: AxiosResponse<PaginatedResponse<Project>> =
      await this.client.get("/projects", {
        params: { page, limit },
      });
    return response.data;
  }

  async getProject(id: number): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> = await this.client.get(
      `/projects/${id}`
    );
    return response.data;
  }

  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> =
      await this.client.post("/projects", data);
    return response.data;
  }

  async updateProject(
    id: number,
    data: UpdateProjectData
  ): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> = await this.client.put(
      `/projects/${id}`,
      data
    );
    return response.data;
  }

  async deleteProject(id: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.client.delete(
      `/projects/${id}`
    );
    return response.data;
  }

  async getCollaborators(
    projectId: number
  ): Promise<ApiResponse<Collaborator[]>> {
    const response: AxiosResponse<ApiResponse<Collaborator[]>> =
      await this.client.get(`/projects/${projectId}/collaborators`);
    return response.data;
  }

  async addCollaborator(
    projectId: number,
    userId: number
  ): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.client.post(
      `/projects/${projectId}/collaborators`,
      { user_id: userId }
    );
    return response.data;
  }

  async removeCollaborator(
    projectId: number,
    userId: number
  ): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.client.delete(
      `/projects/${projectId}/collaborators/${userId}`
    );
    return response.data;
  }

  // Task endpoints
  async getTasks(
    page: number = 1,
    limit: number = 10,
    filters?: TaskFilters
  ): Promise<PaginatedResponse<Task>> {
    const response: AxiosResponse<PaginatedResponse<Task>> =
      await this.client.get("/tasks", {
        params: { page, limit, ...filters },
      });
    return response.data;
  }

  async getTask(id: number): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.client.get(
      `/tasks/${id}`
    );
    return response.data;
  }

  async getTasksByProject(projectId: number): Promise<ApiResponse<Task[]>> {
    const response: AxiosResponse<ApiResponse<Task[]>> = await this.client.get(
      `/tasks/project/${projectId}`
    );
    return response.data;
  }

  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.client.post(
      "/tasks",
      data
    );
    return response.data;
  }

  async updateTask(
    id: number,
    data: UpdateTaskData
  ): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.client.put(
      `/tasks/${id}`,
      data
    );
    return response.data;
  }

  async deleteTask(id: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.client.delete(
      `/tasks/${id}`
    );
    return response.data;
  }

  // Statistics endpoint
  async getStatistics(): Promise<ApiResponse<Statistics>> {
    const response: AxiosResponse<ApiResponse<Statistics>> =
      await this.client.get("/statistics");
    return response.data;
  }
}

export const api = new ApiClient();
