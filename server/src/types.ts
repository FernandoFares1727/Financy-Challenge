import { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  userId: string;
  email: string;
}

export interface Context {
  userId?: string;
  email?: string;
}

export type TransactionType = "income" | "expense";
