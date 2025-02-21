import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "@/server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.query.id as string;

  if (req.method === "GET") {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, name: true, email: true, image: true },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user", error });
    }
  }

  if (req.method === "PUT") {
    const { name, email, username, image } = req.body;

    try {
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { name, email, username, image },
      });
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Username or email already exists." });
      }
      return res.status(500).json({ message: "Failed to update user", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
