import { connectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

const run = async () => {
  await connectDatabase();

  const existingAdmin = await User.findOne({ email: env.adminEmail });

  if (existingAdmin) {
    console.log(`Admin already exists: ${env.adminEmail}`);
    process.exit(0);
  }

  await User.create({
    name: env.adminName,
    email: env.adminEmail,
    password: env.adminPassword,
    city: "Head Office",
    role: "admin",
  });

  console.log(`Admin created: ${env.adminEmail}`);
  process.exit(0);
};

run().catch((error) => {
  console.error("Failed to seed admin", error);
  process.exit(1);
});
