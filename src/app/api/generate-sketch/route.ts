import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, image } = await req.json()

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Prompt inválido.' }, { status: 400 })
  }

  const messages = image
    ? [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Eres un experto diseñador gráfico especializado en convertir imágenes en ilustraciones SVG minimalistas, limpias y semánticas. Tu estilo está basado en precisión geométrica y claridad visual. Tienes dominio avanzado de las etiquetas SVG: <svg>, <rect>, <circle>, <line> y <text>, y sabes cuándo usarlas para representar elementos visuales de forma eficaz. 

Basándote únicamente en la imagen proporcionada y en el siguiente prompt: "${prompt}", genera un SVG autocontenible que represente de forma precisa el contenido y estilo de la imagen. Utiliza únicamente etiquetas SVG válidas (<svg>, <rect>, <circle>, <line>, <text>) y atributos CSS inline si es necesario.

No añadas explicaciones, comentarios ni contenido adicional fuera del SVG.
`,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ]
    : [
        {
          role: 'user',
          content: `Eres el mejor ilustrador de SVGs, experto en crear gráficos vectoriales precisos, minimalistas y accesibles. Tienes gran dominio de etiquetas como <svg>, <rect>, <circle>, <line> y <text>, y sabes cómo usarlas para transmitir ideas visuales con claridad.

Genera un SVG autocontenible que represente fielmente esta escena: "${prompt}". Utiliza exclusivamente las etiquetas SVG mencionadas. No incluyas explicaciones, comentarios ni ningún texto adicional fuera del SVG.`,
        },
      ]

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages,
        max_tokens: 1000,
      }),
    })

    const data = await response.json()

    const rawSvg = data?.choices?.[0]?.message?.content || ''

    const svgMatch = rawSvg.match(/<svg[\s\S]*<\/svg>/i)
    const cleanSvg = svgMatch ? svgMatch[0] : ''

    if (!cleanSvg) {
      return NextResponse.json(
        { error: 'No se pudo generar SVG.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ svg: cleanSvg })
  } catch (error) {
    return NextResponse.json(
      { error: 'Fallo en la generación del SVG.', details: error },
      { status: 500 }
    )
  }
}
