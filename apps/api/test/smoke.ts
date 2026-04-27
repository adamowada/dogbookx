import { createServer } from 'node:http'
import { createApp } from '../src/app.js'

const server = createServer(createApp())

await new Promise<void>((resolve) => {
  server.listen(0, resolve)
})

const address = server.address()
if (!address || typeof address === 'string') {
  throw new Error('Unable to bind smoke-test server')
}

const baseUrl = `http://127.0.0.1:${address.port}/api`
const health = await fetch(`${baseUrl}/health`).then((response) => response.json())
const feed = await fetch(`${baseUrl}/feed`).then((response) => response.json())

if (!health.ok || !Array.isArray(feed.posts) || feed.posts.length === 0) {
  throw new Error('DogbookX smoke test failed')
}

server.close()
console.log('Smoke test passed: API health and feed endpoints responded.')
