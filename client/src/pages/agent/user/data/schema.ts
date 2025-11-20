import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  phoneNumber: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
