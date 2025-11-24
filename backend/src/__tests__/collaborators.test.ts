import request from "supertest";
import { createApp } from "../app";
import { Application } from "express";

describe("Collaborators API", () => {
  let app: Application;
  let ownerToken: string;
  let collaboratorToken: string;
  let projectId: number;
  let collaboratorId: number;

  beforeAll(async () => {
    app = createApp();

    // Create owner user
    const ownerData = {
      email: `owner${Date.now()}@example.com`,
      password: "password123",
      name: "Project Owner",
    };

    const ownerResponse = await request(app)
      .post("/api/auth/register")
      .send(ownerData);

    ownerToken = ownerResponse.body.data.token;

    // Create collaborator user
    const collaboratorData = {
      email: `collaborator${Date.now()}@example.com`,
      password: "password123",
      name: "Collaborator User",
    };

    const collaboratorResponse = await request(app)
      .post("/api/auth/register")
      .send(collaboratorData);

    collaboratorToken = collaboratorResponse.body.data.token;
    collaboratorId = collaboratorResponse.body.data.user.id;

    // Create a test project
    const projectResponse = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "Collaboration Project",
        description: "Project for collaboration tests",
      });

    projectId = projectResponse.body.data.id;
  });

  describe("POST /api/projects/:id/collaborators", () => {
    it("should add collaborator successfully", async () => {
      // Arrange
      const collaboratorData = {
        user_id: collaboratorId,
      };

      // Act
      const response = await request(app)
        .post(`/api/projects/${projectId}/collaborators`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(collaboratorData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain(
        "Collaborator added successfully"
      );
    });

    it("should fail when non-owner tries to add collaborator", async () => {
      // Arrange
      const collaboratorData = {
        user_id: 999,
      };

      // Act
      const response = await request(app)
        .post(`/api/projects/${projectId}/collaborators`)
        .set("Authorization", `Bearer ${collaboratorToken}`)
        .send(collaboratorData);

      // Assert
      expect(response.status).toBe(403);
    });

    it("should fail with non-existent user", async () => {
      // Arrange
      const collaboratorData = {
        user_id: 99999,
      };

      // Act
      const response = await request(app)
        .post(`/api/projects/${projectId}/collaborators`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(collaboratorData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.message).toContain("User not found");
    });
  });

  describe("GET /api/projects/:id/collaborators", () => {
    it("should get all collaborators for a project", async () => {
      // Arrange & Act
      const response = await request(app)
        .get(`/api/projects/${projectId}/collaborators`)
        .set("Authorization", `Bearer ${ownerToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should allow collaborator to view collaborators", async () => {
      // Arrange & Act
      const response = await request(app)
        .get(`/api/projects/${projectId}/collaborators`)
        .set("Authorization", `Bearer ${collaboratorToken}`);

      // Assert
      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /api/projects/:id/collaborators/:userId", () => {
    it("should remove collaborator successfully", async () => {
      // Arrange & Act
      const response = await request(app)
        .delete(`/api/projects/${projectId}/collaborators/${collaboratorId}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain(
        "Collaborator removed successfully"
      );
    });

    it("should fail when non-owner tries to remove collaborator", async () => {
      // Arrange - Re-add collaborator first
      await request(app)
        .post(`/api/projects/${projectId}/collaborators`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ user_id: collaboratorId });

      // Act
      const response = await request(app)
        .delete(`/api/projects/${projectId}/collaborators/${collaboratorId}`)
        .set("Authorization", `Bearer ${collaboratorToken}`);

      // Assert
      expect(response.status).toBe(403);
    });
  });
});
