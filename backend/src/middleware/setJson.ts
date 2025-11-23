import type { Request, Response, NextFunction } from "express";

export function setJson(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Content-Type", "application/json");
  next();
}