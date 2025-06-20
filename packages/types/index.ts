import { z } from "zod";

export const TrainModelSchema = z.object({
  name: z.string(),
  type: z.enum(["Male", "Female"]),
  age: z.number().min(0).max(100),
  ethnicity: z.enum(["White", "Black", "AsianAmerican", "EastAsian", "Indian", "Hispanic", "MiddleEastern", "Other"]),
  eyeColor: z.enum(["Brown", "Blue", "Green", "Hazel", "Gray", "Other"]),
  bald: z.boolean(),
  images: z.array(z.string()),
});