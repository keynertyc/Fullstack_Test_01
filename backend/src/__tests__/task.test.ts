import request from "supertest";
import { createApp } from "../app";
import { Application } from "express";

describe("Task API", () => {
  let app: Application;
  let token: string;
  let projectId: number;

  beforeAll(async () => {
    app = createApp();

    // Create and login a user
    const userData = {
      email: `testtask${Date.now()}@example.com`,
      password: "password123",
      name: "Test Task User",
    };

    const authResponse = await request(app)
      .post("/api/auth/register")
      .send(userData);

    token = authResponse.body.data.token;

    // Create a test project
    const projectResponse = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Task Test Project",
        description: "Project for task tests",
      });

    projectId = projectResponse.body.data.id;
  });

  describe("POST /api/tasks", () => {
    it("should create a new task successfully", async () => {
      // Arrange
      const taskData = {
        title: "Test Task",
        description: "This is a test task",
        status: "pending",
        priority: "high",
        project_id: projectId,
      };

      // Act
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(taskData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.status).toBe(taskData.status);
      expect(response.body.data.priority).toBe(taskData.priority);
    });

    it("should fail without authentication", async () => {
      // Arrange
      const taskData = {
        title: "Test Task",
        project_id: projectId,
      };

      // Act
      const response = await request(app).post("/api/tasks").send(taskData);

      // Assert
      expect(response.status).toBe(401);
    });

    it("should fail with invalid project", async () => {
      // Arrange
      const taskData = {
        title: "Test Task",
        project_id: 99999,
      };

      // Act
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(taskData);

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/tasks", () => {
    beforeAll(async () => {
      // Create some test tasks
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task 1", project_id: projectId, status: "pending" });

      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task 2", project_id: projectId, status: "completed" });
    });

    it("should get all tasks for authenticated user", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty("pagination");
    });

    it("should filter tasks by status", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/tasks?status=completed")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(
        response.body.data.every((task: any) => task.status === "completed")
      ).toBe(true);
    });

    it("should filter tasks by priority", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/tasks?priority=high")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    let taskId: number;

    beforeAll(async () => {
      // Create a test task
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task to Update", project_id: projectId });

      taskId = response.body.data.id;
    });

    it("should update task successfully", async () => {
      // Arrange
      const updateData = {
        title: "Updated Task Title",
        status: "in_progress",
      };

      // Act
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    let taskId: number;

    beforeAll(async () => {
      // Create a test task
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task to Delete", project_id: projectId });

      taskId = response.body.data.id;
    });

    it("should delete task successfully", async () => {
      // Arrange & Act
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify task is deleted
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
