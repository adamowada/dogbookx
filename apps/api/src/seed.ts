import type { DogProfile, Group, Notification, Post, User } from '@dogbookx/types'

export const viewerId = 'user-maya'

export const users: User[] = [
  {
    id: viewerId,
    handle: 'mayapaws',
    name: 'Maya Chen',
    bio: 'Trail walker, foster volunteer, and proud person to Bean.',
    location: 'Portland, OR',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    followingIds: ['user-lena', 'user-omar']
  },
  {
    id: 'user-lena',
    handle: 'lenalabs',
    name: 'Lena Brooks',
    bio: 'Reactive dog training notes and neighborhood walk reports.',
    location: 'Seattle, WA',
    avatarUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&q=80',
    followingIds: [viewerId]
  },
  {
    id: 'user-omar',
    handle: 'omarandfig',
    name: 'Omar Ruiz',
    bio: 'Weekend hikes, senior dog care, and Fig appreciation.',
    location: 'Bend, OR',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    followingIds: [viewerId]
  },
  {
    id: 'user-ivy',
    handle: 'ivyvet',
    name: 'Dr. Ivy Patel',
    bio: 'Vet, behavior nerd, and champion of practical enrichment.',
    location: 'Austin, TX',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=256&q=80',
    followingIds: []
  }
]

export const dogs: DogProfile[] = [
  {
    id: 'dog-bean',
    ownerId: viewerId,
    name: 'Bean',
    breed: 'Corgi mix',
    age: 3,
    pronouns: 'she/her',
    bio: 'Short legs, strong opinions, excellent office morale.',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=256&q=80',
    favoritePark: 'Laurelhurst Park'
  },
  {
    id: 'dog-river',
    ownerId: 'user-lena',
    name: 'River',
    breed: 'Australian Shepherd',
    age: 5,
    pronouns: 'he/him',
    bio: 'Practicing calm greetings and world-class frisbee catches.',
    avatarUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=256&q=80',
    favoritePark: 'Magnuson Off-Leash Area'
  },
  {
    id: 'dog-fig',
    ownerId: 'user-omar',
    name: 'Fig',
    breed: 'Greyhound',
    age: 9,
    pronouns: 'they/them',
    bio: 'Retired racer, professional blanket tester.',
    avatarUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=256&q=80',
    favoritePark: 'Shevlin Park'
  }
]

export const posts: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-lena',
    dogId: 'dog-river',
    body: 'River passed two bikes today with no barking. Celebrating tiny brave moments.',
    mediaUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likeCount: 18,
    replyCount: 5,
    repostCount: 3,
    likedByViewer: true,
    repostedByViewer: false
  },
  {
    id: 'post-2',
    authorId: viewerId,
    dogId: 'dog-bean',
    body: 'Bean would like the record to show that rain is fake news and walks should still happen.',
    mediaUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likeCount: 31,
    replyCount: 8,
    repostCount: 6,
    likedByViewer: false,
    repostedByViewer: false
  },
  {
    id: 'post-3',
    authorId: 'user-omar',
    dogId: 'dog-fig',
    body: 'Senior dog win: Fig chose the long loop and still had energy for a victory nap.',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likeCount: 24,
    replyCount: 4,
    repostCount: 2,
    likedByViewer: false,
    repostedByViewer: true
  }
]

export const groups: Group[] = [
  {
    id: 'group-reactive',
    name: 'Calm Walk Club',
    description: 'Supportive wins and strategies for reactive or nervous dogs.',
    memberCount: 1842,
    accent: 'emerald'
  },
  {
    id: 'group-senior',
    name: 'Senior Dog Lounge',
    description: 'Care tips, mobility ideas, and cozy victories.',
    memberCount: 967,
    accent: 'amber'
  }
]

export const notifications: Notification[] = [
  {
    id: 'notice-1',
    userId: viewerId,
    type: 'reply',
    title: 'Lena replied to Bean',
    body: 'Rain is definitely suspicious, River agrees.',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    read: false
  },
  {
    id: 'notice-2',
    userId: viewerId,
    type: 'follow',
    title: 'Dr. Ivy followed you',
    body: 'You have a new expert in your DogbookX circle.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false
  }
]
