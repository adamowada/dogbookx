import { Plus, Save } from 'lucide-react'
import { useState } from 'react'
import type { DogProfile } from '@dogbookx/types'
import { Avatar, Button, Input, Textarea } from '@dogbookx/ui'
import { createDog, updateDog } from '../lib/api'

type Props = {
  dogs: DogProfile[]
  onDogsChange: (dogs: DogProfile[]) => void
}

const emptyDog = {
  name: '',
  breed: '',
  age: 1,
  pronouns: 'she/her',
  bio: '',
  avatarUrl: '',
  favoritePark: ''
}

export function DogManager({ dogs, onDogsChange }: Props) {
  const [draft, setDraft] = useState(emptyDog)
  const [editingDogId, setEditingDogId] = useState(dogs[0]?.id ?? '')
  const [favoritePark, setFavoritePark] = useState(dogs[0]?.favoritePark ?? '')
  const [error, setError] = useState<string | null>(null)
  const editingDog = dogs.find((dog) => dog.id === editingDogId)

  async function addDog() {
    setError(null)
    try {
      const dog = await createDog(draft)
      onDogsChange([...dogs, dog])
      setDraft(emptyDog)
      setEditingDogId(dog.id)
      setFavoritePark(dog.favoritePark)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save dog profile.')
    }
  }

  async function saveDog() {
    if (!editingDog) return
    setError(null)
    try {
      const dog = await updateDog(editingDog.id, { favoritePark })
      onDogsChange(dogs.map((item) => (item.id === dog.id ? dog : item)))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update dog profile.')
    }
  }

  return (
    <section className="mt-6">
      <h2 className="text-sm font-bold text-zinc-950">Your dogs</h2>
      <div className="mt-3 space-y-3">
        {dogs.map((dog) => (
          <button
            key={dog.id}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg text-left hover:bg-zinc-50"
            onClick={() => {
              setEditingDogId(dog.id)
              setFavoritePark(dog.favoritePark)
            }}
          >
            <Avatar src={dog.avatarUrl} alt={dog.name} className="size-9" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">{dog.name}</p>
              <p className="text-xs text-zinc-500">
                {dog.breed} / {dog.age}
              </p>
            </div>
          </button>
        ))}
      </div>

      {editingDog && (
        <div className="mt-3 space-y-2 rounded-lg border border-zinc-200 p-3">
          <p className="text-xs font-semibold uppercase text-zinc-500">Favorite park</p>
          <Input aria-label="Favorite park" value={favoritePark} onChange={(event) => setFavoritePark(event.target.value)} />
          <Button type="button" outline onClick={saveDog}>
            <Save data-slot="icon" />
            Save
          </Button>
        </div>
      )}

      <div className="mt-3 space-y-2 rounded-lg border border-zinc-200 p-3">
        <p className="text-xs font-semibold uppercase text-zinc-500">Add dog</p>
        <Input aria-label="Dog name" placeholder="Name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <Input aria-label="Breed" placeholder="Breed" value={draft.breed} onChange={(event) => setDraft({ ...draft, breed: event.target.value })} />
        <Input aria-label="Age" type="number" value={draft.age} onChange={(event) => setDraft({ ...draft, age: Number(event.target.value) })} />
        <Input aria-label="Pronouns" placeholder="Pronouns" value={draft.pronouns} onChange={(event) => setDraft({ ...draft, pronouns: event.target.value })} />
        <Input
          aria-label="Favorite park for new dog"
          placeholder="Favorite park"
          value={draft.favoritePark}
          onChange={(event) => setDraft({ ...draft, favoritePark: event.target.value })}
        />
        <Textarea aria-label="Dog bio" placeholder="Bio" rows={2} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} />
        <Button type="button" color="emerald" disabled={!draft.name || !draft.breed || !draft.bio || !draft.favoritePark} onClick={addDog}>
          <Plus data-slot="icon" />
          Add dog
        </Button>
      </div>
      {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
    </section>
  )
}
