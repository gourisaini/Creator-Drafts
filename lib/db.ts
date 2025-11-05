import fs from "fs"
import path from "path"

interface Draft {
  id: string
  title: string
  description: string
  tags: string[]
  images: string[]
  published: boolean
  createdAt: Date
  updatedAt: Date
  content?: string
}

const DB_DIR = path.join(process.cwd(), "data")
const DB_FILE = path.join(DB_DIR, "drafts.json")

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2))
}

export function getAllDrafts(): Draft[] {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function getDraftById(id: string): Draft | null {
  const drafts = getAllDrafts()
  return drafts.find((d) => d.id === id) || null
}

export function createDraft(draft: Omit<Draft, "id" | "createdAt" | "updatedAt">): Draft {
  const drafts = getAllDrafts()
  const newDraft: Draft = {
    ...draft,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  drafts.push(newDraft)
  fs.writeFileSync(DB_FILE, JSON.stringify(drafts, null, 2))
  return newDraft
}

export function updateDraft(id: string, updates: Partial<Draft>): Draft | null {
  const drafts = getAllDrafts()
  const index = drafts.findIndex((d) => d.id === id)

  if (index === -1) return null

  const updated = {
    ...drafts[index],
    ...updates,
    updatedAt: new Date(),
  }

  drafts[index] = updated
  fs.writeFileSync(DB_FILE, JSON.stringify(drafts, null, 2))
  return updated
}

export function deleteDraft(id: string): boolean {
  const drafts = getAllDrafts()
  const filtered = drafts.filter((d) => d.id !== id)

  if (filtered.length === drafts.length) return false

  fs.writeFileSync(DB_FILE, JSON.stringify(filtered, null, 2))
  return true
}
