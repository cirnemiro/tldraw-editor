import { z } from 'zod'

export const createSketchFormSchema = z.object({
  name: z.string().min(1, {
    message: 'El nombre es requerido',
  }),
})

export const generateSketchFormSchema = z.object({
  prompt: z.string().min(1, {
    message: 'El promp es requerido',
  }),
})

export const sketchSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string().nullable(),
  done: z.number(),
  preview: z.string().nullable(),
})

export const updateSketchInput = sketchSchema.pick({
  id: true,
  content: true,
  preview: true,
})

export type Sketch = z.infer<typeof sketchSchema>
export type UpdateSketchInput = z.infer<typeof updateSketchInput>
export type CreateSketchFormSchema = z.infer<typeof createSketchFormSchema>
export type GenerateSketchFormSchema = z.infer<typeof generateSketchFormSchema>
