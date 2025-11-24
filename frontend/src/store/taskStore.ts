import { create } from "zustand";
import { Task, TaskFilters } from "@/types";
import { api } from "@/lib/api";

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  } | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  fetchTasks: (
    page?: number,
    limit?: number,
    filters?: TaskFilters
  ) => Promise<void>;
  fetchTask: (id: number) => Promise<void>;
  fetchTasksByProject: (projectId: number) => Promise<void>;
  createTask: (data: any) => Promise<Task>;
  updateTask: (id: number, data: any) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  pagination: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchTasks: async (page = 1, limit = 10, filters?: TaskFilters) => {
    set({ isLoading: true, error: null });
    try {
      const filtersToUse = filters || get().filters;
      const response = await api.getTasks(page, limit, filtersToUse);
      set({
        tasks: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  fetchTask: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getTask(id);
      set({
        currentTask: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch task",
        isLoading: false,
      });
    }
  },

  fetchTasksByProject: async (projectId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getTasksByProject(projectId);
      set({
        tasks: response.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  createTask: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createTask(data);
      // Refetch from server to get fresh data with proper pagination
      const state = useTaskStore.getState();
      await state.fetchTasks(1, 10, state.filters);
      return response.data!;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create task",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (id: number, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await api.updateTask(id, data);
      // Refetch current page to get updated data
      const state = useTaskStore.getState();
      const currentPage = state.pagination?.page || 1;
      await state.fetchTasks(currentPage, 10, state.filters);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update task",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTask: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteTask(id);
      // Refetch current page
      const state = useTaskStore.getState();
      const currentPage = state.pagination?.page || 1;
      await state.fetchTasks(currentPage, 10, state.filters);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete task",
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters: TaskFilters) => {
    set({ filters });
    get().fetchTasks();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchTasks();
  },

  clearError: () => set({ error: null }),
}));
