'use client'
import { Button } from '@/components/ui/button'
import { trpc } from './_trpc/client'

export default function Home() {
  const getSketches = trpc.getSketches.useQuery()
  const addSketch = trpc.addSketch.useMutation()
  console.log(getSketches.data)
  return (
    <div>
      my page
      <Button
        onClick={() => {
          addSketch.mutate({
            name: 'test',
            content: JSON.stringify({
              id: '1',
              appState: {},
              files: {},
              document: {
                id: '1',
                pages: {
                  'page-1': {
                    id: 'page-1',
                    name: 'Page 1',
                    shapes: {},
                    bindings: {},
                    appState: {},
                  },
                },
              },
            }),
          })
        }}
      >
        Add sketch
      </Button>
      <div>
        {getSketches.data?.map((sketch) => (
          <div key={sketch.id}>
            <h1>{sketch.content}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}
