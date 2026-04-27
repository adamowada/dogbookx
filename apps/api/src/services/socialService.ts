import type { CreateDogInput, CreatePostInput, CreateReplyInput, EnrichedPost, EnrichedReply, FeedResponse, Reply, UpdateDogInput } from '@dogbookx/types'
import type { SocialRepository } from '../repositories/socialRepository.js'

const blockedTerms = ['scam', 'abuse', 'hate']

export class SocialService {
  constructor(private readonly repository: SocialRepository) {}

  getHomeFeed(viewerId: string): FeedResponse {
    const viewer = this.requireUser(viewerId)
    const dogs = this.repository.listDogs()
    const posts = this.repository.listPosts().map((post) => this.enrichPost(post))
    const suggestions = this.repository
      .listUsers()
      .filter((user) => user.id !== viewer.id && !viewer.followingIds.includes(user.id))

    return {
      viewer,
      dogs: dogs.filter((dog) => dog.ownerId === viewer.id),
      posts,
      suggestions,
      groups: this.repository.listGroups(),
      notifications: this.repository.listNotificationsForUser(viewer.id)
    }
  }

  createPost(input: CreatePostInput): EnrichedPost {
    this.requireUser(input.authorId)

    if (input.dogId) {
      const dog = this.repository.findDog(input.dogId)
      if (!dog || dog.ownerId !== input.authorId) {
        throw new ServiceError(403, 'You can only post as one of your own dogs.')
      }
    }

    if (blockedTerms.some((term) => input.body.toLowerCase().includes(term))) {
      throw new ServiceError(422, 'This post needs a quick rewrite before it can be shared.')
    }

    return this.enrichPost(this.repository.createPost(input))
  }

  createDog(input: CreateDogInput) {
    this.requireUser(input.ownerId)
    return this.repository.createDog(input)
  }

  updateDog(dogId: string, input: UpdateDogInput) {
    this.requireUser(input.ownerId)
    const dog = this.repository.updateDog(dogId, input)
    if (!dog) throw new ServiceError(404, 'Dog profile not found for this user.')
    return dog
  }

  createReply(input: CreateReplyInput): EnrichedReply {
    this.requireUser(input.authorId)
    if (input.dogId) this.requireOwnedDog(input.authorId, input.dogId)

    if (blockedTerms.some((term) => input.body.toLowerCase().includes(term))) {
      throw new ServiceError(422, 'This reply needs a quick rewrite before it can be shared.')
    }

    const reply = this.repository.createReply(input)
    if (!reply) throw new ServiceError(404, 'Post not found.')
    return this.enrichReply(reply)
  }

  toggleLike(postId: string): EnrichedPost {
    const post = this.repository.toggleLike(postId)
    if (!post) throw new ServiceError(404, 'Post not found.')
    return this.enrichPost(post)
  }

  toggleRepost(postId: string): EnrichedPost {
    const post = this.repository.toggleRepost(postId)
    if (!post) throw new ServiceError(404, 'Post not found.')
    return this.enrichPost(post)
  }

  toggleFollow(viewerId: string, targetId: string) {
    const viewer = this.repository.toggleFollow(viewerId, targetId)
    if (!viewer) throw new ServiceError(400, 'Unable to update that follow relationship.')
    return viewer
  }

  private enrichPost(post: CreatePostInput & { id: string; createdAt: string; likeCount: number; replyCount: number; repostCount: number; likedByViewer: boolean; repostedByViewer: boolean }): EnrichedPost {
    const author = this.requireUser(post.authorId)
    const dog = post.dogId ? this.repository.findDog(post.dogId) : undefined

    return {
      ...post,
      author,
      dog,
      recentReplies: this.repository
        .listRepliesForPost(post.id)
        .slice(-2)
        .map((reply) => this.enrichReply(reply))
    }
  }

  private enrichReply(reply: Reply): EnrichedReply {
    const author = this.requireUser(reply.authorId)
    const dog = reply.dogId ? this.repository.findDog(reply.dogId) : undefined

    return { ...reply, author, dog }
  }

  private requireOwnedDog(ownerId: string, dogId: string) {
    const dog = this.repository.findDog(dogId)
    if (!dog || dog.ownerId !== ownerId) {
      throw new ServiceError(403, 'You can only use one of your own dog profiles.')
    }
    return dog
  }

  private requireUser(userId: string) {
    const user = this.repository.findUser(userId)
    if (!user) throw new ServiceError(404, 'User not found.')
    return user
  }
}

export class ServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
  }
}
