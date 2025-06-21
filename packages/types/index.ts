import { z } from "zod";

export const TrainModelSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["Male", "Female"]),
  age: z.number().min(0).max(100),
  ethnicity: z.enum(["White", "Black", "AsianAmerican", "EastAsian", "Indian", "Hispanic", "MiddleEastern", "Other"]),
  eyeColor: z.enum(["Brown", "Blue", "Green", "Hazel", "Gray", "Other"]),
  bald: z.boolean(),
  zipUrl: z.string().url(),
});

export const GenerateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  modelId: z.string(),
  numberOfImages: z.number().min(1),
});

export const GenerateImagesFromPackSchema = z.object({
  packId: z.string(),
  modelId: z.string(),
});