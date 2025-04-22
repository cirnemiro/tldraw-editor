'use client'

import { useEditor } from '@tldraw/tldraw'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, XIcon } from 'lucide-react'
import { useGetSelectedShape } from '../hooks/useGetSelectedShape'
import useGenerateAiSvg from '../hooks/useGenerateAiSketch'
import { toast } from 'sonner'
import {
  GenerateSketchFormSchema,
  generateSketchFormSchema,
} from '../domain/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Form } from '@/components/ui/form' // Este es el de shadcn
import Image from 'next/image'

export function GenerateSketchForm() {
  const [isOpen, setIsOpen] = useState(false)
  const editor = useEditor()
  const {
    selectedShape,
    handleExportSelection,
    deleteSelectedShape,
    setSelectedShape,
  } = useGetSelectedShape(editor)
  const { handleGenerate, error } = useGenerateAiSvg(editor)

  const form = useForm({
    resolver: zodResolver(generateSketchFormSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const onSubmit = async (data: GenerateSketchFormSchema) => {
    const result = await handleGenerate({
      ...data,
      image: selectedShape || null,
    })

    if (error) return toast.error(error)
    if (result && result.generatedImage) {
      setSelectedShape(result.generatedImage)
    }
  }

  return (
    <div className='absolute bottom-2 right-2 z-999 w-[360px] space-y-4 rounded-2xl border border-gray-300 bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.4)]'>
      <div
        className='flex items-center justify-between cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='text-sm font-medium text-muted-foreground'>
          SVG Generation using AI
        </span>
        {isOpen ? (
          <ChevronDown className='w-4 h-4' />
        ) : (
          <ChevronUp className='w-4 h-4' />
        )}
      </div>

      {isOpen && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='prompt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Write an idea...' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <FormLabel htmlFor='shape-import'>Import shape</FormLabel>
              {selectedShape ? (
                <div className='relative rounded-md'>
                  <Button
                    onClick={deleteSelectedShape}
                    className='absolute top-1 right-1 bg-white'
                    type='button'
                    variant='ghost'
                  >
                    <XIcon className='w-4 h-4' />
                  </Button>
                  <Image
                    src={selectedShape}
                    alt='Selected Shape'
                    className='w-full rounded-md object-contain'
                    width={500}
                    height={500}
                  />
                </div>
              ) : (
                <div className='bg-gray-100 rounded-xl h-[100px] flex items-center justify-center'>
                  <Button
                    onClick={handleExportSelection}
                    id='shape-import'
                    type='button'
                    variant='secondary'
                  >
                    Import
                  </Button>
                </div>
              )}
            </div>

            <Button
              disabled={form.formState.isSubmitting}
              type='submit'
              className='w-full'
            >
              {form.formState.isSubmitting
                ? 'Generating...'
                : selectedShape
                ? 'Rebuild Sketch'
                : 'Generate Sketch'}
              {}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
