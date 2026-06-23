'use server'

import sql from '@/lib/db'
import { SubBook } from '@/lib/database.types'
import { redirect } from 'next/navigation'
import { assertBookOwner } from '@/lib/auth-helpers'

export async function getSubBooks(bookId: string): Promise<SubBook[]> {
  const subBooks = await sql`
    SELECT * FROM sub_books WHERE book_id = ${bookId} ORDER BY order_index ASC, created_at ASC
  `
  return subBooks as SubBook[]
}

export async function renameSubBook(subBookId: string, redirectTo: string, formData: FormData) {
  const title = (formData.get('title') as string)?.trim()
  if (!title) return
  await sql`UPDATE sub_books SET title = ${title} WHERE id = ${subBookId}`
  redirect(redirectTo)
}

export async function deleteSubBook(subBookId: string, redirectTo: string) {
  await sql`DELETE FROM sub_books WHERE id = ${subBookId}`
  redirect(redirectTo)
}

export async function reorderSubBooks(bookId: string, subBookIds: string[]) {
  await assertBookOwner(bookId)
  await Promise.all(
    subBookIds.map((id, index) =>
      sql`UPDATE sub_books SET order_index = ${index} WHERE id = ${id} AND book_id = ${bookId}`
    )
  )
}

export async function createSubBook(bookId: string, formData: FormData) {
  await assertBookOwner(bookId)

  const title = (formData.get('title') as string)?.trim()

  if (!title) return

  await sql`
    INSERT INTO sub_books (book_id, title, order_index)
    VALUES (${bookId}, ${title}, (
      SELECT COALESCE(MAX(order_index), 0) + 1 FROM sub_books WHERE book_id = ${bookId}
    ))
  `

  redirect(`/books/${bookId}`)
}
