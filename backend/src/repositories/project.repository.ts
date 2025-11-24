import { query } from "../database/connection";
import { ProjectWithOwner, PaginationParams } from "../types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class ProjectRepository {
  async findById(id: number): Promise<ProjectWithOwner | null> {
    const projects = await query<(ProjectWithOwner & RowDataPacket)[]>(
      `SELECT p.*, u.name as owner_name, u.email as owner_email
       FROM projects p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    return projects.length > 0 ? projects[0] : null;
  }

  async findByUserId(
    userId: number,
    pagination: PaginationParams
  ): Promise<{ projects: ProjectWithOwner[]; total: number }> {
    // Ensure all parameters are numbers to avoid MySQL parameter type errors
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const offset = (page - 1) * limit;

    const projects = await query<(ProjectWithOwner & RowDataPacket)[]>(
      `SELECT DISTINCT p.*, u.name as owner_name, u.email as owner_email
       FROM projects p
       JOIN users u ON p.owner_id = u.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?
       ORDER BY p.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      [userId, userId]
    );

    const [countResult] = await query<({ total: number } & RowDataPacket)[]>(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM projects p
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?`,
      [userId, userId]
    );

    return {
      projects,
      total: countResult.total,
    };
  }

  async create(
    name: string,
    description: string | undefined,
    ownerId: number
  ): Promise<number> {
    const result = await query<ResultSetHeader>(
      "INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)",
      [name, description || null, ownerId]
    );
    return result.insertId;
  }

  async update(
    id: number,
    name: string | undefined,
    description: string | undefined
  ): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }

    if (updates.length === 0) return true;

    values.push(id);
    const result = await query<ResultSetHeader>(
      `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query<ResultSetHeader>(
      "DELETE FROM projects WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  async addCollaborator(projectId: number, userId: number): Promise<number> {
    try {
      const result = await query<ResultSetHeader>(
        "INSERT INTO project_collaborators (project_id, user_id) VALUES (?, ?)",
        [projectId, userId]
      );
      return result.insertId;
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("User is already a collaborator");
      }
      throw error;
    }
  }

  async removeCollaborator(
    projectId: number,
    userId: number
  ): Promise<boolean> {
    const result = await query<ResultSetHeader>(
      "DELETE FROM project_collaborators WHERE project_id = ? AND user_id = ?",
      [projectId, userId]
    );
    return result.affectedRows > 0;
  }

  async getCollaborators(projectId: number): Promise<any[]> {
    return await query<RowDataPacket[]>(
      `SELECT u.id, u.email, u.name, pc.created_at as added_at
       FROM project_collaborators pc
       JOIN users u ON pc.user_id = u.id
       WHERE pc.project_id = ?
       ORDER BY pc.created_at DESC`,
      [projectId]
    );
  }

  async isOwner(projectId: number, userId: number): Promise<boolean> {
    const projects = await query<RowDataPacket[]>(
      "SELECT id FROM projects WHERE id = ? AND owner_id = ?",
      [projectId, userId]
    );
    return projects.length > 0;
  }

  async isCollaborator(projectId: number, userId: number): Promise<boolean> {
    const collaborators = await query<RowDataPacket[]>(
      "SELECT id FROM project_collaborators WHERE project_id = ? AND user_id = ?",
      [projectId, userId]
    );
    return collaborators.length > 0;
  }

  async hasAccess(projectId: number, userId: number): Promise<boolean> {
    const isOwner = await this.isOwner(projectId, userId);
    if (isOwner) return true;
    return await this.isCollaborator(projectId, userId);
  }
}
