import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import type { Request, Response, NextFunction } from "express";
import type { UserPayload } from "../types/jwt";

export async function authasync(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized -- missing header" });

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY!) as UserPayload;
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    });
    if (!user) return res.status(401).json({ error: "User not found" });

    
    req.user = user;

    next()
  } catch (error) {
    
  }
}