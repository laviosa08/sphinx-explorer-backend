import { Response } from "express";

export function handleError(res: Response, error: unknown): void {
  console.error(error);
  res.status(500).json({ error: "An error occurred" });
}
