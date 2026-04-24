'use server'

import sql from '@/lib/db'
import { Book } from '@/lib/database.types'
import { redirect } from 'next/navigation'

export async function getBooks(): Promise<Book[]> {
  const books = await sql`SELECT * FROM books ORDER BY created_at DESC`
  return books as Book[]
}

export async function createBook(formData: FormData) {
  const title = (formData.get('title') as string)?.trim()
  const hasSubBooks = formData.get('has_sub_books') === 'on'

  if (!title) return

  await sql`INSERT INTO books (title, has_sub_books) VALUES (${title}, ${hasSubBooks})`

  redirect('/')
}

export async function deleteBook(bookId: string) {
  await sql`DELETE FROM books WHERE id = ${bookId}`
  redirect('/')
}

export async function renameBook(bookId: string, formData: FormData) {
  const title = (formData.get('title') as string)?.trim()
  if (!title) return
  await sql`UPDATE books SET title = ${title} WHERE id = ${bookId}`
  redirect(`/books/${bookId}`)
}
