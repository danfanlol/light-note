import Link from 'next/link'
import { getSubBooks } from '@/app/actions/sub-books'
import { getSectionsForSubBook } from '@/app/actions/sections'
import { getMainIdeasForSubBook } from '@/app/actions/passages'
import SubBookTitleMenu from '@/app/components/SubBookTitleMenu'
import SectionCard from '@/app/components/SectionCard'

export default async function SubBookPage({
  params,
}: {
  params: Promise<{ id: string; subBookId: string }>
}) {
  const { id, subBookId } = await params

  const [subBooks, sections, mainIdeas] = await Promise.all([
    getSubBooks(id),
    getSectionsForSubBook(subBookId),
    getMainIdeasForSubBook(subBookId),
  ])

  const subBook = subBooks.find((sb) => sb.id === subBookId)

  if (!subBook) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Book not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <Link
          href={`/books/${id}`}
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← Back
        </Link>

        <div className="flex items-center justify-between mb-10 mt-6">
          <SubBookTitleMenu
            subBookId={subBookId}
            title={subBook.title}
            backHref={`/books/${id}`}
            currentHref={`/books/${id}/sub-books/${subBookId}`}
          />
          <Link
            href={`/books/${id}/sub-books/${subBookId}/sections/new`}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            + Add Section
          </Link>
        </div>

        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 text-5xl">📄</div>
            <h2 className="mb-2 text-lg font-medium text-zinc-800 dark:text-zinc-200">
              No sections yet
            </h2>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Add your first section to start organising your notes.
            </p>
            <Link
              href={`/books/${id}/sub-books/${subBookId}/sections/new`}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              + Add Section
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                href={`/books/${id}/sub-books/${subBookId}/sections/${section.id}`}
                backHref={`/books/${id}/sub-books/${subBookId}`}
              />
            ))}
          </div>
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
                  href={`/books/${id}/sub-books/${subBookId}/sections/${item.section_id}`}
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
