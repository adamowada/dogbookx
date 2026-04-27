import { ImagePlus, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DogProfile, EnrichedPost, User } from '@dogbookx/types'
import { Avatar, Button, Textarea } from '@dogbookx/ui'
import { createPost } from '../lib/api'

type Props = {
  viewer: User
  dogs: DogProfile[]
  onCreated: (post: EnrichedPost) => void
}

export function PostComposer({ viewer, dogs, onCreated }: Props) {
  const [body, setBody] = useState('')
  const [dogId, setDogId] = useState(dogs[0]?.id ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const selectedDog = useMemo(() => dogs.find((dog) => dog.id === dogId), [dogs, dogId])
  const remaining = 280 - body.length

  async function submitPost() {
    setError(null)
    setIsSubmitting(true)
    try {
      const post = await createPost({
        authorId: viewer.id,
        dogId: dogId || undefined,
        body
      })
      setBody('')
      onCreated(post)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex gap-3">
        <Avatar src={selectedDog?.avatarUrl ?? viewer.avatarUrl} alt={selectedDog?.name ?? viewer.name} className="size-11" />
        <div className="min-w-0 flex-1 space-y-3">
          <Textarea
            aria-label="Create a post"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Share a walk win, question, or dog park dispatch..."
            rows={3}
            resizable={false}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="dog-select">
                Post as
              </label>
              <select
                id="dog-select"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm"
                value={dogId}
                onChange={(event) => setDogId(event.target.value)}
              >
                {dogs.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name}
                  </option>
                ))}
                <option value="">Just {viewer.name}</option>
              </select>
              <Button type="button" outline aria-label="Add media">
                <ImagePlus data-slot="icon" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className={remaining < 20 ? 'text-sm font-semibold text-red-600' : 'text-sm text-zinc-500'}>
                {remaining}
              </span>
              <Button type="button" color="emerald" disabled={!body.trim() || remaining < 0 || isSubmitting} onClick={submitPost}>
                <Send data-slot="icon" />
                Post
              </Button>
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </section>
  )
}
