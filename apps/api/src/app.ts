import cors from 'cors'
import express from 'express'
import { createSocialRepository } from './repositories/socialRepository.js'
import { createSocialRouter } from './routes/socialRoutes.js'
import { SocialService } from './services/socialService.js'

export function createApp() {
  const app = express()
  const repository = createSocialRepository()
  const service = new SocialService(repository)

  app.use(cors({ origin: true }))
  app.use(express.json())
  app.use('/api', createSocialRouter(service))

  return app
}
