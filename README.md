🧠 Sketch Editor with AI & Real-Time Collaboration
A powerful sketching application built with Next.js 14, tRPC, Drizzle ORM, and Tldraw v2, featuring real-time drawing, AI-based shape generation, auto-saving, and a modular architecture optimized for scalability.

🚀 Tech Stack

Technology Purpose
Next.js 14 (App Router) SSR, routing, layout system
tRPC Type-safe API layer without REST overhead
Drizzle ORM Modern SQL ORM for SQLite or PostgreSQL
NeonDB Serverless PostgreSQL hosting (used in production)
Tldraw v2 Real-time collaborative sketch editor
Tailwind CSS Utility-first styling framework
ShadCN/UI Accessible and beautiful React components
Zod Schema validation and type inference
Vercel Instant deploys with serverless support
✨ Features
📝 Sketch Editor (Tldraw)
Embedded Tldraw canvas at /editor/[id]

Supports:

Free drawing and shape creation

Importing/exporting shapes

Snapshot-based storage with getSnapshot and loadSnapshot

Auto-saving using debounce logic

Live preview thumbnail generation (Base64 PNG)

Syncs with database via tRPC mutation

🤖 AI-Powered Sketch Generation
Custom sidebar tool: "Sketch Generation with AI"

Accepts a text prompt

Calls your AI API to generate an SVG image

Renders the SVG on canvas automatically

Allows re-generating or clearing the shape selection

Fully integrated with react-hook-form and Zod validation

📚 Project Structure
bash
Copia
Modifica
/src
/modules
/sketch
/components → Forms, canvas UI, buttons
/hooks → Editor mount, autosave, selection handlers
/domain → Zod schemas and types
/utils → SVG converters (e.g., SVG to Base64)
/db
schema.ts → Drizzle schema definition
/app
/editor/[id] → Sketch editor route
/dashboard → List of all sketches
🧪 Other Features
Sketch metadata is stored in Drizzle + NeonDB

Each sketch has:

id (UUID)

name

content (Tldraw snapshot)

done (status)

preview (Base64 image)

Sidebar with dynamic navigation based on existing sketches

Routes are validated via params and conditional redirection

Form system using shadcn/ui + react-hook-form + zod
