import { useCallback, useState } from 'react'
import { svgToBase64 } from '../utils/converters/svgToBase64'
import { Editor } from '@tldraw/tldraw'
import { toast } from 'sonner'

export const useGetSelectedShape = (editor: Editor) => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<null | string>(null)

  const handleExportSelection = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const selectedIds = editor.getSelectedShapeIds()

    if (selectedIds.length === 0) {
      console.log('No hay formas seleccionadas.')

      toast.error('No hay formas seleccionadas.')
      return
    }

    const svgElement = await editor.getSvgString(editor.getSelectedShapeIds(), {
      background: true,
    })
    if (!svgElement) {
      return setError('Error al generar el SVG.')
    }

    const base64image = await svgToBase64(svgElement.svg)
    setSelectedShape(base64image)
    console.log('svgstring', base64image)
  }, [editor])

  const deleteSelectedShape = () => {
    setSelectedShape(null)
  }

  return {
    selectedShape,
    deleteSelectedShape,
    setSelectedShape,
    handleExportSelection,
    isLoading,
    error,
  }
}
