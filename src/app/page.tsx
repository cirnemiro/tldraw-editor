'use client'
import { trpc } from './_trpc/client'

import { SketchCardPreview } from '@/modules/sketch/components/SketcPreview'
import { CreateSketchDialog } from '@/modules/sketch/components/CreateSketchDialog'

export default function Page() {
  const { data: sketches, isLoading, error } = trpc.getSketches.useQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Sketches</h1>
        <CreateSketchDialog />
      </div>
      <div className='w-full '>
        <div className='flex flex-wrap gap-4 p-6'>
          {sketches?.map((sketch) => (
            <SketchCardPreview sketch={sketch} key={sketch.id} />
          ))}
        </div>
      </div>
    </div>
  )
}
