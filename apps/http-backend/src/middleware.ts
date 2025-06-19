import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
