import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { DogbookxData } from '@dogbookx/types'
import { dogs, groups, notifications, posts, users } from '../seed.js'

export function defaultDataFile() {
  return resolve(process.cwd(), '.dogbookx', 'data.json')
}

export function createSeedData(): DogbookxData {
  return structuredClone({ users, dogs, posts, groups, notifications })
}

export function loadDataFile(dataFile: string): DogbookxData {
  if (dataFile === ':memory:') return createSeedData()

  if (!existsSync(dataFile)) {
    const seedData = createSeedData()
    saveDataFile(dataFile, seedData)
    return seedData
  }

  return JSON.parse(readFileSync(dataFile, 'utf8')) as DogbookxData
}

export function saveDataFile(dataFile: string, data: DogbookxData) {
  if (dataFile === ':memory:') return

  mkdirSync(dirname(dataFile), { recursive: true })
  writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`)
}
