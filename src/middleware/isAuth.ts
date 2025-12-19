import { Request, Response, NextFunction } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user?._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
