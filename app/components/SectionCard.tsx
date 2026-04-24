'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { deleteSection } from '@/app/actions/sections'
import { Section } from '@/lib/database.types'

export default function SectionCard({
  section,
  href,
  backHref,
}: {
  section: Section
  href: string
  backHref: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setConfirming(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50"
          onMouseDown={() => setConfirming(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl p-6 mx-4"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              Delete section?
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                This will permanently delete &ldquo;{section.title}&rdquo; and all its passages.
              </span>{' '}
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <form action={deleteSection.bind(null, section.id, backHref)}>
                <button
                  type="submit"
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div
        className="group relative rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 transition-all cursor-pointer"
        onClick={() => router.push(href)}
      >
        {/* Three-dots menu */}
        <div
          ref={menuRef}
          className="absolute top-3 right-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md w-7 h-7 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
            aria-label="Section options"
          >
            <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
              <circle cx="2" cy="2" r="1.5" />
              <circle cx="2" cy="8" r="1.5" />
              <circle cx="2" cy="14" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 mt-1 z-10 min-w-[140px] rounded-lg border border-zinc-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
              <button
                type="button"
                onClick={() => { setConfirming(true); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-800 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-xl dark:bg-zinc-800">
          📑
        </div>
        <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
          {section.title}
        </h2>
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600">
          {new Date(section.created_at).toLocaleDateString()}
        </p>
      </div>
    </>
  )
}
