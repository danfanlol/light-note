export type Book = {
  id: string
  title: string
  author: string | null
  description: string | null
  cover_url: string | null
  has_sub_books: boolean
  created_at: string
  updated_at: string
}

export type SubBook = {
  id: string
  book_id: string
  title: string
  order_index: number
  created_at: string
}

export type Section = {
  id: string
  book_id: string | null
  sub_book_id: string | null
  title: string
  order_index: number
  created_at: string
}

export type Note = {
  id: string
  section_id: string
  content: string
  tags: string[] | null
  created_at: string
  updated_at: string
}

export type Passage = {
  id: string
  section_id: string
  content: string
  main_idea: string | null
  notes: string | null
  created_at: string
}
