import Link from 'next/link'
import { createPassage } from '@/app/actions/passages'

export default async function NewPassageForSubBookPage({
  params,
}: {
  params: Promise<{ id: string; subBookId: string; sectionId: string }>
}) {
  const { id, subBookId, sectionId } = await params
  const backHref = `/books/${id}/sub-books/${subBookId}/sections/${sectionId}`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-6 py-12">

        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← Back
        </Link>

        <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Add a Passage
        </h1>

        <form action={createPassage.bind(null, sectionId, backHref)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Passage
            </label>
            <textarea
              id="content"
              name="content"
              required
              autoFocus
              rows={8}
              placeholder="Paste your passage here..."
              className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-800 transition resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Notes
              <span className="ml-2 text-xs font-normal text-zinc-400 dark:text-zinc-500">optional</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Add your explanatory notes..."
              className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-800 transition resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="main_idea" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Main idea
              <span className="ml-2 text-xs font-normal text-zinc-400 dark:text-zinc-500">optional</span>
            </label>
            <textarea
              id="main_idea"
              name="main_idea"
              rows={2}
              placeholder="What is the core idea of this passage?"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-800 transition resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Add Passage
          </button>
        </form>

      </div>
    </div>
  )
}
