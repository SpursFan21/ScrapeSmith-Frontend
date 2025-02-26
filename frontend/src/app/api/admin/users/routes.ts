// frontend/src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/server/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("Admin GET session:", session); // Debug log

  // Check if the session exists and if the user is an admin
  if (!session || !session.user.isAdmin) {
    console.log("Admin GET unauthorized"); // Debug log
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const users = await db.user.findMany({
      select: { id: true, username: true, name: true, email: true, image: true },
    });
    console.log("Admin GET users:", users); // Debug log
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json({ message: "Failed to fetch users", error }, { status: 500 });
  }
}
