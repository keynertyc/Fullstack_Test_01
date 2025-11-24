import request from "supertest";
import { createApp } from "../app";
import { Application } from "express";

describe("Project API", () => {
  let app: Application;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    app = createApp();

    // Create and login a user
    const userData = {
      email: `testproject${Date.now()}@example.com`,
      password: "password123",
      name: "Test Project User",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    token = response.body.data.token;
    userId = response.body.data.user.id;
  });

  describe("POST /api/projects", () => {
    it("should create a new project successfully", async () => {
      // Arrange
      const projectData = {
        name: "Test Project",
        description: "This is a test project",
      };

      // Act
      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(projectData.name);
      expect(response.body.data.owner_id).toBe(userId);
    });

    it("should fail without authentication", async () => {
      // Arrange
      const projectData = {
        name: "Test Project",
        description: "This is a test project",
      };

      // Act
      const response = await request(app)
        .post("/api/projects")
        .send(projectData);

      // Assert
      expect(response.status).toBe(401);
    });

    it("should fail with empty name", async () => {
      // Arrange
      const projectData = {
        name: "",
        description: "This is a test project",
      };

      // Act
      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/projects", () => {
    beforeAll(async () => {
      // Create some test projects
      await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Project 1", description: "Description 1" });

      await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Project 2", description: "Description 2" });
    });

    it("should get all projects for authenticated user", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/projects")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty("pagination");
    });

    it("should support pagination", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/projects?page=1&limit=1")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });
  });

  describe("PUT /api/projects/:id", () => {
    let projectId: number;

    beforeAll(async () => {
      // Create a test project
      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Project to Update",
          description: "Original description",
        });

      projectId = response.body.data.id;
    });

    it("should update project successfully", async () => {
      // Arrange
      const updateData = {
        name: "Updated Project Name",
        description: "Updated description",
      };

      // Act
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
    });

    it("should fail when non-owner tries to update", async () => {
      // Arrange - Create another user
      const otherUserData = {
        email: `other${Date.now()}@example.com`,
        password: "password123",
        name: "Other User",
      };

      const otherUserResponse = await request(app)
        .post("/api/auth/register")
        .send(otherUserData);

      const otherToken = otherUserResponse.body.data.token;

      // Act
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ name: "Hacked Project" });

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/projects/:id", () => {
    let projectId: number;

    beforeAll(async () => {
      // Create a test project
      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Project to Delete", description: "Will be deleted" });

      projectId = response.body.data.id;
    });

    it("should delete project successfully", async () => {
      // Arrange & Act
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify project is deleted
      const getResponse = await request(app)
        .get(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
