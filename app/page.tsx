import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { getBooks } from './actions/books'
import BookGrid from './components/BookGrid'

export default async function Home() {
  const books = await getBooks()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            My Books
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/books/new"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              + Add Book
            </Link>
            <UserButton />
          </div>
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 text-5xl">📚</div>
            <h2 className="mb-2 text-lg font-medium text-zinc-800 dark:text-zinc-200">
              No books yet
            </h2>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Add your first book to start taking notes.
            </p>
            <Link
              href="/books/new"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              + Add Book
            </Link>
          </div>
        ) : (
          <BookGrid initialBooks={books} />
        )}

      </div>
    </div>
  )
}
