import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Management API",
      version: "1.0.0",
      description:
        "A collaborative project and task management API built with Express and TypeScript",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in format: Bearer <token>",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Projects",
        description: "Project management endpoints",
      },
      {
        name: "Tasks",
        description: "Task management endpoints",
      },
      {
        name: "Statistics",
        description: "Dashboard statistics endpoints",
      },
    ],
  },
  // Read from compiled JS files (comments are preserved during compilation)
  apis: [path.join(__dirname, "../routes/*.js")],
};

export const swaggerSpec = swaggerJsdoc(options);
