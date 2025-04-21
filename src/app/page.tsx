'use client'
import { Button } from '@/components/ui/button'
import { trpc } from './_trpc/client'
import { Separator } from '@radix-ui/react-separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateSketchForm } from '@/modules/sketch/components/CreateSketchForm'
import { SketchCardPreview } from '@/modules/sketch/components/SketcPreview'

export default function Page() {
  const { data: sketches, isLoading, error } = trpc.getSketches.useQuery()

  console.log(sketches)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Sketches</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='mt-4'>Create Sketch</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className='text-lg font-bold'>
              Create Sketch
            </DialogTitle>
            <CreateSketchForm />
          </DialogContent>
        </Dialog>
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className='mt-4'>Create Prompt</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className='text-lg font-bold'>
              Create Sketch
            </DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>
              Create a new sketch by providing a name and description.
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
      <ul>
        {sketches?.map((sketch) => (
          <li key={sketch.id}>{sketch.name}</li>
        ))}
      </ul>
    </div>
  )
}
