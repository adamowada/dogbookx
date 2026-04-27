import { Bell, Dog, Home, Search, ShieldCheck, Users } from 'lucide-react'
import type { DogProfile, Group, Notification, User } from '@dogbookx/types'
import { Avatar, Badge, Button } from '@dogbookx/ui'
import { DogManager } from './DogManager'

type Props = {
  viewer: User
  dogs: DogProfile[]
  groups: Group[]
  notifications: Notification[]
  suggestions: User[]
  followingIds: string[]
  onFollow: (userId: string) => void
  onDogsChange: (dogs: DogProfile[]) => void
}

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Explore', icon: Search },
  { label: 'Dogs', icon: Dog },
  { label: 'Groups', icon: Users },
  { label: 'Safety', icon: ShieldCheck }
]

export function Sidebar({ viewer, dogs, groups, notifications, suggestions, followingIds, onFollow, onDogsChange }: Props) {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-zinc-200 bg-white px-5 py-6 lg:block">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-lg bg-emerald-700 text-lg font-black text-white">DX</div>
        <div>
          <p className="text-lg font-black tracking-normal text-zinc-950">DogbookX</p>
          <p className="text-sm text-zinc-500">Social for dog people</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <a key={item.label} href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
            <item.icon className="size-5 text-emerald-700" />
            {item.label}
          </a>
        ))}
      </nav>

      <section className="mt-8 rounded-lg border border-zinc-200 p-4">
        <div className="flex items-center gap-3">
          <Avatar src={viewer.avatarUrl} alt={viewer.name} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-950">{viewer.name}</p>
            <p className="truncate text-sm text-zinc-500">@{viewer.handle}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-5 text-zinc-600">{viewer.bio}</p>
      </section>

      <DogManager dogs={dogs} onDogsChange={onDogsChange} />

      <section className="mt-6">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-zinc-950">Notifications</h2>
          <Badge color="emerald">{notifications.filter((item) => !item.read).length}</Badge>
        </div>
        <div className="mt-3 space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-lg bg-zinc-50 p-3">
              <p className="text-sm font-semibold text-zinc-900">{notification.title}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-600">{notification.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-bold text-zinc-950">People to follow</h2>
        <div className="mt-3 space-y-3">
          {suggestions.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar src={user.avatarUrl} alt={user.name} className="size-9" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">{user.name}</p>
                  <p className="truncate text-xs text-zinc-500">@{user.handle}</p>
                </div>
              </div>
              <Button type="button" outline onClick={() => onFollow(user.id)}>
                {followingIds.includes(user.id) ? 'Following' : 'Follow'}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-bold text-zinc-950">Groups</h2>
        <div className="mt-3 space-y-3">
          {groups.map((group) => (
            <div key={group.id} className="rounded-lg border border-zinc-200 p-3">
              <p className="text-sm font-semibold text-zinc-900">{group.name}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-600">{group.description}</p>
              <p className="mt-2 text-xs font-semibold text-emerald-700">{group.memberCount.toLocaleString()} members</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
