// src/server/api/root.ts
import { v4 as uuidv4 } from 'uuid'
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
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const id = uuidv4()
      const [createdSketch] = await db
        .insert(sketches)
        .values({
          id: id,
          name: input.name,
          done: 0,
        })
        .returning()

      return createdSketch
    }),

  getSketchById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const [sketch] = await db
      .select()
      .from(sketches)
      .where(eq(sketches.id, input))

    if (!sketch) {
      throw new Error('Sketch not found')
    }

    return sketch
  }),

  updateSketch: publicProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .update(sketches)
        .set({ content: input.content })
        .where(eq(sketches.id, input.id))
        .run()
    }),
})

export type AppRouter = typeof appRouter
