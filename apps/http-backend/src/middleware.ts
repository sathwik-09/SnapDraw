import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";


export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
      
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    } catch (e) {
        res.status(401).json({ message: "Unauthorized" });
    }
}