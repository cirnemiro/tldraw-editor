'use client'

import { Tldraw, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback, useState } from 'react'
import { convertSvgToBase64Image } from './utils/utils'

function ExportButton() {
  const editor = useEditor()

  const handleExportSelection = useCallback(async () => {
    const selectedIds = editor.getSelectedShapeIds()

    if (selectedIds.length === 0) {
      alert('No hay formas seleccionadas.')
      return
    }

    const svgElement = await editor.getSvgElement(
      editor.getSelectedShapeIds(),
      {
        background: true,
      }
    )
    if (!svgElement) {
      alert('Error al generar el SVG.')
      return
    }
    convertSvgToBase64Image(svgElement.svg)
  }, [editor])

  return (
    <button
      onClick={handleExportSelection}
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        padding: '0.5rem 1rem',
        zIndex: 9999,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      Exportar selección
    </button>
  )
}

function TextInput() {
  const [textsearch, setTextSearch] = useState('')
  const editor = useEditor()

  const handleGenerate = async () => {
    if (!textsearch.trim()) return

    try {
      const response = await fetch('/api/generate-svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: textsearch }),
      })

      if (!response.ok) {
        console.error('Error al generar el SVG:', response.statusText)
        return
      }

      const { svg } = await response.json()

      if (!svg) {
        alert('OpenAI no generó un SVG válido.')
        return
      }

      // Convertimos SVG a una imagen base64 usando <canvas>
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()

      img.onload = async () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width || 512
        canvas.height = img.height || 512
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          console.error('No se pudo obtener el contexto 2D del canvas.')
          return
        }

        ctx.drawImage(img, 0, 0)
        const base64Image = canvas.toDataURL('image/png')

        // Convertimos base64 a File para pasarlo a Tldraw
        const byteString = atob(base64Image.split(',')[1])
        const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }

        const blob = new Blob([ab], { type: mimeString })
        const file = new File([blob], 'sketch.png', { type: mimeString })

        // Crear asset y shape en Tldraw
        const asset = await editor.getAssetForExternalContent({
          type: 'file',
          file,
        })
        if (!asset) {
          console.error('No se pudo crear el asset en Tldraw.')
          return
        }

        editor.createAssets([asset])

        const center = editor.getViewportPageBounds().center
        editor.createShape({
          type: 'image',
          props: {
            assetId: asset.id,
            w: canvas.width,
            h: canvas.height,
          },
          x: center.x - canvas.width / 2,
          y: center.y - canvas.height / 2,
        })

        URL.revokeObjectURL(url)
      }

      img.onerror = () => {
        console.error('Error cargando el SVG generado.')
        URL.revokeObjectURL(url)
      }

      img.src = url
    } catch (error) {
      console.error('Error al generar o importar la imagen:', error)
    }
  }

  return (
    <div style={{ position: 'absolute', top: 60, right: 20, zIndex: 9999 }}>
      <input
        type='text'
        value={textsearch}
        onChange={(e) => setTextSearch(e.target.value)}
        placeholder='Escribe algo...'
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          marginRight: '0.5rem',
        }}
      />
      <button onClick={handleGenerate}>Go</button>
    </div>
  )
}

export default function EditorPage() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw>
        <ExportButton />
        <TextInput />
      </Tldraw>
    </div>
  )
}
