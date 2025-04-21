'use client'
import { trpc } from './_trpc/client'
import { Separator } from '@radix-ui/react-separator'

import { SketchCardPreview } from '@/modules/sketch/components/SketcPreview'
import { CreateSketchDialog } from '@/modules/dashboard/components/CreateSketchDialog'

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
      <div className='w-full overflow-x-auto'>
        <div className='flex gap-4 w-max'>
          {sketches?.map((sketch) => (
            <SketchCardPreview sketch={sketch} key={sketch.id} />
          ))}
        </div>
      </div>
      <Separator className='my-4' />
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Prompts</h1>
      </div>
    </div>
  )
}
