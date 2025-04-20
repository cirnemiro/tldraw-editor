// app/api/generate-html/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { image, prompt } = await req.json()

  if (!image || !prompt) {
    return NextResponse.json(
      { error: 'Missing image or prompt' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  prompt ||
                  'Convierte esta imagen en código HTML representando su estructura visual.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: image, // Aquí debe estar el data:image/jpeg;base64,...
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    })

    const data = await response.json()

    // ✅ MOSTRAR TODA LA RESPUESTA para debug
    console.log('OpenAI response:', JSON.stringify(data, null, 2))

    const html = data?.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ html })
  } catch (error) {
    console.error('Error from OpenAI:', error)
    return NextResponse.json(
      { error: 'Failed to call OpenAI API' },
      { status: 500 }
    )
  }
}
