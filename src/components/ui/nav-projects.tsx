'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { trpc } from '@/app/_trpc/client'
import Link from 'next/link'
import { Sketch } from '@/modules/sketch/domain/schemas'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export function NavProjects() {
  const { data: sketches } = trpc.getSketches.useQuery()
  const pathname = usePathname()

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem
          className={clsx({ 'bg-muted text-primary': pathname === '/' })}
        >
          <SidebarMenuButton asChild>
            <Link href='/'>Dashboard</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {sketches?.map((sketch: Sketch) => {
          const isActive = pathname === `/editor/${sketch.id}`

          return (
            <SidebarMenuItem
              key={sketch.id}
              className={clsx({ 'bg-muted text-primary': isActive })}
            >
              <SidebarMenuButton asChild>
                <Link href={`/editor/${sketch.id}`}>
                  <span>{sketch.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
