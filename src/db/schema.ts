import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const sketches = sqliteTable('sketches', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  content: text('content'),
  done: integer('done').default(0).notNull(),
})
