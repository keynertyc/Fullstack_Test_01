import { Request, Response, NextFunction } from "express";
import { TaskRepository } from "../repositories/task.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { AuthRequest } from "../middlewares/auth";
import {
  CreateTaskInput,
  UpdateTaskInput,
  PaginationInput,
  TaskFilterInput,
} from "../validators/schemas";

const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const pagination = req.query as unknown as PaginationInput;
    const filters = req.query as unknown as TaskFilterInput;

    // Ensure page and limit are numbers
    const pageNum = Number(pagination.page) || 1;
    const limitNum = Number(pagination.limit) || 10;

    const { tasks, total } = await taskRepository.findByUserId(
      userId,
      filters,
      { page: pageNum, limit: limitNum }
    );

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const taskId = parseInt(req.params.id);

    const task = await taskRepository.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user has access to the project
    const hasAccess = await projectRepository.hasAccess(
      task.project_id,
      userId
    );
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

export const createTask = async (
  req: Request<{}, {}, CreateTaskInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { title, description, status, priority, project_id, assigned_to } =
      req.body;

    // Check if project exists and user has access
    const project = await projectRepository.findById(project_id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const hasAccess = await projectRepository.hasAccess(project_id, userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project",
      });
    }

    // If assigned_to is provided, check if that user has access to the project
    if (assigned_to) {
      const assigneeHasAccess = await projectRepository.hasAccess(
        project_id,
        assigned_to
      );
      if (!assigneeHasAccess) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign task to user who is not a project member",
        });
      }
    }

    const taskId = await taskRepository.create(
      title,
      description,
      status,
      priority,
      project_id,
      assigned_to,
      userId
    );

    const task = await taskRepository.findById(taskId);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (
  req: Request<{ id: string }, {}, UpdateTaskInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const taskId = parseInt(req.params.id);
    const updates = req.body;

    // Check if task exists
    const task = await taskRepository.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user has access to the project
    const hasAccess = await projectRepository.hasAccess(
      task.project_id,
      userId
    );
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // If assigned_to is being updated, check if that user has access
    if (updates.assigned_to !== undefined && updates.assigned_to !== null) {
      const assigneeHasAccess = await projectRepository.hasAccess(
        task.project_id,
        updates.assigned_to
      );
      if (!assigneeHasAccess) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign task to user who is not a project member",
        });
      }
    }

    await taskRepository.update(taskId, updates);
    const updatedTask = await taskRepository.findById(taskId);

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const taskId = parseInt(req.params.id);

    // Check if task exists
    const task = await taskRepository.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user has access to the project
    const hasAccess = await projectRepository.hasAccess(
      task.project_id,
      userId
    );
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await taskRepository.delete(taskId);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const getTasksByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const projectId = parseInt(req.params.projectId);

    // Check if project exists and user has access
    const project = await projectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const hasAccess = await projectRepository.hasAccess(projectId, userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const tasks = await taskRepository.getTasksByProjectId(projectId);

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return next(error);
  }
};
