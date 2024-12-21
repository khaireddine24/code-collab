import Link from 'next/link'
import { getServerSession } from 'next-auth'

export default async function Home() {
  const session = await getServerSession()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Code Collab</h1>
      <p className="text-xl mb-8">
        Collaborate on code in real-time with your team
      </p>
      {session ? (
        <Link
          href="/sheets"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Go to My Sheets
        </Link>
      ) : (
        <p className="text-gray-600">Sign in to get started</p>
      )}
    </div>
  )
}