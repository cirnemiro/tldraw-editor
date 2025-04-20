// src/server/api/root.ts
import { publicProcedure, router } from './trpc'
import { db } from '../db'
import { sketches } from '@/db/schema'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

export const appRouter = router({
  getSketches: publicProcedure.query(async () => {
    return await db.select().from(sketches).all()
  }),

  addSketch: publicProcedure
    .input(z.object({ name: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .insert(sketches)
        .values({
          content: input.content,
          name: input.name,
          done: 0,
        })
        .run()
    }),

  updateSketch: publicProcedure
    .input(z.object({ id: z.number(), content: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .update(sketches)
        .set({ content: input.content })
        .where(eq(sketches.id, input.id))
        .run()
    }),
})

export type AppRouter = typeof appRouter
