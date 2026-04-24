'use client'

import { useRef, useState, useEffect } from 'react'
import { updatePassage, deletePassage } from '@/app/actions/passages'
import { Passage } from '@/lib/database.types'

export default function PassageCard({ passage }: { passage: Passage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [content, setContent] = useState(passage.content)
  const [mainIdea, setMainIdea] = useState(passage.main_idea ?? '')
  const [notes, setNotes] = useState(passage.notes ?? '')
  const menuRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

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
    if (editing) contentRef.current?.focus()
  }, [editing])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setEditing(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleCancel() {
    setContent(passage.content)
    setMainIdea(passage.main_idea ?? '')
    setNotes(passage.notes ?? '')
    setEditing(false)
  }

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
              Delete passage?
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                This will permanently delete this passage and its notes.
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
              <form action={deletePassage.bind(null, passage.id)}>
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

    <div className="group relative rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      {/* Three-dots menu */}
      {!editing && (
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md w-7 h-7 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
            aria-label="Passage options"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="3" cy="8" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="13" cy="8" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 mt-1 z-10 min-w-[120px] rounded-lg border border-zinc-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
              <button
                type="button"
                onClick={() => { setEditing(true); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Edit
              </button>
              <div className="border-t border-zinc-100 dark:border-zinc-800" />
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
      )}

      {editing ? (
        <form
          action={async (formData) => {
            await updatePassage(passage.id, formData)
            setContent(formData.get('content') as string)
            setMainIdea((formData.get('main_idea') as string) ?? '')
            setNotes((formData.get('notes') as string) ?? '')
            setEditing(false)
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Passage</label>
            <textarea
              ref={contentRef}
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm leading-relaxed text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-700 transition resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Notes
              <span className="ml-1.5 font-normal text-zinc-400 dark:text-zinc-500">optional</span>
            </label>
            <textarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add explanatory notes..."
              className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm leading-relaxed text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-700 transition resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Main idea
              <span className="ml-1.5 font-normal text-zinc-400 dark:text-zinc-500">optional</span>
            </label>
            <textarea
              name="main_idea"
              value={mainIdea}
              onChange={(e) => setMainIdea(e.target.value)}
              rows={2}
              placeholder="What is the core idea of this passage?"
              className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm leading-relaxed text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-700 transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <blockquote className="border-l-2 border-zinc-300 pl-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-600 dark:text-zinc-300 whitespace-pre-wrap pr-8">
            {content}
          </blockquote>
          {notes && (
            <div className="mt-4 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-800">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Notes</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{notes}</p>
            </div>
          )}
          {mainIdea && (
            <div className="mt-3 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-800">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Main idea</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{mainIdea}</p>
            </div>
          )}
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">
            {new Date(passage.created_at).toLocaleDateString()}
          </p>
        </>
      )}
    </div>
    </>
  )
}
