import { type ErrorRequestHandler, Router } from 'express'
import { ServiceError, type SocialService } from '../services/socialService.js'
import { createPostSchema } from '../validation/postSchemas.js'
import { viewerId } from '../seed.js'

export function createSocialRouter(service: SocialService) {
  const router = Router()

  router.get('/health', (_request, response) => {
    response.json({ ok: true, service: 'dogbookx-api' })
  })

  router.get('/feed', (_request, response) => {
    response.json(service.getHomeFeed(viewerId))
  })

  router.post('/posts', (request, response, next) => {
    const parsed = createPostSchema.safeParse(request.body)
    if (!parsed.success) {
      response.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid post.' })
      return
    }

    try {
      response.status(201).json(service.createPost(parsed.data))
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

  router.post('/users/:targetId/follow', (request, response, next) => {
    try {
      response.json(service.toggleFollow(viewerId, request.params.targetId))
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
