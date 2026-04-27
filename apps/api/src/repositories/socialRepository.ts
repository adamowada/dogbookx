import { nanoid } from 'nanoid'
import type { CreatePostInput, DogbookxData, Post } from '@dogbookx/types'
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
      save()
      return post
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
