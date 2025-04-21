export const getImageSizeFromBase64 = (
  base64: string | undefined
): Promise<{ width: number; height: number }> => {
  if (!base64) return Promise.resolve({ width: 512, height: 512 })
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64

    img.onload = () => {
      resolve({
        width: img.naturalWidth || 512,
        height: img.naturalHeight || 512,
      })
    }

    img.onerror = reject
  })
}
