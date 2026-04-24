import Link from 'next/link'
import { getSectionsForSubBook } from '@/app/actions/sections'
import { getPassages } from '@/app/actions/passages'
import PassageCard from '@/app/components/PassageCard'
import SectionTitleMenu from '@/app/components/SectionTitleMenu'

export default async function SubBookSectionPage({
  params,
}: {
  params: Promise<{ id: string; subBookId: string; sectionId: string }>
}) {
  const { id, subBookId, sectionId } = await params

  const [sections, passages] = await Promise.all([
    getSectionsForSubBook(subBookId),
    getPassages(sectionId),
  ])

  const section = sections.find((s) => s.id === sectionId)

  if (!section) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Section not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <Link
          href={`/books/${id}/sub-books/${subBookId}`}
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← Back
        </Link>

        <div className="flex items-center justify-between mb-10 mt-6">
          <SectionTitleMenu
            sectionId={sectionId}
            title={section.title}
            backHref={`/books/${id}/sub-books/${subBookId}`}
            currentHref={`/books/${id}/sub-books/${subBookId}/sections/${sectionId}`}
          />
          <Link
            href={`/books/${id}/sub-books/${subBookId}/sections/${sectionId}/passages/new`}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            + Add Passage
          </Link>
        </div>

        {passages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 text-5xl">✍️</div>
            <h2 className="mb-2 text-lg font-medium text-zinc-800 dark:text-zinc-200">
              No passages yet
            </h2>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Add your first passage to start taking notes.
            </p>
            <Link
              href={`/books/${id}/sub-books/${subBookId}/sections/${sectionId}/passages/new`}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              + Add Passage
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {passages.map((passage) => (
              <PassageCard key={passage.id} passage={passage} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
