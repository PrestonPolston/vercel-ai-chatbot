import * as React from 'react'

import Image from 'next/image'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import { IconSeparator } from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { cookies } from 'next/headers'

export async function Header() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  return (
     <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : null}

        <div className="flex-1 text-center">
          <Image
            src="https://jtfnygkfjjmyhcugldts.supabase.co/storage/v1/object/public/images/house-renoverse-gradient@4x+(small).png"
            alt="House Renovation Image"
            className="mx-auto h-auto w-[25%] object-contain"
            layout="intrinsic"
            width={500}
            height={100}
          />
        </div>
        <div className="flex items-center">
          {session?.user ? <UserMenu user={session.user} /> : null}
        </div>
      </div>
    </header>
  )
}
