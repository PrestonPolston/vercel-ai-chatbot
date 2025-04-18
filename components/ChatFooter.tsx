'use client'

import { useState } from 'react'
import { IconLuna } from './ui/icons'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  RightSheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import ChatSideBar from './ChatSideBar'

export interface SidebarProps {
  children?: React.ReactNode
}

export const ChatFooter = ({ children }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <footer className="sticky bottom-0 z-50 flex h-16 w-full border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex w-full ">
        <Sheet
          className="h-full"
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        >
          <SheetTrigger asChild>
            <div className="flex h-full w-full items-center justify-end p-4">
              <Button
                variant="ghost"
                className="h-9 w-9 p-0"
                onClick={toggleSidebar}
              >
                <IconLuna className="h-6 w-6" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </div>
          </SheetTrigger>
          <RightSheetContent className="flex h-full w-[300px] flex-col"></RightSheetContent>
          <RightSheetContent className="inset-y-0 flex h-auto w-[300px] flex-col p-0">
            <SheetHeader className="w-full items-center p-4">
              <SheetTitle className="text-md ">Luna</SheetTitle>
            </SheetHeader>
            <ChatSideBar />
            {children}
          </RightSheetContent>
        </Sheet>
      </div>
    </footer>
  )
}
