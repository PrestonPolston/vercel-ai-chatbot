import { auth } from '@/auth'
import { cookies } from 'next/headers'

const ContractorHome = async () => {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  console.log(session?.user)

  return (
    <div className="flex flex-col space-y-6 p-4">
      <h1 className="text-2xl font-bold">
        Welcome, {session?.user?.email || 'User'}!
      </h1>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Open Projects Section */}
        <div className="rounded bg-white p-4 shadow-md">
          <h2 className="text-xl font-semibold">Open Projects</h2>
          <ul className="mt-2">
            {/* Example projects - replace with dynamic data */}
            <li className="border-b py-2">Project 1</li>
            <li className="border-b py-2">Project 2</li>
            <li className="border-b py-2">Project 3</li>
          </ul>
        </div>

        {/* Current Projects Section */}
        <div className="rounded bg-white p-4 shadow-md">
          <h2 className="text-xl font-semibold">Current Projects</h2>
          <ul className="mt-2">
            {/* Example ongoing projects - replace with dynamic data */}
            <li className="border-b py-2">Project A</li>
            <li className="border-b py-2">Project B</li>
          </ul>
        </div>

        {/* Additional Items Section */}
        <div className="rounded bg-white p-4 shadow-md">
          <h2 className="text-xl font-semibold">Upcoming Tasks/Items</h2>
          <ul className="mt-2">
            {/* Placeholder for future items */}
            <li className="border-b py-2">Task 1</li>
            <li className="border-b py-2">Task 2</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ContractorHome
