import { z } from 'zod'

export type SketchFormTypes = {
  prompt: string
  image: string | null
}

export const createSketchFormSchema = z.object({
  name: z.string().min(1, {
    message: 'El nombre es requerido',
  }),
})

export type CreateSketchFormSchema = z.infer<typeof createSketchFormSchema>
