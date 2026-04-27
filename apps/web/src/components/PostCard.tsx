import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react'
import { useState } from 'react'
import type { DogProfile, EnrichedPost, EnrichedReply } from '@dogbookx/types'
import { Avatar, Button, Textarea } from '@dogbookx/ui'
import { createReply } from '../lib/api'

type Props = {
  post: EnrichedPost
  dogs: DogProfile[]
  onLike: (postId: string) => void
  onRepost: (postId: string) => void
  onReply: (postId: string, reply: EnrichedReply) => void
}

export function PostCard({ post, dogs, onLike, onRepost, onReply }: Props) {
  const [replyBody, setReplyBody] = useState('')
  const [replyDogId, setReplyDogId] = useState(dogs[0]?.id ?? '')
  const [error, setError] = useState<string | null>(null)
  const postedAt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(
    new Date(post.createdAt)
  )

  async function submitReply() {
    setError(null)
    try {
      const reply = await createReply(post.id, { body: replyBody, dogId: replyDogId || undefined })
      setReplyBody('')
      onReply(post.id, reply)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reply.')
    }
  }

  return (
    <article className="border-b border-zinc-200 bg-white px-4 py-5 sm:px-6">
      <div className="flex gap-3">
        <Avatar src={post.dog?.avatarUrl ?? post.author.avatarUrl} alt={post.dog?.name ?? post.author.name} className="size-11" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="text-sm font-semibold text-zinc-950">{post.dog?.name ?? post.author.name}</h2>
            {post.dog && <span className="text-sm text-zinc-500">with {post.author.name}</span>}
            <span className="text-sm text-zinc-400">@{post.author.handle}</span>
            <span className="text-sm text-zinc-400">{postedAt}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-6 text-zinc-800">{post.body}</p>
          {post.mediaUrl && <img className="mt-3 aspect-[16/10] w-full rounded-lg border border-zinc-200 object-cover" src={post.mediaUrl} alt="" />}
          <div className="mt-4 flex max-w-md items-center justify-between text-zinc-500">
            <Button type="button" plain aria-label="Reply">
              <MessageCircle data-slot="icon" />
              {post.replyCount}
            </Button>
            <Button type="button" plain aria-label="Repost" onClick={() => onRepost(post.id)}>
              <Repeat2 data-slot="icon" className={post.repostedByViewer ? 'text-emerald-600' : undefined} />
              {post.repostCount}
            </Button>
            <Button type="button" plain aria-label="Like" onClick={() => onLike(post.id)}>
              <Heart data-slot="icon" className={post.likedByViewer ? 'fill-rose-500 text-rose-500' : undefined} />
              {post.likeCount}
            </Button>
            <Button type="button" plain aria-label="Share">
              <Share data-slot="icon" />
            </Button>
          </div>

          {post.recentReplies.length > 0 && (
            <div className="mt-4 space-y-2 border-l-2 border-emerald-100 pl-3">
              {post.recentReplies.map((reply) => (
                <p key={reply.id} className="text-sm leading-5 text-zinc-600">
                  <span className="font-semibold text-zinc-900">{reply.dog?.name ?? reply.author.name}:</span> {reply.body}
                </p>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-lg bg-zinc-50 p-3">
            <Textarea
              aria-label={`Reply to ${post.dog?.name ?? post.author.name}`}
              rows={2}
              value={replyBody}
              onChange={(event) => setReplyBody(event.target.value)}
              placeholder="Write a supportive reply..."
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <select
                aria-label="Reply as"
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-700"
                value={replyDogId}
                onChange={(event) => setReplyDogId(event.target.value)}
              >
                {dogs.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name}
                  </option>
                ))}
                <option value="">Just me</option>
              </select>
              <Button type="button" outline disabled={!replyBody.trim()} onClick={submitReply}>
                <MessageCircle data-slot="icon" />
                Reply
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
          </div>
        </div>
      </div>
    </article>
  )
}
