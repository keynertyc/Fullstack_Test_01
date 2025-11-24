import { Request, Response, NextFunction } from "express";
import { query } from "../database/connection";
import { AuthRequest } from "../middlewares/auth";
import { UserStatistics } from "../types";
import { RowDataPacket } from "mysql2";

export const getStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user!.id;

    // Get total projects (owned + collaborating)
    const [projectStats] = await query<RowDataPacket[]>(
      `SELECT 
        COUNT(DISTINCT CASE WHEN p.owner_id = ? THEN p.id END) as owned_projects,
        COUNT(DISTINCT CASE WHEN pc.user_id = ? THEN pc.project_id END) as collaborating_projects,
        COUNT(DISTINCT p.id) as total_projects
       FROM projects p
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?`,
      [userId, userId, userId, userId]
    );

    // Get task statistics
    const [taskStats] = await query<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN t.assigned_to = ? THEN 1 END) as tasks_assigned_to_me,
        COUNT(CASE WHEN t.created_by = ? THEN 1 END) as tasks_created_by_me
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?`,
      [userId, userId, userId, userId]
    );

    const statistics: UserStatistics = {
      total_projects: projectStats.total_projects || 0,
      owned_projects: projectStats.owned_projects || 0,
      collaborating_projects: projectStats.collaborating_projects || 0,
      total_tasks: taskStats.total_tasks || 0,
      tasks_by_status: {
        pending: taskStats.pending || 0,
        in_progress: taskStats.in_progress || 0,
        completed: taskStats.completed || 0,
      },
      tasks_assigned_to_me: taskStats.tasks_assigned_to_me || 0,
      tasks_created_by_me: taskStats.tasks_created_by_me || 0,
    };

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    return next(error);
  }
};
