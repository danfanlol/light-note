'use server'

import sql from '@/lib/db'
import { Passage } from '@/lib/database.types'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getPassages(sectionId: string): Promise<Passage[]> {
  const passages = await sql`
    SELECT * FROM passages WHERE section_id = ${sectionId} ORDER BY created_at ASC
  `
  return passages as Passage[]
}

export async function createPassage(sectionId: string, redirectTo: string, formData: FormData) {
  const content = (formData.get('content') as string)?.trim()
  const mainIdea = (formData.get('main_idea') as string)?.trim() || null
  const notes = (formData.get('notes') as string)?.trim() || null

  if (!content) return

  await sql`
    INSERT INTO passages (section_id, content, main_idea, notes)
    VALUES (${sectionId}, ${content}, ${mainIdea}, ${notes})
  `

  redirect(redirectTo)
}

export async function updatePassage(passageId: string, formData: FormData) {
  const content = (formData.get('content') as string)?.trim()
  const mainIdea = (formData.get('main_idea') as string)?.trim() || null
  const notes = (formData.get('notes') as string)?.trim() || null

  if (!content) return

  await sql`
    UPDATE passages SET content = ${content}, main_idea = ${mainIdea}, notes = ${notes} WHERE id = ${passageId}
  `

  revalidatePath('/', 'layout')
}

export async function deletePassage(passageId: string) {
  await sql`DELETE FROM passages WHERE id = ${passageId}`
  revalidatePath('/', 'layout')
}

export async function getPassagesForBook(bookId: string): Promise<Passage[]> {
  const rows = await sql`
    SELECT p.* FROM passages p
    JOIN sections s ON p.section_id = s.id
    WHERE s.book_id = ${bookId} AND s.sub_book_id IS NULL
    ORDER BY p.created_at ASC
  `
  return rows as Passage[]
}

export async function getPassagesForSubBook(subBookId: string): Promise<Passage[]> {
  const rows = await sql`
    SELECT p.* FROM passages p
    JOIN sections s ON p.section_id = s.id
    WHERE s.sub_book_id = ${subBookId}
    ORDER BY p.created_at ASC
  `
  return rows as Passage[]
}

export async function getMainIdeasForSubBook(subBookId: string): Promise<{ main_idea: string; section_id: string }[]> {
  const rows = await sql`
    SELECT p.main_idea, p.section_id
    FROM passages p
    JOIN sections s ON p.section_id = s.id
    WHERE s.sub_book_id = ${subBookId} AND p.main_idea IS NOT NULL AND p.main_idea <> ''
    ORDER BY p.created_at ASC
  `
  return rows as { main_idea: string; section_id: string }[]
}

export async function getMainIdeasForBook(bookId: string): Promise<{ main_idea: string; section_id: string }[]> {
  const rows = await sql`
    SELECT p.main_idea, p.section_id
    FROM passages p
    JOIN sections s ON p.section_id = s.id
    WHERE s.book_id = ${bookId} AND s.sub_book_id IS NULL AND p.main_idea IS NOT NULL AND p.main_idea <> ''
    ORDER BY p.created_at ASC
  `
  return rows as { main_idea: string; section_id: string }[]
}
