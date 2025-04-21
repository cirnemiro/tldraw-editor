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
    if (base64image) {
      setSelectedShape(base64image)
    } else {
      setError('Error al convertir el SVG a Base64.')
    }
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
