import type {
  CreateDogInput,
  CreatePostInput,
  CreateReplyInput,
  DogProfile,
  EnrichedPost,
  EnrichedReply,
  FeedResponse,
  UpdateDogInput,
  User
} from '@dogbookx/types'
import { getViewerId } from './session'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-dogbookx-user-id': getViewerId(),
      ...options?.headers
    },
    ...options
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(payload.error ?? 'DogbookX request failed')
  }

  return response.json() as Promise<T>
}

export function getFeed() {
  return request<FeedResponse>('/feed')
}

export function createPost(input: CreatePostInput) {
  return request<EnrichedPost>('/posts', {
    method: 'POST',
    body: JSON.stringify(input)
  })
}

export function toggleLike(postId: string) {
  return request<EnrichedPost>(`/posts/${postId}/like`, { method: 'POST' })
}

export function toggleRepost(postId: string) {
  return request<EnrichedPost>(`/posts/${postId}/repost`, { method: 'POST' })
}

export function toggleFollow(targetId: string) {
  return request<User>(`/users/${targetId}/follow`, { method: 'POST' })
}

export function createDog(input: Omit<CreateDogInput, 'ownerId'>) {
  return request<DogProfile>('/dogs', {
    method: 'POST',
    body: JSON.stringify(input)
  })
}

export function updateDog(dogId: string, input: Omit<UpdateDogInput, 'ownerId'>) {
  return request<DogProfile>(`/dogs/${dogId}`, {
    method: 'PATCH',
    body: JSON.stringify(input)
  })
}

export function createReply(postId: string, input: Omit<CreateReplyInput, 'postId' | 'authorId'>) {
  return request<EnrichedReply>(`/posts/${postId}/replies`, {
    method: 'POST',
    body: JSON.stringify(input)
  })
}
