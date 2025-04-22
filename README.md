# 🧠 Sketch Editor with AI & Real-Time Collaboration

> A powerful sketching application built with **Next.js 15**, **tRPC**, **Drizzle ORM**, and **Tldraw v2**, featuring real-time drawing, AI-based shape generation, auto-saving, and a modular architecture optimized for scalability.

---

## 🚀 Tech Stack

| Technology       | Purpose                                |
| ---------------- | -------------------------------------- |
| **Next.js 15**   | App Router, layout system              |
| **tRPC**         | Type-safe API                          |
| **Drizzle ORM**  | Modern SQL ORM for SQLite/PostgreSQL   |
| **Tldraw v2**    | Real-time drawing engine               |
| **Tailwind CSS** | Utility-first styling framework        |
| **ShadCN/UI**    | Beautiful, accessible React components |
| **Zod**          | Schema validation and type inference   |
| **OpenAI**       | AI-powered SVG generation from prompts |

---

## ✨ Features

### 📝 Sketch Editor

- Embedded `Tldraw` canvas at `/editor/[id]`
- Supports:
  - Free drawing and shape creation
  - Snapshot-based storage via `getSnapshot` & `loadSnapshot`
  - Auto-saving using debounce
  - Live Base64 image preview generation
  - tRPC mutation updates content and preview

---

### 🤖 AI-Powered Sketch Generation

- 🧠 Form integrated into the editor page
- Accepts text **prompt** to describe the shape
- Accepts image **prompt** to describe/redo the shape
- Uses `svgToBase64()` utility for rendering
- Shape is rendered and imported directly into Tldraw canvas
- Form built with `react-hook-form`, `zod`, and `shadcn/ui`

---

### 💾 Smart Autosave

- ⏱️ Snapshot saving is **debounced every 1 second** on canvas changes
- 🖼️ A **base64 preview image** is automatically generated from the current selection
- 🧠 Uses `editor.getSvgString()` from Tldraw to generate the preview
- 🪄 Fully integrated with `tRPC` to update the sketch content and preview in real-time
- 🧩 Wrapped in a custom hook for clean integration in the editor logic

---

### 🔌 tRPC + React Query Integration

- 🌐 Connects to backend procedures via `/api/trpc/{procedureName}`
- 🔒 Fully **type-safe** client-server communication
- ♻️ Seamless caching, loading, and mutations via React Query
- 🧩 Wrapped in a custom provider for easy integration across the app

## 🛠️ Getting Started

Follow these steps to get the project up and running locally:

### 1. 📦 Install Dependencies

Use [pnpm](https://pnpm.io/) for dependency management:

```bash
pnpm install
```

### 2. 🧱 Initialize the Drizzle Database

Init [drizzle](https://orm.drizzle.team/docs/get-started-sqlite) database instance

```bash
pnpm drizzle-kit generate  # Generate Drizzle client + migrations
pnpm drizzle-kit push      # Push schema to the database
```

### 3. 🚀 Start the Development Server

Run the Next.js development server:

```bash
pnpm dev
```

### 4. 🔑 Connect your OpenAI Secret

To unlock the AI-powered SVG generator, you need to add your OpenAI API key to your environment variables.

#### 🛠️ Steps

1. Create a `.env` file in the root of the project (if it doesn't exist).
2. Add the following line to the file:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
