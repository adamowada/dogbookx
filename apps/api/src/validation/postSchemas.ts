import { z } from 'zod'

export const createPostSchema = z.object({
  authorId: z.string().min(1),
  dogId: z.string().min(1).optional(),
  body: z.string().trim().min(1, 'Post body is required').max(280, 'Posts must stay under 280 characters'),
  mediaUrl: z.url().optional().or(z.literal('')).transform((value) => (value ? value : undefined))
})

export type CreatePostRequest = z.infer<typeof createPostSchema>
