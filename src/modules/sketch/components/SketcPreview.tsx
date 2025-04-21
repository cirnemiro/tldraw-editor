'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Sketch } from '../domain/schemas'

type SketchCardPreviewProps = {
  sketch: Sketch
}

export function SketchCardPreview({ sketch }: SketchCardPreviewProps) {
  const router = useRouter()
  return (
    <Card
      className='overflow-hidden shadow-sm border w-[300px] cursor-pointer'
      onClick={() => router.push(`/editor/${sketch.id}`)}
    >
      <div className='relative w-full h-[200px] bg-muted'>
        {sketch.preview === null ? (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            No Preview Available
          </div>
        ) : (
          <Image
            src={sketch.preview}
            alt={sketch.name}
            fill
            className='object-cover'
          />
        )}
      </div>
      <CardContent className='text-sm font-medium p-2 truncate'>
        {sketch.name}
      </CardContent>
    </Card>
  )
}
