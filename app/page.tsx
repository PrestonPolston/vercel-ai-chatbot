import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import UserHome from './user/home/page'
import ContractorHome from './contractor/home/page'
import NewUserFlow from '@/components/new_user_flow/NewUserFlow'

export const metadata = {
  title: 'Home - My App',
  description: 'Home page with user authentication'
}

export default async function IndexPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch the current user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  // Handle unauthenticated users
  if (userError || !user) {
    return <NewUserFlow />
  }

  // Fetch user profile to determine user type
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('user_type, first_name, last_name') // Include additional fields if needed
    .eq('user_id', user.id)
    .single()

  // Handle errors while fetching profile
  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return <NewUserFlow />
  }

  // Check that the profile data was returned properly
  if (!profileData) {
    console.error('No profile data found for user.')
    return <NewUserFlow />
  }

  // Extract user type and additional info from the fetched profile data
  const userType = profileData.user_type

  // Prepare user profile data to be updated if necessary
  const userProfile = {
    firstName: profileData.first_name || 'User', // Default value if first name is empty
    lastName: profileData.last_name || '',
    userType: userType
  }

  // Function to update user metadata if needed
  const updateUserMetadata = async updates => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        user_type: updates.userType
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating profile:', error)
    } else {
      console.log('Profile updated successfully:', data)
    }
  }

  // Check for necessary updates
  // Here you can define your logic for deciding when to update
  // For instance, if first name or last name is empty, update it.
  if (!profileData.first_name || !profileData.last_name) {
    await updateUserMetadata(userProfile)
  }

  // Conditional rendering based on userType
  if (userType === 'homeowner') {
    return <UserHome />
  } else if (userType === 'contractor') {
    return <ContractorHome />
  } else {
    console.error('Unexpected user type:', userType)
    return <NewUserFlow />
  }
}
