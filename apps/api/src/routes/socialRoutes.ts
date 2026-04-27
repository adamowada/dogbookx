import { type ErrorRequestHandler, Router } from 'express'
import { ServiceError, type SocialService } from '../services/socialService.js'
import { dogProfileSchema, updateDogProfileSchema } from '../validation/dogSchemas.js'
import { createPostSchema } from '../validation/postSchemas.js'
import { createReplySchema } from '../validation/replySchemas.js'
import { viewerId } from '../seed.js'

export function createSocialRouter(service: SocialService) {
  const router = Router()
  const resolveViewerId = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? viewerId

  router.get('/health', (_request, response) => {
    response.json({ ok: true, service: 'dogbookx-api' })
  })

  router.get('/feed', (request, response, next) => {
    try {
      response.json(service.getHomeFeed(resolveViewerId(request.headers['x-dogbookx-user-id'])))
    } catch (error) {
      next(error)
    }
  })

  router.post('/posts', (request, response, next) => {
    const parsed = createPostSchema.safeParse(request.body)
    if (!parsed.success) {
      response.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid post.' })
      return
    }

    try {
      response
        .status(201)
        .json(service.createPost({ ...parsed.data, authorId: resolveViewerId(request.headers['x-dogbookx-user-id']) }))
    } catch (error) {
      next(error)
    }
  })

  router.post('/posts/:postId/like', (request, response, next) => {
    try {
      response.json(service.toggleLike(request.params.postId))
    } catch (error) {
      next(error)
    }
  })

  router.post('/posts/:postId/repost', (request, response, next) => {
    try {
      response.json(service.toggleRepost(request.params.postId))
    } catch (error) {
      next(error)
    }
  })

  router.post('/posts/:postId/replies', (request, response, next) => {
    const parsed = createReplySchema.safeParse(request.body)
    if (!parsed.success) {
      response.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid reply.' })
      return
    }

    try {
      response
        .status(201)
        .json(
          service.createReply({
            ...parsed.data,
            postId: request.params.postId,
            authorId: resolveViewerId(request.headers['x-dogbookx-user-id'])
          })
        )
    } catch (error) {
      next(error)
    }
  })

  router.post('/dogs', (request, response, next) => {
    const parsed = dogProfileSchema.safeParse(request.body)
    if (!parsed.success) {
      response.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid dog profile.' })
      return
    }

    try {
      response
        .status(201)
        .json(service.createDog({ ...parsed.data, ownerId: resolveViewerId(request.headers['x-dogbookx-user-id']) }))
    } catch (error) {
      next(error)
    }
  })

  router.patch('/dogs/:dogId', (request, response, next) => {
    const parsed = updateDogProfileSchema.safeParse(request.body)
    if (!parsed.success) {
      response.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid dog profile.' })
      return
    }

    try {
      response.json(
        service.updateDog(request.params.dogId, {
          ...parsed.data,
          ownerId: resolveViewerId(request.headers['x-dogbookx-user-id'])
        })
      )
    } catch (error) {
      next(error)
    }
  })

  router.post('/users/:targetId/follow', (request, response, next) => {
    try {
      response.json(service.toggleFollow(resolveViewerId(request.headers['x-dogbookx-user-id']), request.params.targetId))
    } catch (error) {
      next(error)
    }
  })

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof ServiceError) {
      response.status(error.status).json({ error: error.message })
      return
    }

    response.status(500).json({ error: 'Something went wrong.' })
  }

  router.use(errorHandler)

  return router
}
