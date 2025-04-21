import { Editor } from '@tldraw/tldraw'
import { useState } from 'react'
import { base64ToFile } from '../utils/converters/base64ToFile'
import { svgToBase64 } from '../utils/converters/svgToBase64'
import { getImageSizeFromBase64 } from './useGetImageSizeFromBase64'
import { GenerateSketchFormSchema } from '../domain/schemas'

export default function useGenerateAiSketch(editor: Editor) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleGenerate = async (
    values: GenerateSketchFormSchema & { image: string | null }
  ) => {
    if (!values.prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const { svg } = await res.json()

      if (!res.ok || !svg) {
        return setError('OpenAI no generó un SVG válido.')
      }

      const base64Image = await svgToBase64(svg)
      const { width, height } = await getImageSizeFromBase64(base64Image)
      const file = base64ToFile(base64Image, 'sketch.png')

      const asset = await editor.getAssetForExternalContent({
        type: 'file',
        file,
      })
      if (!asset) return setError('No se pudo crear el asset en Tldraw.')
      editor.deleteShapes(editor.getSelectedShapeIds())

      editor.createAssets([asset])

      const center = editor.getViewportPageBounds().center
      editor.createShape({
        type: 'image',
        props: {
          assetId: asset.id,
          w: width,
          h: height,
        },
        x: center.x - 256,
        y: center.y - 256,
      })

      return {
        generatedImage: base64Image,
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message ?? 'Error desconocido')
      } else {
        setError('Error desconocido')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { handleGenerate, isLoading, error }
}
