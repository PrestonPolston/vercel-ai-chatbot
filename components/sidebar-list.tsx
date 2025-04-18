import Link from 'next/link' // Import Link for navigation
import { getChats, removeChat, shareChat } from '@/app/actions'
import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'

export interface SidebarListProps {
  userId?: string
}

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await getChats(userId)

  return (
    <div className="flex-1 overflow-auto">
      {/* Links to navigate to UserHome and the new Chat */}
      <div className="px-2 py-2">
        <Link href="/">
          <button className="w-full rounded p-2 text-left hover:bg-gray-200">
            Home
          </button>
        </Link>
        <Link href="/new_project">
          <button className="w-full rounded p-2 text-left hover:bg-gray-200">
            Start New Project
          </button>
        </Link>
      </div>

      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            chat =>
              chat && (
                <SidebarItem key={chat?.id} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={removeChat}
                    shareChat={shareChat}
                  />
                </SidebarItem>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
