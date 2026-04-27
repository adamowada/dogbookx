import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createSocialRepository } from '../src/repositories/socialRepository'
import { viewerId } from '../src/seed'

const tempDirs: string[] = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

function tempDataFile() {
  const dir = mkdtempSync(join(tmpdir(), 'dogbookx-'))
  tempDirs.push(dir)
  return join(dir, 'data.json')
}

describe('SocialRepository persistence', () => {
  it('persists created posts across repository instances', () => {
    const dataFile = tempDataFile()
    const firstRepository = createSocialRepository({ dataFile })

    const created = firstRepository.createPost({
      authorId: viewerId,
      dogId: 'dog-bean',
      body: 'Persisted park report.'
    })

    const secondRepository = createSocialRepository({ dataFile })

    expect(secondRepository.listPosts()[0]?.id).toBe(created.id)
    expect(secondRepository.listPosts()[0]?.body).toBe('Persisted park report.')
  })

  it('persists follow, like, and repost mutations', () => {
    const dataFile = tempDataFile()
    const firstRepository = createSocialRepository({ dataFile })

    firstRepository.toggleFollow(viewerId, 'user-ivy')
    firstRepository.toggleLike('post-2')
    firstRepository.toggleRepost('post-2')

    const secondRepository = createSocialRepository({ dataFile })
    const viewer = secondRepository.findUser(viewerId)
    const post = secondRepository.listPosts().find((item) => item.id === 'post-2')

    expect(viewer?.followingIds).toContain('user-ivy')
    expect(post?.likedByViewer).toBe(true)
    expect(post?.repostedByViewer).toBe(true)
  })
})
