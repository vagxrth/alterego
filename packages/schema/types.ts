import { z } from 'zod'

export const TrainModel = z.object({
    name: z.string(),
    type: z.enum(["Man", "Woman", "Other"]),
    age: z.number(),
    ethinicity: z.enum(["White", "Black", "American", "Indian", "EastAsian"]),
    eyeColor: z.enum(["Brown", "Black", "Hazel", "Blue", "Green", "Gray"]),
    bald: z.boolean(),
    zipURL: z.string()
})

export const GenerateImage = z.object({
    prompt: z.string(),
    modelId: z.string(),
    quantity: z.number()
})

export const GenerateImageFromPack = z.object({
    modelId: z.string(),
    packId: z.string()
})