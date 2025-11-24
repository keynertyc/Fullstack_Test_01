import request from "supertest";
import { createApp } from "../app";
import { Application } from "express";

describe("Auth API", () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: "password123",
        name: "Test User",
      };

      // Act
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it("should fail with invalid email", async () => {
      // Arrange
      const userData = {
        email: "invalid-email",
        password: "password123",
        name: "Test User",
      };

      // Act
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with short password", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "123",
        name: "Test User",
      };

      // Act
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    let testUser: any;

    beforeAll(async () => {
      // Create a test user
      const userData = {
        email: `testlogin${Date.now()}@example.com`,
        password: "password123",
        name: "Test Login User",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);

      testUser = { ...userData, ...response.body.data };
    });

    it("should login successfully with correct credentials", async () => {
      // Arrange & Act
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it("should fail with incorrect password", async () => {
      // Arrange & Act
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail with non-existent email", async () => {
      // Arrange & Act
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/profile", () => {
    let token: string;

    beforeAll(async () => {
      // Create and login a user
      const userData = {
        email: `testprofile${Date.now()}@example.com`,
        password: "password123",
        name: "Test Profile User",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);

      token = response.body.data.token;
    });

    it("should get user profile with valid token", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("email");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should fail without token", async () => {
      // Arrange & Act
      const response = await request(app).get("/api/auth/profile");

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid token", async () => {
      // Arrange & Act
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid-token");

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
