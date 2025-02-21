// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/server/db"; // Updated import path

export async function POST(request: Request) {
  try {
    const { username, name, email, password } = await request.json();

    if (!username || !name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if a user with the same email or username already exists using filter syntax
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: { equals: email } },
          { username: { equals: username } },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record, including the 'name' field
    const user = await db.user.create({
      data: {
        username,
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
