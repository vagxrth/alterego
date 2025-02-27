import { z } from 'zod'

export const TrainModel = z.object({
    name: z.string(),
    type: z.enum(["Man", "Woman", "Other"]),
    age: z.number(),
    ethinicity: z.enum(["White", "Black", "American", "Indian", "East Asian"]),
    eyeColor: z.enum(["Brown", "Black", "Hazel", "Blue", "Green", "Gray"]),
    bald: z.boolean(),
    images: z.array(z.string())
})

export const GenerateImage = z.object({
    prompot: z.string(),
    modelId: z.string()
})