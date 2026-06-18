'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Croissant,
  FolderTree,
  Languages,
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  SquareArrowOutUpRight,
  Store,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/sonner'
import WheatMark from '@/components/menu/wheat-mark'
import { logoutAction } from '@/app/login/actions'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/items', label: 'Items', icon: Croissant },
  { href: '/dashboard/categories', label: 'Categories', icon: FolderTree },
  { href: '/dashboard/acts', label: 'Chapters', icon: Layers },
  { href: '/dashboard/branches', label: 'Branches', icon: MapPin },
  { href: '/dashboard/brand', label: 'Brand & Settings', icon: Store },
  { href: '/dashboard/strings', label: 'UI Strings', icon: Languages },
] as const

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 py-1.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-500">
              <WheatMark className="h-5 w-auto text-white" />
            </span>
            <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">Altazaj Bakery</span>
              <span className="text-xs text-muted-foreground">Menu admin</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="View live menu">
                <a href="/" target="_blank" rel="noreferrer">
                  <SquareArrowOutUpRight />
                  <span>View live menu</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <form action={logoutAction} className="w-full">
                <SidebarMenuButton asChild tooltip="Sign out">
                  <button type="submit" className="w-full">
                    <LogOut />
                    <span>Sign out</span>
                  </button>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Menu dashboard</span>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
        <Toaster richColors position="top-right" />
      </SidebarInset>
    </SidebarProvider>
  )
}
