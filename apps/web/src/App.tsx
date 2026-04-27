import { Loader2, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { EnrichedPost, FeedResponse } from '@dogbookx/types'
import { Badge, Button } from '@dogbookx/ui'
import { PostCard } from './components/PostCard'
import { PostComposer } from './components/PostComposer'
import { Sidebar } from './components/Sidebar'
import { getFeed, toggleFollow, toggleLike, toggleRepost } from './lib/api'

export function App() {
  const [feed, setFeed] = useState<FeedResponse | null>(null)
  const [posts, setPosts] = useState<EnrichedPost[]>([])
  const [error, setError] = useState<string | null>(null)
  const followingIds = useMemo(() => feed?.viewer.followingIds ?? [], [feed])

  useEffect(() => {
    getFeed()
      .then((nextFeed) => {
        setFeed(nextFeed)
        setPosts(nextFeed.posts)
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load DogbookX.')
      })
  }, [])

  async function refreshPost(postId: string, action: 'like' | 'repost') {
    const updated = action === 'like' ? await toggleLike(postId) : await toggleRepost(postId)
    setPosts((current) => current.map((post) => (post.id === updated.id ? updated : post)))
  }

  async function followUser(targetId: string) {
    const viewer = await toggleFollow(targetId)
    setFeed((current) => (current ? { ...current, viewer } : current))
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50 p-6">
        <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-bold text-zinc-950">DogbookX could not load</h1>
          <p className="mt-2 text-sm text-zinc-600">{error}</p>
          <Button type="button" color="emerald" className="mt-4" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </main>
    )
  }

  if (!feed) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50">
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-700 shadow-sm">
          <Loader2 className="size-5 animate-spin text-emerald-700" />
          Loading DogbookX
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <div className="mx-auto flex max-w-7xl">
        <Sidebar
          viewer={feed.viewer}
          dogs={feed.dogs}
          groups={feed.groups}
          notifications={feed.notifications}
          suggestions={feed.suggestions}
          followingIds={followingIds}
          onFollow={followUser}
        />

        <main className="min-w-0 flex-1 border-x border-zinc-200 bg-white/70">
          <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-zinc-950">Home</h1>
                <p className="text-sm text-zinc-500">Walk wins, local advice, and real-time dog people updates.</p>
              </div>
              <Badge color="emerald">
                <ShieldCheck className="mr-1 inline size-3" />
                Moderated
              </Badge>
            </div>
          </header>

          <PostComposer viewer={feed.viewer} dogs={feed.dogs} onCreated={(post) => setPosts((current) => [post, ...current])} />

          <section aria-label="Home feed">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={(postId) => void refreshPost(postId, 'like')}
                onRepost={(postId) => void refreshPost(postId, 'repost')}
              />
            ))}
          </section>
        </main>

        <aside className="hidden w-80 shrink-0 px-5 py-6 xl:block">
          <section className="rounded-lg border border-zinc-200 bg-white p-4">
            <h2 className="text-sm font-bold text-zinc-950">Local safety pulse</h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-2xl font-black text-emerald-700">94%</p>
                <p className="text-sm text-zinc-600">posts pass first-look moderation</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-700">12</p>
                <p className="text-sm text-zinc-600">new trainer recommendations this week</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-700">3</p>
                <p className="text-sm text-zinc-600">nearby meetups accepting new members</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
