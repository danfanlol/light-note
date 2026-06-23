'use client'

import { useState } from 'react'
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
import { reorderSubBooks } from '@/app/actions/sub-books'
import { SubBook } from '@/lib/database.types'
import SubBookCard from './SubBookCard'

function SortableSubBookCard({ subBook, bookId }: { subBook: SubBook; bookId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: subBook.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-0' : ''}`}
      {...attributes}
      {...listeners}
    >
      <SubBookCard subBook={subBook} bookId={bookId} />
    </div>
  )
}

export default function SubBookGrid({ initialSubBooks, bookId }: { initialSubBooks: SubBook[]; bookId: string }) {
  const [subBooks, setSubBooks] = useState(initialSubBooks)
  const [activeSubBook, setActiveSubBook] = useState<SubBook | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveSubBook(subBooks.find((s) => s.id === event.active.id) ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveSubBook(null)
    if (!over || active.id === over.id) return

    const oldIndex = subBooks.findIndex((s) => s.id === active.id)
    const newIndex = subBooks.findIndex((s) => s.id === over.id)
    const reordered = arrayMove(subBooks, oldIndex, newIndex)
    setSubBooks(reordered)
    await reorderSubBooks(bookId, reordered.map((s) => s.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={subBooks.map((s) => s.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subBooks.map((subBook) => (
            <SortableSubBookCard key={subBook.id} subBook={subBook} bookId={bookId} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeSubBook && <SubBookCard subBook={activeSubBook} bookId={bookId} dragging />}
      </DragOverlay>
    </DndContext>
  )
}
