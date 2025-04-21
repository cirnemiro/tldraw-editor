'use client'

import { trpc } from '@/app/_trpc/client'
import { GenerateSketchForm } from '@/modules/sketch/components/GenerateSketchForm'
import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useParams } from 'next/navigation'

import { useSketchEditorMount } from '@/modules/sketch/hooks/useSketchEditorMount'

export default function EditorPage() {
  const { slug } = useParams()

  const {
    data: sketch,
    isLoading,
    error,
  } = trpc.getSketchById.useQuery(typeof slug === 'string' ? slug : '', {
    enabled: !!slug,
  })

  const { handleMount } = useSketchEditorMount(sketch)

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
