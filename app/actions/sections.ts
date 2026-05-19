'use server'

import sql from '@/lib/db'
import { Section } from '@/lib/database.types'
import { redirect } from 'next/navigation'
import { assertBookOwner } from '@/lib/auth-helpers'

export async function getSections(bookId: string): Promise<Section[]> {
  const sections = await sql`
    SELECT * FROM sections WHERE book_id = ${bookId} AND sub_book_id IS NULL ORDER BY order_index ASC, created_at ASC
  `
  return sections as Section[]
}

export async function getSectionsForSubBook(subBookId: string): Promise<Section[]> {
  const sections = await sql`
    SELECT * FROM sections WHERE sub_book_id = ${subBookId} ORDER BY order_index ASC, created_at ASC
  `
  return sections as Section[]
}

export async function createSection(bookId: string, formData: FormData) {
  await assertBookOwner(bookId)

  const title = (formData.get('title') as string)?.trim()

  if (!title) return

  const [section] = await sql`
    INSERT INTO sections (book_id, title, order_index)
    VALUES (${bookId}, ${title}, (
      SELECT COALESCE(MAX(order_index), 0) + 1 FROM sections WHERE book_id = ${bookId}
    ))
    RETURNING id
  `

  redirect(`/books/${bookId}/sections/${section.id}`)
}

export async function renameSection(sectionId: string, redirectTo: string, formData: FormData) {
  const title = (formData.get('title') as string)?.trim()
  if (!title) return
  await sql`UPDATE sections SET title = ${title} WHERE id = ${sectionId}`
  redirect(redirectTo)
}

export async function deleteSection(sectionId: string, redirectTo: string) {
  await sql`DELETE FROM sections WHERE id = ${sectionId}`
  redirect(redirectTo)
}

export async function createSectionForSubBook(bookId: string, subBookId: string, formData: FormData) {
  await assertBookOwner(bookId)

  const title = (formData.get('title') as string)?.trim()

  if (!title) return

  const [section] = await sql`
    INSERT INTO sections (book_id, sub_book_id, title, order_index)
    VALUES (${bookId}, ${subBookId}, ${title}, (
      SELECT COALESCE(MAX(order_index), 0) + 1 FROM sections WHERE sub_book_id = ${subBookId}
    ))
    RETURNING id
  `

  redirect(`/books/${bookId}/sub-books/${subBookId}/sections/${section.id}`)
}
