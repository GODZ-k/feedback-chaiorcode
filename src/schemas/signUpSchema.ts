import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(2, "Username must be atleast 2 character")
  .max(20, "Username must not be more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not be contain special character");

export const signUpSchema = z.object({
  username: usernameSchema,
  email:z.string().email({message:"Invalid email"}),
  password:z.string().min(6,{message:"Invalid password"}),
});
