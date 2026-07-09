// src/app/redux-test/page.tsx
'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { increment, decrement, setUser, clearUser } from '@/lib/redux/store'

export default function ReduxTestPage() {
  const dispatch = useAppDispatch()
  const counter = useAppSelector((state) => state.counter.value)
  const user = useAppSelector((state) => state.user)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-xl p-6 space-y-6 border border-gray-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔴 Redux Test Page</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Check if Redux is working properly</p>
        
        {/* Counter Test */}
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Counter: {counter}</h2>
          <div className="flex gap-3">
            <button 
              onClick={() => dispatch(increment())}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              ➕ Increment
            </button>
            <button 
              onClick={() => dispatch(decrement())}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              ➖ Decrement
            </button>
          </div>
        </div>

        {/* User Test */}
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">👤 User State</h2>
          <pre className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
          <div className="flex flex-wrap gap-3 mt-3">
            <button 
              onClick={() => dispatch(setUser({ 
                name: 'John Doe', 
                email: 'john@example.com', 
                role: 'admin' 
              }))}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Set Admin
            </button>
            <button 
              onClick={() => dispatch(setUser({ 
                name: 'Jane Smith', 
                email: 'jane@example.com', 
                role: 'customer' 
              }))}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Set Customer
            </button>
            <button 
              onClick={() => dispatch(clearUser())}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear User
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Redux is working! You can now build the dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}