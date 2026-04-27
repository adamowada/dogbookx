import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react'
import type { EnrichedPost } from '@dogbookx/types'
import { Avatar, Button } from '@dogbookx/ui'

type Props = {
  post: EnrichedPost
  onLike: (postId: string) => void
  onRepost: (postId: string) => void
}

export function PostCard({ post, onLike, onRepost }: Props) {
  const postedAt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(
    new Date(post.createdAt)
  )

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
          {post.mediaUrl && (
            <img
              className="mt-3 aspect-[16/10] w-full rounded-lg border border-zinc-200 object-cover"
              src={post.mediaUrl}
              alt=""
            />
          )}
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
        </div>
      </div>
    </article>
  )
}
