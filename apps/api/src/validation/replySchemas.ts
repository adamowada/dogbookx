import { z } from 'zod'

export const createReplySchema = z.object({
  dogId: z.string().min(1).optional(),
  body: z.string().trim().min(1, 'Reply body is required').max(220, 'Replies must stay under 220 characters')
})
