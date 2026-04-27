import { z } from 'zod'

export const dogProfileSchema = z.object({
  name: z.string().trim().min(1).max(40),
  breed: z.string().trim().min(1).max(60),
  age: z.coerce.number().int().min(0).max(30),
  pronouns: z.string().trim().min(1).max(24),
  bio: z.string().trim().min(1).max(180),
  avatarUrl: z.url().optional().or(z.literal('')).transform((value) => value || undefined),
  favoritePark: z.string().trim().min(1).max(80)
})

export const updateDogProfileSchema = dogProfileSchema.partial()
