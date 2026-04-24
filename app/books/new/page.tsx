import Link from 'next/link'
import { createBook } from '@/app/actions/books'

export default function NewBookPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-6 py-12">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← Back
        </Link>

        <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Add a Book
        </h1>

        <form action={createBook} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Book title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              autoFocus
              placeholder="e.g. Thinking, Fast and Slow"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-800 transition"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="has_sub_books"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-50 cursor-pointer"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Is your book divided into smaller books (e.g. Book I, Book II)?
            </p>
          </label>

          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Add Book
          </button>
        </form>

      </div>
    </div>
  )
}
