'use client'

import { useState, useMemo } from 'react'
import SectionCard from './SectionCard'
import { Section, Passage } from '@/lib/database.types'

export default function SectionSearchFilter({
  sections,
  passages,
  bookId,
}: {
  sections: Section[]
  passages: Passage[]
  bookId: string
}) {
  const [query, setQuery] = useState('')

  const passagesBySectionId = useMemo(() => {
    const map: Record<string, Passage[]> = {}
    for (const p of passages) {
      if (!map[p.section_id]) map[p.section_id] = []
      map[p.section_id].push(p)
    }
    return map
  }, [passages])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return sections
    return sections.filter((section) => {
      if (section.title.toLowerCase().includes(q)) return true
      const sectionPassages = passagesBySectionId[section.id] ?? []
      return sectionPassages.some(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          (p.main_idea ?? '').toLowerCase().includes(q) ||
          (p.notes ?? '').toLowerCase().includes(q)
      )
    })
  }, [query, sections, passagesBySectionId])

  return (
    <>
      <div className="relative mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
        >
          <path
            d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708L9.31 10.016Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder="Search passages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No sections match &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              href={`/books/${bookId}/sections/${section.id}`}
              backHref={`/books/${bookId}`}
            />
          ))}
        </div>
      )}
    </>
  )
}
