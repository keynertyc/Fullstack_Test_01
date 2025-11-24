import request from "supertest";
import { createApp } from "../app";
import { Application } from "express";

describe("Statistics API", () => {
  let app: Application;
  let token: string;

  beforeAll(async () => {
    app = createApp();

    // Create and login a user
    const userData = {
      email: `teststats${Date.now()}@example.com`,
      password: "password123",
      name: "Test Stats User",
    };

    const authResponse = await request(app)
      .post("/api/auth/register")
      .send(userData);

    token = authResponse.body.data.token;

    // Create test data
    const projectResponse = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Stats Project", description: "For statistics" });

    const projectId = projectResponse.body.data.id;

    // Create some tasks
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Pending Task",
        project_id: projectId,
        status: "pending",
      });

    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Completed Task",
        project_id: projectId,
        status: "completed",
      });
  });

  describe("GET /api/statistics", () => {
    it("should get user statistics successfully", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/statistics")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("total_projects");
      expect(response.body.data).toHaveProperty("owned_projects");
      expect(response.body.data).toHaveProperty("collaborating_projects");
      expect(response.body.data).toHaveProperty("total_tasks");
      expect(response.body.data).toHaveProperty("tasks_by_status");
      expect(response.body.data.tasks_by_status).toHaveProperty("pending");
      expect(response.body.data.tasks_by_status).toHaveProperty("in_progress");
      expect(response.body.data.tasks_by_status).toHaveProperty("completed");
    });

    it("should reflect correct task counts", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/statistics")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.tasks_by_status.pending).toBeGreaterThanOrEqual(
        1
      );
      expect(
        response.body.data.tasks_by_status.completed
      ).toBeGreaterThanOrEqual(1);
    });

    it("should fail without authentication", async () => {
      // Arrange & Act
      const response = await request(app).get("/api/statistics");

      // Assert
      expect(response.status).toBe(401);
    });
  });
});
