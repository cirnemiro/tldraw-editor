// app/sketch/page.tsx (o donde esté tu archivo)
import Editor from '@/modules/sketch'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

export default function SketchPage() {
  return (
    <main className=''>
      <Editor />
    </main>
  )
}
