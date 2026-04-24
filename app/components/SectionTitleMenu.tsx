'use client'

import { useRef, useState, useEffect } from 'react'
import { deleteSection, renameSection } from '@/app/actions/sections'

export default function SectionTitleMenu({
  sectionId,
  title,
  backHref,
  currentHref,
}: {
  sectionId: string
  title: string
  backHref: string
  currentHref: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(title)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setRenaming(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (renaming) {
      setRenameValue(title)
      inputRef.current?.select()
    }
  }, [renaming])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setConfirming(false)
        setRenaming(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Delete confirmation modal */}
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
                This will permanently delete &ldquo;{title}&rdquo; and all its passages.
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
              <form action={deleteSection.bind(null, sectionId, backHref)}>
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

      <div className="group relative flex items-center gap-2" ref={containerRef}>
        {renaming ? (
          <form action={renameSection.bind(null, sectionId, currentHref)} className="flex items-center gap-2">
            <input
              ref={inputRef}
              name="title"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              required
              style={{ width: `${Math.max(renameValue.length, 1)}ch` }}
              className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 bg-transparent border-b-2 border-zinc-400 dark:border-zinc-500 outline-none focus:border-zinc-700 dark:focus:border-zinc-300 transition-colors min-w-0"
            />
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shrink-0"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setRenaming(false)}
              className="rounded-md border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors shrink-0"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors group-hover:bg-zinc-200/60 dark:group-hover:bg-zinc-800/60">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md w-7 h-7 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-300/60 dark:hover:text-zinc-200 dark:hover:bg-zinc-700/60 transition-all"
                aria-label="Section options"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="3" cy="8" r="1.5" />
                  <circle cx="8" cy="8" r="1.5" />
                  <circle cx="13" cy="8" r="1.5" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute top-full left-0 mt-1 z-10 min-w-[180px] rounded-lg border border-zinc-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => { setRenaming(true); setMenuOpen(false) }}
                    className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Rename
                  </button>
                  <div className="border-t border-zinc-100 dark:border-zinc-800" />
                  <button
                    type="button"
                    onClick={() => { setConfirming(true); setMenuOpen(false) }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Delete Section
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
