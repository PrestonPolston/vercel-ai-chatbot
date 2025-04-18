import { auth } from '@/auth'
import NewUserFlow from '@/components/new_user_flow/NewUserFlow'
import { Separator } from '@/components/ui/separator'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function NewUser() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <NewUserFlow />
        <Separator className="my-4" />
      </div>
    </div>
  )
}
