import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Main component
const UserHome = async () => {
  const cookieStore = await cookies()
  const session = await auth({ cookieStore })

  if (!session || !session.user) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">User not logged in.</h1>
      </div>
    )
  }

  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Fetch user profile data
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (profileError) {
    console.error('Profile fetch error:', profileError)
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Failed to retrieve profile.</h1>
      </div>
    )
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from('user')
    .select('*')
    .eq('profile_id', profileData.id)
    .single()

  if (userError) {
    console.error('User fetch error:', userError)
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Failed to retrieve user data.</h1>
      </div>
    )
  }

  // Fetch user projects
  const { data: userProjects, error: userProjectsError } = await supabase
    .from('user_projects')
    .select('project_id, project(*)')
    .eq('user_id', userData.id)

  if (userProjectsError) {
    console.error('Projects fetch error:', userProjectsError)
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Error loading projects.</h1>
      </div>
    )
  }

  // Fetch rooms and images associated with each project
  const projectsWithRooms = await Promise.all(
    userProjects.map(async userProject => {
      const { data: rooms, error: roomsError } = await supabase
        .from('room')
        .select('*')
        .eq('project_id', userProject.project_id)

      if (roomsError) {
        console.error(
          `Rooms fetch error for project ${userProject.project_id}:`,
          roomsError
        )
        return { ...userProject, rooms: [] }
      }

      // Process the rooms to include images
      const roomsWithImages = await Promise.all(
        rooms.map(async room => {
          const images = room.room_images ? JSON.parse(room.room_images) : []
          return { ...room, images }
        })
      )

      return { ...userProject, rooms: roomsWithImages }
    })
  )

  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold">
          Welcome, {profileData.first_name || 'User'}!
        </h1>
        <h2 className="mt-6 text-xl font-semibold">Your Projects:</h2>
        {projectsWithRooms && projectsWithRooms.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectsWithRooms.map(userProject => (
              <div
                key={userProject.project_id}
                className="rounded-lg bg-secondary p-4 shadow-md"
              >
                <h3 className="font-bold">{userProject.project.name}</h3>
                {userProject.rooms && userProject.rooms.length > 0 && (
                  <div className="mt-2">
                    {userProject.rooms.map(room => (
                      <div key={room.id} className="mt-2">
                        <div className="font-semibold">
                          Room: {room.room_type || 'Unnamed Room'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Details: {room.details || 'No details'}
                        </div>
                        {/* Display images for the room */}
                        {room.images && room.images.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {room.images.map((imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`Room ${room.room_type} Image ${
                                  index + 1
                                }`}
                                className="h-32 w-full rounded object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No projects found.</p>
        )}
      </div>

      <Link href="/new_project">
        <Button className="mt-4 rounded">Start New Project</Button>
      </Link>
    </div>
  )
}

export default UserHome
