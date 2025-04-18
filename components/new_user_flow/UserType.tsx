// components/UserType.tsx
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

async function getUserType() {
  const supabase = createClientComponentClient({ cookies })

  // Fetch the current user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null // User not authenticated
  }

  // Query the profiles table for user type
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    return null 
  }

  return profileData?.user_type || null 
}

export async function UserType() {
  return await getUserType()
}
