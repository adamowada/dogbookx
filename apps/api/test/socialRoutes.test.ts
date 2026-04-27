import { createServer } from 'node:http'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app'

const servers: ReturnType<typeof createServer>[] = []

afterEach(() => {
  for (const server of servers.splice(0)) {
    server.close()
  }
})

async function startTestServer() {
  const server = createServer(createApp({ dataFile: ':memory:' }))
  servers.push(server)
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Unable to bind server')
  return `http://127.0.0.1:${address.port}/api`
}

describe('social routes', () => {
  it('uses the request viewer header for feed identity and follows', async () => {
    const baseUrl = await startTestServer()

    const feed = await fetch(`${baseUrl}/feed`, {
      headers: { 'x-dogbookx-user-id': 'user-lena' }
    }).then((response) => response.json())

    expect(feed.viewer.id).toBe('user-lena')
    expect(feed.dogs.map((dog: { id: string }) => dog.id)).toContain('dog-river')

    const updatedViewer = await fetch(`${baseUrl}/users/user-ivy/follow`, {
      method: 'POST',
      headers: { 'x-dogbookx-user-id': 'user-lena' }
    }).then((response) => response.json())

    expect(updatedViewer.id).toBe('user-lena')
    expect(updatedViewer.followingIds).toContain('user-ivy')
  })
})
