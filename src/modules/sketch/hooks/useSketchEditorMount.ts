import { useCallback, useRef } from 'react'
import { Editor, TLShape, getSnapshot, loadSnapshot } from '@tldraw/tldraw'
import debounce from 'lodash/debounce'
import { svgToBase64 } from '@/modules/sketch/utils/converters/svgToBase64'
import { trpc } from '@/app/_trpc/client'
import { Sketch } from '../domain/schemas'

export function useSketchEditorMount(sketch: Sketch | undefined) {
  const editorRef = useRef<Editor | null>(null)
  const utils = trpc.useUtils()

  const updateSketch = trpc.updateSketch.useMutation({
    onSuccess: () => {
      if (sketch?.id) {
        utils.getSketchById.invalidate(sketch.id)
      }
    },
  })

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor

      if (sketch?.content) {
        const snapshot = JSON.parse(sketch.content)
        loadSnapshot(editor.store, snapshot)
      }

      const debouncedSave = debounce(async () => {
        const snapshot = getSnapshot(editor.store)
        const content = JSON.stringify(snapshot)

        const shapeIds = Array.from(editor.getCurrentPageShapeIds())
        const shapes = shapeIds
          .map((id) => editor.getShape(id))
          .filter((shape): shape is TLShape => shape !== undefined)

        const result = await editor.getSvgString(shapes, {
          background: true,
          padding: 32,
        })

        const base64PreviewImage = await svgToBase64(result?.svg)

        updateSketch.mutate({
          id: sketch?.id ?? '',
          content,
          preview: base64PreviewImage ?? null,
        })
      }, 1000)

      const cleanup = editor.store.listen(() => {
        debouncedSave()
      })

      return () => {
        cleanup()
        debouncedSave.cancel()
      }
    },
    [sketch, updateSketch]
  )

  return { handleMount, editorRef }
}
