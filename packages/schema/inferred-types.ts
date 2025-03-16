import { GenerateImage, GenerateImageFromPack, TrainModel, PersonType, EthnicityType, EyeColorType } from './types';
import { z } from 'zod'

export type TrainModelInput = z.infer<typeof TrainModel>
export type GenerateImageInput = z.infer<typeof GenerateImage>
export type GenerateImageFromPackInput = z.infer<typeof GenerateImageFromPack>

export type PersonTypeValues = z.infer<typeof PersonType>
export type EthnicityTypeValues = z.infer<typeof EthnicityType>
export type EyeColorTypeValues = z.infer<typeof EyeColorType>