import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }   
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.CLERK_JWT_KEY!, {
            algorithms: ['RS256']
        });
        if (decoded?.sub) {
            req.userId = decoded.sub as string;
            next();
        } else {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
}