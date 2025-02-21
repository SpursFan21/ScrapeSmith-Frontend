// frontend/src/app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/server/db";

// GET: Fetch user details by id
export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  // Await params in case it is a promise
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, name: true, email: true, image: true },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch user", error }, { status: 500 });
  }
}

// PUT: Update user details by id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  try {
    const body = await request.json();
    const { name, email, username, image } = body;
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { name, email, username, image },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Username or email already exists." }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to update user", error }, { status: 500 });
  }
}
