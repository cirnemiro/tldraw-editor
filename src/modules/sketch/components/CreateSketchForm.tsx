'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createSketchFormSchema } from '../domain/schemas'
import { trpc } from '@/app/_trpc/client'
import { useRouter } from 'next/navigation'

export function CreateSketchForm() {
  const router = useRouter()
  const addSketch = trpc.addSketch.useMutation()
  const form = useForm({
    resolver: zodResolver(createSketchFormSchema),
    defaultValues: {
      name: '',
    },
  })
  const onSubmit = async (data: z.infer<typeof createSketchFormSchema>) => {
    const sketch = await addSketch.mutateAsync(data)
    console.log(sketch)

    router.push('/editor/' + sketch.id)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sketch name</FormLabel>
              <FormControl>
                <Input placeholder='Write a name for your sketch' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Crete</Button>
      </form>
    </Form>
  )
}
