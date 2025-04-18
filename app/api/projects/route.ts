import 'server-only'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(req: Request) {
  try {
    const projectData = await req.json()
    const cookieStore = cookies()
    const session = await auth({ cookieStore })

    if (!session) {
      console.error('No session found, user is unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Step 1: Create the project with budget only
    const { data: project, error: projectError } = await supabase
      .from('project')
      .insert([{ budget: projectData.budget }])
      .select()
    console.log('project data: ', projectData)
    if (projectError) {
      console.error('Project creation error:', projectError)
      return NextResponse.json(
        { message: 'Failed to create project', error: projectError.message },
        { status: 500 }
      )
    }

    console.log('Created project:', project)

    const projectId = project[0]?.id

    if (!projectId) {
      console.error('Project ID is null or undefined')
      return NextResponse.json(
        { message: 'Failed to retrieve project ID' },
        { status: 500 }
      )
    }

    // Step 2: Get the profile associated with the authenticated user
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json(
        { message: 'Failed to retrieve profile', error: profileError.message },
        { status: 500 }
      )
    }

    // Step 3: Get the associated user from the user table using the profile ID
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('id')
      .eq('profile_id', profileData.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return NextResponse.json(
        { message: 'Failed to retrieve user data', error: userError.message },
        { status: 500 }
      )
    }

    // Step 4: Insert into user_projects to associate the user with the new project
    const { error: userProjectError } = await supabase
      .from('user_projects')
      .insert([{ user_id: userData.id, project_id: projectId }])

    if (userProjectError) {
      console.error('Failed to associate user with project:', userProjectError)
      return NextResponse.json(
        {
          message: 'Failed to associate user with project',
          error: userProjectError.message
        },
        { status: 500 }
      )
    }

    // Step 4: Inserting into user_projects is fine as you have it

    // Prepare the final project data with the image URLs
    const finalProjectData = {
      // ...other project fields
      currentImages:
        projectData.currentImages.length > 0
          ? JSON.stringify(projectData.currentImages)
          : null,
      inspirationImages:
        projectData.inspirationImages.length > 0
          ? JSON.stringify(projectData.inspirationImages)
          : null
    }

    // Prepare the room data
    const roomData = [
      {
        room_type: projectData.selectedRoom,
        dimensions: null,
        details: projectData.description,
        project_id: projectId,
        room_images: finalProjectData.currentImages,
        inspiration_images: finalProjectData.inspirationImages
      }
    ]

    // Log the room data to verify its structure and content
    console.log('Room Data before Insert:', JSON.stringify(roomData, null, 2))

    // Insert rooms into the Supabase 'room' table
    const { error: roomError } = await supabase.from('room').insert(roomData)

    if (roomError) {
      console.error('Failed to create rooms:', roomError)
      return NextResponse.json(
        { message: 'Failed to create rooms', error: roomError.message },
        { status: 500 }
      )
    }

    if (roomError) {
      console.error('Failed to create rooms:', roomError)
      return NextResponse.json(
        { message: 'Failed to create rooms', error: roomError.message },
        { status: 500 }
      )
    }

    // Respond with the created project data
    return NextResponse.json(
      { message: 'Project created and associated successfully', project },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error during project creation:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred', error: error.message },
      { status: 500 }
    )
  }
}
