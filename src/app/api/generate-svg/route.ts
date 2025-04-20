import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Prompt inválido.' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Genera un SVG simple que represente esta escena: "${prompt}". 
              Usa <svg>, <rect>, <circle>, <line>, <text> y asegúrate que sea autocontenible. 
              No incluyas explicaciones, solo el código SVG válido.`,
          },
        ],
        temperature: 0.7,
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
    console.error('Error al generar SVG:', error)
    return NextResponse.json(
      { error: 'Fallo en la generación del SVG.' },
      { status: 500 }
    )
  }
}
