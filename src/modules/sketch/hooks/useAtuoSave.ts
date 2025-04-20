import { useEffect } from 'react'
import debounce from 'lodash.debounce'
import { trpc } from '@/app/_trpc/client'

export const useAutoSave = (id: number, content: string) => {
  const mutation = trpc.updateSketch.useMutation()

  const debouncedSave = debounce((content: string) => {
    mutation.mutate({ id, content })
  }, 1000)

  useEffect(() => {
    if (id) debouncedSave(content)
    return () => debouncedSave.cancel()
  }, [content])
}
