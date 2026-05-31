'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { reorderBooks } from '@/app/actions/books'
import { Book } from '@/lib/database.types'

function BookCard({ book, dragging = false }: { book: Book; dragging?: boolean }) {
  return (
    <Link
      href={`/books/${book.id}`}
      draggable={false}
      className={`group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 block ${dragging ? 'shadow-xl scale-105 opacity-90' : ''}`}
      onClick={(e) => { if (dragging) e.preventDefault() }}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-xl dark:bg-zinc-800">
        📖
      </div>
      <h2 className="font-medium text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300 transition-colors">
        {book.title}
      </h2>
      {book.author && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{book.author}</p>
      )}
      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600">
        {new Date(book.created_at).toLocaleDateString()}
      </p>
    </Link>
  )
}

function SortableBookCard({ book }: { book: Book }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: book.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-0' : ''}`}
      {...attributes}
      {...listeners}
    >
      <BookCard book={book} />
    </div>
  )
}

export default function BookGrid({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState(initialBooks)
  const [activeBook, setActiveBook] = useState<Book | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveBook(books.find((b) => b.id === event.active.id) ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveBook(null)
    if (!over || active.id === over.id) return

    const oldIndex = books.findIndex((b) => b.id === active.id)
    const newIndex = books.findIndex((b) => b.id === over.id)
    const reordered = arrayMove(books, oldIndex, newIndex)
    setBooks(reordered)
    await reorderBooks(reordered.map((b) => b.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={books.map((b) => b.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <SortableBookCard key={book.id} book={book} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeBook && <BookCard book={activeBook} dragging />}
      </DragOverlay>
    </DndContext>
  )
}
