import { nanoid } from 'nanoid'
import type { CreateDogInput, CreatePostInput, CreateReplyInput, DogProfile, DogbookxData, Post, Reply, UpdateDogInput } from '@dogbookx/types'
import { defaultDataFile, loadDataFile, saveDataFile } from './dataFile.js'

export type SocialRepository = ReturnType<typeof createSocialRepository>
type RepositoryOptions = { dataFile?: string; initialData?: DogbookxData }

export function createSocialRepository(options: RepositoryOptions = {}) {
  const dataFile = options.dataFile ?? defaultDataFile()
  const state = options.initialData ? structuredClone(options.initialData) : loadDataFile(dataFile)

  function save() {
    saveDataFile(dataFile, state)
  }

  return {
    listUsers: () => state.users,
    findUser: (id: string) => state.users.find((user) => user.id === id),
    listDogs: () => state.dogs,
    findDog: (id: string) => state.dogs.find((dog) => dog.id === id),
    createDog: (input: CreateDogInput) => {
      const dog: DogProfile = {
        id: `dog-${nanoid(8)}`,
        ownerId: input.ownerId,
        name: input.name,
        breed: input.breed,
        age: input.age,
        pronouns: input.pronouns,
        bio: input.bio,
        avatarUrl:
          input.avatarUrl ??
          `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(`${input.name}-${input.breed}`)}`,
        favoritePark: input.favoritePark
      }

      state.dogs.push(dog)
      save()
      return dog
    },
    updateDog: (dogId: string, input: UpdateDogInput) => {
      const dog = state.dogs.find((item) => item.id === dogId)
      if (!dog || dog.ownerId !== input.ownerId) return undefined

      Object.assign(dog, input)
      save()
      return dog
    },
    listGroups: () => state.groups,
    listNotificationsForUser: (userId: string) =>
      state.notifications
        .filter((notification) => notification.userId === userId)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    listPosts: () => state.posts.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    listRepliesForPost: (postId: string) =>
      state.replies
        .filter((reply) => reply.postId === postId)
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
    createPost: (input: CreatePostInput) => {
      const post: Post = {
        id: `post-${nanoid(8)}`,
        authorId: input.authorId,
        dogId: input.dogId,
        body: input.body,
        mediaUrl: input.mediaUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        replyCount: 0,
        repostCount: 0,
        likedByViewer: false,
        repostedByViewer: false
      }

      state.posts.unshift(post)
      save()
      return post
    },
    createReply: (input: CreateReplyInput) => {
      const post = state.posts.find((item) => item.id === input.postId)
      if (!post) return undefined

      const reply: Reply = {
        id: `reply-${nanoid(8)}`,
        postId: input.postId,
        authorId: input.authorId,
        dogId: input.dogId,
        body: input.body,
        createdAt: new Date().toISOString()
      }

      state.replies.push(reply)
      post.replyCount += 1

      if (post.authorId !== input.authorId) {
        state.notifications.push({
          id: `notice-${nanoid(8)}`,
          userId: post.authorId,
          type: 'reply',
          title: 'New reply on your post',
          body: input.body,
          createdAt: reply.createdAt,
          read: false
        })
      }

      save()
      return reply
    },
    toggleLike: (postId: string) => {
      const post = state.posts.find((item) => item.id === postId)
      if (!post) return undefined

      post.likedByViewer = !post.likedByViewer
      post.likeCount += post.likedByViewer ? 1 : -1
      save()
      return post
    },
    toggleRepost: (postId: string) => {
      const post = state.posts.find((item) => item.id === postId)
      if (!post) return undefined

      post.repostedByViewer = !post.repostedByViewer
      post.repostCount += post.repostedByViewer ? 1 : -1
      save()
      return post
    },
    toggleFollow: (viewerId: string, targetId: string) => {
      const viewer = state.users.find((user) => user.id === viewerId)
      const target = state.users.find((user) => user.id === targetId)
      if (!viewer || !target || viewer.id === target.id) return undefined

      viewer.followingIds = viewer.followingIds.includes(targetId)
        ? viewer.followingIds.filter((id) => id !== targetId)
        : [...viewer.followingIds, targetId]
      save()
      return viewer
    }
  }
}
