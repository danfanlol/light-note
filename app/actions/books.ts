'use server'

import sql from '@/lib/db'
import { Book } from '@/lib/database.types'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export async function getBooks(): Promise<Book[]> {
  const { userId } = await auth()
  if (!userId) return []
  const books = await sql`SELECT * FROM books WHERE user_id = ${userId} ORDER BY created_at DESC`
  return books as Book[]
}

export async function createBook(formData: FormData) {
  const { userId } = await auth()
  if (!userId) return

  const title = (formData.get('title') as string)?.trim()
  const hasSubBooks = formData.get('has_sub_books') === 'on'

  if (!title) return

  await sql`INSERT INTO books (title, has_sub_books, user_id) VALUES (${title}, ${hasSubBooks}, ${userId})`

  redirect('/')
}

export async function deleteBook(bookId: string) {
  const { userId } = await auth()
  if (!userId) return
  await sql`DELETE FROM books WHERE id = ${bookId} AND user_id = ${userId}`
  redirect('/')
}

export async function renameBook(bookId: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) return
  const title = (formData.get('title') as string)?.trim()
  if (!title) return
  await sql`UPDATE books SET title = ${title} WHERE id = ${bookId} AND user_id = ${userId}`
  redirect(`/books/${bookId}`)
}
