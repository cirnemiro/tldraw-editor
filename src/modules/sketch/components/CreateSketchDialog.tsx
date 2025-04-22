import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateSketchForm } from '@/modules/sketch/components/CreateSketchForm'

export function CreateSketchDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='mt-4'>Create Sketch</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className='text-lg font-bold'>Create Sketch</DialogTitle>
        <CreateSketchForm />
      </DialogContent>
    </Dialog>
  )
}
