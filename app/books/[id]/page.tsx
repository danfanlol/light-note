import Link from 'next/link'
import { getBooks } from '@/app/actions/books'
import { getSections } from '@/app/actions/sections'
import { getSubBooks } from '@/app/actions/sub-books'
import { getMainIdeasForBook, getPassagesForBook } from '@/app/actions/passages'
import BookTitleMenu from './BookTitleMenu'
import SubBookCard from '@/app/components/SubBookCard'
import SectionCard from '@/app/components/SectionCard'
import SectionSearchFilter from '@/app/components/SectionSearchFilter'
import { SubBook } from '@/lib/database.types'

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const books = await getBooks()
  const book = books.find((b) => b.id === id)

  if (!book) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Book not found.</p>
      </div>
    )
  }

  const [items, mainIdeas, allPassages] = await Promise.all([
    book.has_sub_books ? getSubBooks(id) : getSections(id),
    book.has_sub_books ? Promise.resolve([]) : getMainIdeasForBook(id),
    book.has_sub_books ? Promise.resolve([]) : getPassagesForBook(id),
  ])

  const addHref = book.has_sub_books
    ? `/books/${id}/sub-books/new`
    : `/books/${id}/sections/new`

  const addLabel = book.has_sub_books ? '+ Add Book' : '+ Add Section'
  const emptyDesc = book.has_sub_books
    ? 'Add your first book to start organising your notes.'
    : 'Add your first section to start organising your notes.'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← My Books
        </Link>

        <div className="flex items-center justify-between mb-10 mt-6">
          <BookTitleMenu bookId={id} title={book.title} />
          <Link
            href={addHref}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            {addLabel}
          </Link>
        </div>

        {items.length === 0 ? (
          book.has_sub_books ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="mb-4 text-5xl">🗂️</div>
              <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                {emptyDesc}
              </p>
              <Link
                href={addHref}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              >
                {addLabel}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="mb-4 text-5xl">📄</div>
              <h2 className="mb-2 text-lg font-medium text-zinc-800 dark:text-zinc-200">
                No sections yet
              </h2>
              <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                {emptyDesc}
              </p>
              <Link
                href={addHref}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              >
                {addLabel}
              </Link>
            </div>
          )
        ) : book.has_sub_books ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <SubBookCard key={item.id} subBook={item as SubBook} bookId={id} />
            ))}
          </div>
        ) : (
          <SectionSearchFilter
            sections={items as import('@/lib/database.types').Section[]}
            passages={allPassages}
            sectionHrefPrefix={`/books/${id}/sections`}
            backHref={`/books/${id}`}
          />
        )}

        {mainIdeas.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
              Main Ideas
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mainIdeas.map((item, i) => (
                <Link
                  key={i}
                  href={`/books/${id}/sections/${item.section_id}`}
                  className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 transition-all"
                >
                  <p className="text-sm text-zinc-700 group-hover:text-zinc-500 dark:text-zinc-300 dark:group-hover:text-zinc-400 leading-relaxed transition-colors">{item.main_idea}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
