import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import type { Request, Response, NextFunction } from "express";
import type { UserPayload } from "../types/jwt";
import chalk from "chalk";
import { endProcessID } from "./processID";

export async function authasync(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const reqid = req.reqid;
  console.log(
    chalk.blue(
      `[${new Date().toISOString()}][ReqID=${reqid}] Authing using middleware.`
    )
  );
  const token = req.cookies.auth_token;
  
  if (!token) {
    console.log(
      chalk.red(
        `[${new Date().toISOString()}][ReqID=${reqid}] 401: No auth token provided, returning prematurely by middleware.`
      )
    );
    endProcessID(reqid!);
    return res.status(401).json({ error: "Invalid authorization format" });
  }
  console.log(
    chalk.blue(
      `[${new Date().toISOString()}][ReqID=${reqid}] Token found, verifying...`
    )
  );

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY!) as UserPayload;
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      console.log(
        chalk.red(
          `[${new Date().toISOString()}][ReqID=${reqid}] 401: User not found in DB.`
        )
      );
      endProcessID(reqid!);
      return res.status(401).json({ error: "User not found" });
    }
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] User found, attaching to request object.`
      )
    );
    req.user = user;

    next();
  } catch (error) {
    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] 401: Token was invalid or expired.`));
    endProcessID(reqid!);
    return res.status(401).json({ error: "Invalid or expired token" });
    
  }
}
