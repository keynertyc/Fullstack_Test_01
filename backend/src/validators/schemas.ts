import { z } from "zod";

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(255),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(255).optional(),
  description: z.string().optional(),
});

export const addCollaboratorSchema = z.object({
  user_id: z.number().int().positive("User ID must be a positive integer"),
});

// Task schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(255),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  project_id: z
    .number()
    .int()
    .positive("Project ID must be a positive integer"),
  assigned_to: z.number().int().positive().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assigned_to: z.number().int().positive().optional().nullable(),
});

// Query schemas
export const paginationSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
});

export const taskFilterSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  project_id: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  assigned_to: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  sort_by: z
    .enum(["created_at", "updated_at", "priority", "status"])
    .optional()
    .default("created_at"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddCollaboratorInput = z.infer<typeof addCollaboratorSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
