'use client'

import { useEditor } from '@tldraw/tldraw'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, XIcon } from 'lucide-react'
import { useGetSelectedShape } from '../hooks/useGetSelectedShape'
import useGenerateAiSvg from '../hooks/useGenerateAiSketch'
import { toast } from 'sonner'
import { useFormik } from 'formik'
import { SketchFormTypes } from '../domain/schemas'

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

  const formik = useFormik<SketchFormTypes>({
    initialValues: {
      prompt: '',
      image: null,
    },
    validate: (values: SketchFormTypes) => {
      const errors: Record<string, string> = {}
      if (!values.prompt) errors.prompt = 'El promp es requerido'

      return errors
    },
    onSubmit: async (values: SketchFormTypes) => {
      const result = await handleGenerate(values)
      if (error) return toast.error(error)
      if (result && result.generatedImage) {
        setSelectedShape(result.generatedImage)
      }
    },
  })

  return (
    <div className='absolute bottom-2 right-2 z-999 w-[360px] space-y-4 rounded-2xl border border-gray-300 bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.4)]'>
      <div
        className='flex items-center justify-between cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='text-sm font-medium text-muted-foreground'>
          Generación de Sketches con IA
        </span>
        {isOpen ? (
          <ChevronDown className='w-4 h-4' />
        ) : (
          <ChevronUp className='w-4 h-4' />
        )}
      </div>

      {isOpen && (
        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='prompt'>Prompt</Label>
            <Input
              id='prompt'
              name='prompt'
              value={formik.values.prompt}
              onChange={formik.handleChange}
              placeholder='Escribe una idea...'
              error={formik.errors.prompt}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='shape-import'>Importar forma</Label>
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
                <img
                  src={selectedShape}
                  alt='Selected Shape'
                  className='w-full rounded-md object-contain'
                />
              </div>
            ) : (
              <div className='bg-gray-100 rounded-xl h-[100px] flex items-center justify-center'>
                <Button
                  onClick={handleExportSelection}
                  id='shape-import'
                  type='button'
                  variant='ghost'
                >
                  Importar forma
                </Button>
              </div>
            )}
          </div>

          <Button
            type='submit'
            disabled={formik.isSubmitting}
            className='w-full'
            variant='secondary'
          >
            {selectedShape ? 'Reconstruir Sketch' : 'Generar Sketch'}
          </Button>
        </form>
      )}
    </div>
  )
}
