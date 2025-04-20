'use client'

import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { GenerateSketchForm } from './components/GenerateSketchForm'

export default function EditorPage() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw>
        <GenerateSketchForm />
      </Tldraw>
    </div>
  )
}
