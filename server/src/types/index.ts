import { IDesigner } from "../models/Designer.js";

export interface UserInput {
  description: string;
}

export interface MatchResult {
  designer: IDesigner;
  similarity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}