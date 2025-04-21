import type { Metadata } from 'next'
import './globals.css'
import Provider from '@/app/_trpc/Provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Sketch app',
  description: 'Generate sketches from text prompts and edit them',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='flex h-screen w-screen overflow-hidden'>
        <Provider>
          <SidebarProvider>
            <AppSidebar />
            <main className='flex-1 overflow-auto p-4'>{children}</main>
            <Toaster richColors position='top-center' />
          </SidebarProvider>
        </Provider>
      </body>
    </html>
  )
}
