import { create } from "zustand";
import { Project } from "@/types";
import { api } from "@/lib/api";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  } | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: (page?: number, limit?: number) => Promise<void>;
  fetchProject: (id: number) => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project>;
  updateProject: (
    id: number,
    name?: string,
    description?: string
  ) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchProjects: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getProjects(page, limit);
      set({
        projects: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch projects",
        isLoading: false,
      });
    }
  },

  fetchProject: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getProject(id);
      set({
        currentProject: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch project",
        isLoading: false,
      });
    }
  },

  createProject: async (name: string, description?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createProject({ name, description });
      // Refetch from server to get fresh data with proper pagination
      const state = useProjectStore.getState();
      await state.fetchProjects(1, 10);
      return response.data!;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create project",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProject: async (id: number, name?: string, description?: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.updateProject(id, { name, description });
      // Refetch current page to get updated data
      const state = useProjectStore.getState();
      const currentPage = state.pagination?.page || 1;
      await state.fetchProjects(currentPage, 10);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update project",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteProject(id);
      // Refetch current page
      const state = useProjectStore.getState();
      const currentPage = state.pagination?.page || 1;
      await state.fetchProjects(currentPage, 10);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete project",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
