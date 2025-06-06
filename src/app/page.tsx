import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Welcome to SanaSpace Dashboard</h1>
      <p>Select a module to get started:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          href="/doctors"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold">Doctors</h2>
          <p>Manage doctor profiles and specializations</p>
        </Link>

        <Link
          href="/dashboard"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p>View overall system statistics and insights</p>
        </Link>
      </div>
    </div>
  )
}