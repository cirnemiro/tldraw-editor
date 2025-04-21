'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

type SketchCardPreviewProps = {
  sketch: {
    id: string
    name: string
    content: string
    preview: string
  }
}

export function SketchCardPreview({ sketch }: SketchCardPreviewProps) {
  const router = useRouter()
  return (
    <Card
      className='overflow-hidden shadow-sm border w-[300px] cursor-pointer'
      onClick={() => router.push(`/editor/${sketch.id}`)}
    >
      <div className='relative w-full h-[200px] bg-muted'>
        <Image
          src={sketch.preview}
          alt={sketch.name}
          fill
          className='object-cover'
        />
      </div>
      <CardContent className='text-sm font-medium p-2 truncate'>
        {sketch.name}
      </CardContent>
    </Card>
  )
}
