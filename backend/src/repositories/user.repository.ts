import { query } from "../database/connection";
import { User, UserResponse } from "../types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const users = await query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return users.length > 0 ? users[0] : null;
  }

  async findById(id: number): Promise<UserResponse | null> {
    const users = await query<(UserResponse & RowDataPacket)[]>(
      "SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );
    return users.length > 0 ? users[0] : null;
  }

  async create(email: string, password: string, name: string): Promise<number> {
    const result = await query<ResultSetHeader>(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, password, name]
    );
    return result.insertId;
  }

  async searchByEmail(
    searchTerm: string,
    limit: number = 10
  ): Promise<UserResponse[]> {
    return await query<(UserResponse & RowDataPacket)[]>(
      `SELECT id, email, name, created_at, updated_at 
       FROM users 
       WHERE email LIKE ? 
       LIMIT ?`,
      [`%${searchTerm}%`, limit]
    );
  }
}
