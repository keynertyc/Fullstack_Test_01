import { query } from "./connection";
import { hashPassword } from "../utils/auth";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
}

export async function seedDatabase(): Promise<void> {
  try {
    console.log("Starting database seeding...");

    // Seed users
    const users = [
      {
        email: "user1@example.com",
        password: "123user1",
        name: "Test User 1",
      },
      {
        email: "user2@example.com",
        password: "123user2",
        name: "Test User 2",
      },
    ];

    for (const userData of users) {
      // Check if user already exists
      const existingUsers = await query<UserRow[]>(
        "SELECT id, email FROM users WHERE email = ?",
        [userData.email]
      );

      if (existingUsers.length > 0) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Create user
      const hashedPassword = await hashPassword(userData.password);
      await query(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        [userData.email, hashedPassword, userData.name]
      );

      console.log(`✓ Created user: ${userData.email}`);
    }

    console.log("Database seeding completed successfully!");
    console.log("\nTest credentials:");
    console.log("1. Email: user1@example.com | Password: 123user1");
    console.log("2. Email: user2@example.com | Password: 123user2");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("\nSeed script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed script failed:", error);
      process.exit(1);
    });
}
