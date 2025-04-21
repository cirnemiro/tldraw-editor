export const svgToBase64 = async (
  svg: string | undefined
): Promise<string | undefined> => {
  if (!svg) return undefined
  const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width || 512
      canvas.height = img.height || 512
      const ctx = canvas.getContext('2d')

      if (!ctx) return reject('No se pudo obtener el contexto 2D del canvas.')

      ctx.drawImage(img, 0, 0)
      const base64 = canvas.toDataURL('image/png')
      URL.revokeObjectURL(url)
      resolve(base64)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject('Error cargando el SVG como imagen.')
    }

    img.src = url
  })
}
