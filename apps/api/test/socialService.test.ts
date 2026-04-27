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

  it('creates dog profiles for the viewer', () => {
    const service = new SocialService(createSocialRepository({ dataFile: ':memory:' }))

    const dog = service.createDog({
      ownerId: viewerId,
      name: 'Toast',
      breed: 'Beagle',
      age: 2,
      pronouns: 'he/him',
      bio: 'Snack inspector and window watcher.',
      favoritePark: 'Forest Park'
    })

    expect(dog.id).toMatch(/^dog-/)
    expect(service.getHomeFeed(viewerId).dogs.map((item) => item.name)).toContain('Toast')
  })

  it('updates only dog profiles owned by the viewer', () => {
    const service = new SocialService(createSocialRepository({ dataFile: ':memory:' }))

    const updated = service.updateDog('dog-bean', {
      ownerId: viewerId,
      favoritePark: 'Peninsula Park'
    })

    expect(updated.favoritePark).toBe('Peninsula Park')
    expect(() => service.updateDog('dog-river', { ownerId: viewerId, bio: 'Nope' })).toThrow(/not found/)
  })

  it('creates replies and enriches recent replies on the feed', () => {
    const service = new SocialService(createSocialRepository({ dataFile: ':memory:' }))

    const reply = service.createReply({
      postId: 'post-1',
      authorId: viewerId,
      dogId: 'dog-bean',
      body: 'Bean is cheering for River.'
    })

    const post = service.getHomeFeed(viewerId).posts.find((item) => item.id === 'post-1')

    expect(reply.body).toContain('cheering')
    expect(post?.replyCount).toBe(6)
    expect(post?.recentReplies[0]?.dog?.name).toBe('Bean')
  })
})
