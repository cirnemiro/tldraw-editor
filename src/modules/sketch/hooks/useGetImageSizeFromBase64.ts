export const getImageSizeFromBase64 = (
  base64: string
): Promise<{ width: number; height: number }> => {
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
