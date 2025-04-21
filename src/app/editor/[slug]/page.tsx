'use client'

import { useRef, useCallback } from 'react'
import { trpc } from '@/app/_trpc/client'
import { GenerateSketchForm } from '@/modules/sketch/components/GenerateSketchForm'
import { Editor, Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import debounce from 'lodash/debounce'
import { useParams } from 'next/navigation'
import { getSnapshot, loadSnapshot } from '@tldraw/tldraw'

export default function EditorPage() {
  const { slug } = useParams()
  const editorRef = useRef<Editor | null>(null)

  const {
    data: sketch,
    isLoading,
    error,
  } = trpc.getSketchById.useQuery(typeof slug === 'string' ? slug : '', {
    enabled: !!slug,
  })

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

      const debouncedSave = debounce(() => {
        const snapshot = getSnapshot(editor.store)
        const content = JSON.stringify(snapshot)

        updateSketch.mutate({
          id: sketch?.id ?? '',
          content,
        })
        console.log('snapshot changeeeed', snapshot)
      }, 1000)

      const cleanup = editor.store.listen(() => {
        debouncedSave()
      })

      return () => {
        cleanup()
        debouncedSave.cancel()
      }
    },
    [sketch?.id, sketch?.content, updateSketch]
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading sketch</div>

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw onMount={handleMount}>
        <GenerateSketchForm />
      </Tldraw>
    </div>
  )
}
