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
              text: `Basándote en esta imagen y en el prompt: "${prompt}", genera un SVG autocontenible usando <svg>, <rect>, <circle>, <line>, <text>. No incluyas explicaciones, solo el SVG.`,
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
          content: `Genera un SVG autocontenible que represente esta escena: "${prompt}". Usa <svg>, <rect>, <circle>, <line>, <text>. No incluyas explicaciones, solo el SVG.`,
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

    // Extraemos solo el contenido <svg>...</svg> en caso de que venga con ```xml o texto extra
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
