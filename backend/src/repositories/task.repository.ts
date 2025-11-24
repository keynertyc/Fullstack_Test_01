import { query } from "../database/connection";
import { TaskWithDetails, PaginationParams } from "../types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface TaskFilters {
  status?: string;
  priority?: string;
  project_id?: number;
  assigned_to?: number;
  sort_by?: string;
  order?: string;
}

export class TaskRepository {
  async findById(id: number): Promise<TaskWithDetails | null> {
    const tasks = await query<(TaskWithDetails & RowDataPacket)[]>(
      `SELECT t.*,
              p.name as project_name,
              au.name as assigned_to_name,
              au.email as assigned_to_email,
              cu.name as created_by_name,
              cu.email as created_by_email
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       LEFT JOIN users au ON t.assigned_to = au.id
       JOIN users cu ON t.created_by = cu.id
       WHERE t.id = ?`,
      [id]
    );
    return tasks.length > 0 ? tasks[0] : null;
  }

  async findByUserId(
    userId: number,
    filters: TaskFilters,
    pagination: PaginationParams
  ): Promise<{ tasks: TaskWithDetails[]; total: number }> {
    // Ensure all parameters are numbers to avoid MySQL parameter type errors
    const page = Number(pagination.page);
    const limit = Number(pagination.limit);
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];

    // User must have access to the project
    conditions.push("(p.owner_id = ? OR pc.user_id = ?)");
    values.push(userId, userId);

    if (filters.status) {
      conditions.push("t.status = ?");
      values.push(filters.status);
    }
    if (filters.priority) {
      conditions.push("t.priority = ?");
      values.push(filters.priority);
    }
    if (filters.project_id) {
      conditions.push("t.project_id = ?");
      values.push(filters.project_id);
    }
    if (filters.assigned_to) {
      conditions.push("t.assigned_to = ?");
      values.push(filters.assigned_to);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderBy = filters.sort_by || "created_at";
    const order = filters.order || "desc";

    const tasks = await query<(TaskWithDetails & RowDataPacket)[]>(
      `SELECT DISTINCT t.*,
              p.name as project_name,
              au.name as assigned_to_name,
              au.email as assigned_to_email,
              cu.name as created_by_name,
              cu.email as created_by_email
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       LEFT JOIN users au ON t.assigned_to = au.id
       JOIN users cu ON t.created_by = cu.id
       ${whereClause}
       ORDER BY t.${orderBy} ${order.toUpperCase()}
       LIMIT ${limit} OFFSET ${offset}`,
      values
    );

    const [countResult] = await query<({ total: number } & RowDataPacket)[]>(
      `SELECT COUNT(DISTINCT t.id) as total
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       ${whereClause}`,
      values
    );

    return {
      tasks,
      total: countResult.total,
    };
  }

  async create(
    title: string,
    description: string | undefined,
    status: string | undefined,
    priority: string | undefined,
    projectId: number,
    assignedTo: number | undefined,
    createdBy: number
  ): Promise<number> {
    const result = await query<ResultSetHeader>(
      `INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        status || "pending",
        priority || "medium",
        projectId,
        assignedTo || null,
        createdBy,
      ]
    );
    return result.insertId;
  }

  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      assigned_to?: number | null;
    }
  ): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updates.push("status = ?");
      values.push(data.status);
    }
    if (data.priority !== undefined) {
      updates.push("priority = ?");
      values.push(data.priority);
    }
    if (data.assigned_to !== undefined) {
      updates.push("assigned_to = ?");
      values.push(data.assigned_to);
    }

    if (updates.length === 0) return true;

    values.push(id);
    const result = await query<ResultSetHeader>(
      `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query<ResultSetHeader>(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  async getTasksByProjectId(projectId: number): Promise<TaskWithDetails[]> {
    return await query<(TaskWithDetails & RowDataPacket)[]>(
      `SELECT t.*,
              p.name as project_name,
              au.name as assigned_to_name,
              au.email as assigned_to_email,
              cu.name as created_by_name,
              cu.email as created_by_email
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       LEFT JOIN users au ON t.assigned_to = au.id
       JOIN users cu ON t.created_by = cu.id
       WHERE t.project_id = ?
       ORDER BY t.created_at DESC`,
      [projectId]
    );
  }
}
