import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Change this to your desired admin password
  const adminPassword = "adminpassword"; 
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create the admin user
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@scrapesmith.com",
      hashedPassword: hashedPassword,
      name: "Admin User",
      isAdmin: true, // Mark this user as an admin
    },
  });

  console.log("Admin user created:", adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
