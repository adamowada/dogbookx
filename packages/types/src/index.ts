export type Id = string

export type User = {
  id: Id
  handle: string
  name: string
  bio: string
  location: string
  avatarUrl: string
  followingIds: Id[]
}

export type DogProfile = {
  id: Id
  ownerId: Id
  name: string
  breed: string
  age: number
  pronouns: string
  bio: string
  avatarUrl: string
  favoritePark: string
}

export type Post = {
  id: Id
  authorId: Id
  dogId?: Id
  body: string
  mediaUrl?: string
  createdAt: string
  likeCount: number
  replyCount: number
  repostCount: number
  likedByViewer: boolean
  repostedByViewer: boolean
}

export type EnrichedPost = Post & {
  author: User
  dog?: DogProfile
}

export type Notification = {
  id: Id
  userId: Id
  type: 'like' | 'reply' | 'follow' | 'moderation'
  title: string
  body: string
  createdAt: string
  read: boolean
}

export type Group = {
  id: Id
  name: string
  description: string
  memberCount: number
  accent: string
}

export type FeedResponse = {
  viewer: User
  dogs: DogProfile[]
  posts: EnrichedPost[]
  suggestions: User[]
  groups: Group[]
  notifications: Notification[]
}

export type CreatePostInput = {
  authorId: Id
  dogId?: Id
  body: string
  mediaUrl?: string
}

export type DogbookxData = {
  users: User[]
  dogs: DogProfile[]
  posts: Post[]
  groups: Group[]
  notifications: Notification[]
}
