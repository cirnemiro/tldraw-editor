import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const sketches = sqliteTable('sketches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  content: text('content').notNull(),
  done: integer('done').default(0).notNull(),
})
