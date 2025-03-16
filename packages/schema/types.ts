import { z } from 'zod'

export const PersonType = z.enum(["Man", "Woman", "Other"])
export const EthnicityType = z.enum(["White", "Black", "American", "Indian", "EastAsian"])
export const EyeColorType = z.enum(["Brown", "Black", "Hazel", "Blue", "Green", "Gray"])

export const TrainModel = z.object({
    name: z.string(),
    type: PersonType,
    age: z.number(),
    ethinicity: EthnicityType,
    eyeColor: EyeColorType,
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