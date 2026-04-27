import { describe, expect, it } from 'vitest'
import { createSocialRepository } from '../src/repositories/socialRepository'
import { SocialService } from '../src/services/socialService'
import { viewerId } from '../src/seed'

describe('SocialService', () => {
  it('builds an enriched home feed for the viewer', () => {
    const service = new SocialService(createSocialRepository())

    const feed = service.getHomeFeed(viewerId)

    expect(feed.viewer.handle).toBe('mayapaws')
    expect(feed.posts[0]?.author.name).toBeTruthy()
    expect(feed.dogs).toHaveLength(1)
    expect(feed.notifications.some((notification) => !notification.read)).toBe(true)
  })

  it('rejects posts over the moderation threshold', () => {
    const service = new SocialService(createSocialRepository())

    expect(() =>
      service.createPost({
        authorId: viewerId,
        dogId: 'dog-bean',
        body: 'This scam should be blocked.'
      })
    ).toThrow(/rewrite/)
  })

  it('prevents posting as a dog owned by someone else', () => {
    const service = new SocialService(createSocialRepository())

    expect(() =>
      service.createPost({
        authorId: viewerId,
        dogId: 'dog-river',
        body: 'Trying to borrow another dog identity.'
      })
    ).toThrow(/own dogs/)
  })

  it('creates posts and puts them at the top of the feed', () => {
    const service = new SocialService(createSocialRepository())

    const post = service.createPost({
      authorId: viewerId,
      dogId: 'dog-bean',
      body: 'Fresh Bean dispatch from the park.'
    })

    expect(post.body).toContain('Fresh Bean')
    expect(service.getHomeFeed(viewerId).posts[0]?.id).toBe(post.id)
  })
})
