import dotenv from "dotenv";
import { createApp } from "./app";
import pool from "./database/connection";
import { seedDatabase } from "./database/seed";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await pool.query("SELECT 1");
    console.log("✓ Database connection established");

    // Run seeders (always, but checks for duplicates)
    await seedDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
