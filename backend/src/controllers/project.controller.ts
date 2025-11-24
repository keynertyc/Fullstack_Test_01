import { Request, Response, NextFunction } from "express";
import { ProjectRepository } from "../repositories/project.repository";
import { UserRepository } from "../repositories/user.repository";
import { AuthRequest } from "../middlewares/auth";
import {
  CreateProjectInput,
  UpdateProjectInput,
  AddCollaboratorInput,
  PaginationInput,
} from "../validators/schemas";

const projectRepository = new ProjectRepository();
const userRepository = new UserRepository();

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { page, limit } = req.query as unknown as PaginationInput;

    // Ensure page and limit are numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const { projects, total } = await projectRepository.findByUserId(userId, {
      page: pageNum,
      limit: limitNum,
    });

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: projects,
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

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const projectId = parseInt(req.params.id);

    const project = await projectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check access
    const hasAccess = await projectRepository.hasAccess(projectId, userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProject = async (
  req: Request<{}, {}, CreateProjectInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { name, description } = req.body;

    const projectId = await projectRepository.create(name, description, userId);
    const project = await projectRepository.findById(projectId);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProject = async (
  req: Request<{ id: string }, {}, UpdateProjectInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const projectId = parseInt(req.params.id);
    const { name, description } = req.body;

    // Check if project exists
    const project = await projectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only owner can update
    const isOwner = await projectRepository.isOwner(projectId, userId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can update the project",
      });
    }

    await projectRepository.update(projectId, name, description);
    const updatedProject = await projectRepository.findById(projectId);

    res.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const projectId = parseInt(req.params.id);

    // Check if project exists
    const project = await projectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only owner can delete
    const isOwner = await projectRepository.isOwner(projectId, userId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can delete the project",
      });
    }

    await projectRepository.delete(projectId);

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const addCollaborator = async (
  req: Request<{ id: string }, {}, AddCollaboratorInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const projectId = parseInt(req.params.id);
    const { user_id } = req.body;

    // Check if project exists
    const project = await projectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only owner can add collaborators
    const isOwner = await projectRepository.isOwner(projectId, userId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can add collaborators",
      });
    }

    // Check if user exists
    const userToAdd = await userRepository.findById(user_id);
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Can't add owner as collaborator
    if (user_id === project.owner_id) {
      return res.status(400).json({
        success: false,
        message: "Project owner is already a member",
      });
    }

    try {
      await projectRepository.addCollaborator(projectId, user_id);
    } catch (error: any) {
      if (error.message === "User is already a collaborator") {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Collaborator added successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const removeCollaborator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const projectId = parseInt(req.params.id);
    const collaboratorId = parseInt(req.params.userId);

    // Check if project exists
    const project = await projectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only owner can remove collaborators
    const isOwner = await projectRepository.isOwner(projectId, userId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can remove collaborators",
      });
    }

    const removed = await projectRepository.removeCollaborator(
      projectId,
      collaboratorId
    );
    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Collaborator not found",
      });
    }

    res.json({
      success: true,
      message: "Collaborator removed successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const getCollaborators = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const projectId = parseInt(req.params.id);

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

    const collaborators = await projectRepository.getCollaborators(projectId);

    res.json({
      success: true,
      data: collaborators,
    });
  } catch (error) {
    return next(error);
  }
};
