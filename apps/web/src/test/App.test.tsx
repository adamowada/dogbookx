import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from '../App'

describe('App', () => {
  it('renders the loaded home feed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          viewer: {
            id: 'user-maya',
            handle: 'mayapaws',
            name: 'Maya Chen',
            bio: 'Dog person',
            location: 'Portland',
            avatarUrl: '',
            followingIds: []
          },
          dogs: [
            {
              id: 'dog-bean',
              ownerId: 'user-maya',
              name: 'Bean',
              breed: 'Corgi mix',
              age: 3,
              pronouns: 'she/her',
              bio: 'Great dog',
              avatarUrl: '',
              favoritePark: 'Laurelhurst'
            }
          ],
          posts: [
            {
              id: 'post-1',
              authorId: 'user-maya',
              dogId: 'dog-bean',
              body: 'Bean says hello',
              createdAt: new Date().toISOString(),
              likeCount: 1,
              replyCount: 0,
              repostCount: 0,
              likedByViewer: false,
              repostedByViewer: false,
              author: {
                id: 'user-maya',
                handle: 'mayapaws',
                name: 'Maya Chen',
                bio: 'Dog person',
                location: 'Portland',
                avatarUrl: '',
                followingIds: []
              },
              dog: {
                id: 'dog-bean',
                ownerId: 'user-maya',
                name: 'Bean',
                breed: 'Corgi mix',
                age: 3,
                pronouns: 'she/her',
                bio: 'Great dog',
                avatarUrl: '',
                favoritePark: 'Laurelhurst'
              }
            }
          ],
          suggestions: [],
          groups: [],
          notifications: []
        })
      }))
    )

    render(<App />)

    await waitFor(() => expect(screen.getByText('Bean says hello')).toBeInTheDocument())
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })
})
