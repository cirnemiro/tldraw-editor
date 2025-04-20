// utils/utils.ts

export function convertSvgToBase64Image(svgElement: SVGSVGElement) {
  const svgData = new XMLSerializer().serializeToString(svgElement)

  // Codificamos el SVG como base64 para evitar problemas de seguridad (tainted canvas)
  const base64 = btoa(unescape(encodeURIComponent(svgData)))
  const dataUrl = `data:image/svg+xml;base64,${base64}`

  const img = new Image()

  img.onload = () => {
    const width = img.width || 800
    const height = img.height || 600

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      console.error('❌ No se pudo obtener el contexto 2D del canvas.')
      return
    }

    ctx.drawImage(img, 0, 0, width, height)

    try {
      const base64Image = canvas.toDataURL('image/jpeg')
      console.log(
        '✅ Imagen base64 generada:',
        base64Image.slice(0, 100) + '...'
      )
      sendToOpenAI(base64Image)
    } catch (error) {
      console.error('❌ Error al generar el base64 del canvas:', error)
    }
  }

  img.onerror = () => {
    console.error('❌ Error cargando la imagen SVG como base64.')
  }

  img.src = dataUrl
}

export async function sendToOpenAI(base64Image: string) {
  const prompt = `Convierte esta imagen en un documento HTML semántico. Usa etiquetas como <h1>, <p>, <section>, etc. No incluyas estilos ni scripts.`

  try {
    const response = await fetch('/api/generate-html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        prompt,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Error en respuesta de OpenAI:', errorData)
      return
    }

    const result = await response.json()
    console.log('✅ HTML generado por OpenAI:', result.html)
  } catch (err) {
    console.error('❌ Error al enviar a OpenAI:', err)
  }
}
