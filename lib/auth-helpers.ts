import { auth } from '@clerk/nextjs/server'
import sql from '@/lib/db'

export async function assertBookOwner(bookId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const [book] = await sql`SELECT id FROM books WHERE id = ${bookId} AND user_id = ${userId}`
  if (!book) throw new Error('Unauthorized')
}
