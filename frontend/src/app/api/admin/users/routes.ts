// frontend/src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/server/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const adminEmail = "admin@example.com";
  if (!session || session.user.email !== adminEmail) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const users = await db.user.findMany({
      select: { id: true, username: true, name: true, email: true, image: true },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch users", error }, { status: 500 });
  }
}
