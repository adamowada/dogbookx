import { nanoid } from 'nanoid'
import type { CreatePostInput, DogProfile, Group, Notification, Post, User } from '@dogbookx/types'
import { dogs, groups, notifications, posts, users } from '../seed.js'

export type SocialRepository = ReturnType<typeof createSocialRepository>

export function createSocialRepository(initial = { users, dogs, posts, groups, notifications }) {
  const state = {
    users: structuredClone(initial.users) as User[],
    dogs: structuredClone(initial.dogs) as DogProfile[],
    posts: structuredClone(initial.posts) as Post[],
    groups: structuredClone(initial.groups) as Group[],
    notifications: structuredClone(initial.notifications) as Notification[]
  }

  return {
    listUsers: () => state.users,
    findUser: (id: string) => state.users.find((user) => user.id === id),
    listDogs: () => state.dogs,
    findDog: (id: string) => state.dogs.find((dog) => dog.id === id),
    listGroups: () => state.groups,
    listNotificationsForUser: (userId: string) =>
      state.notifications
        .filter((notification) => notification.userId === userId)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    listPosts: () => state.posts.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
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
      return post
    },
    toggleLike: (postId: string) => {
      const post = state.posts.find((item) => item.id === postId)
      if (!post) return undefined

      post.likedByViewer = !post.likedByViewer
      post.likeCount += post.likedByViewer ? 1 : -1
      return post
    },
    toggleRepost: (postId: string) => {
      const post = state.posts.find((item) => item.id === postId)
      if (!post) return undefined

      post.repostedByViewer = !post.repostedByViewer
      post.repostCount += post.repostedByViewer ? 1 : -1
      return post
    },
    toggleFollow: (viewerId: string, targetId: string) => {
      const viewer = state.users.find((user) => user.id === viewerId)
      const target = state.users.find((user) => user.id === targetId)
      if (!viewer || !target || viewer.id === target.id) return undefined

      viewer.followingIds = viewer.followingIds.includes(targetId)
        ? viewer.followingIds.filter((id) => id !== targetId)
        : [...viewer.followingIds, targetId]
      return viewer
    }
  }
}
