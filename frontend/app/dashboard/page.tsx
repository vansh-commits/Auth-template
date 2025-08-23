'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardNavbar from '@/components/DashboardNavbar'
import UserCard from '@/components/UserCard'

// Interface matching the actual backend response (lowercase fields)
interface BackendUser {
  id: number
  name: string
  avatarUrl: string
}

// Frontend interface for display
interface User {
  id: number
  name: string
  avatarUrl: string
}

const Dashboard = () => {
  const { status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users/bulk')
      if (response.ok) {
        const backendUsers: BackendUser[] = await response.json()
        
        // Map backend fields to frontend interface with validation
        const mappedUsers: User[] = backendUsers
          .filter(backendUser => backendUser.id && backendUser.name) // Filter out invalid users
          .map(backendUser => ({
            id: backendUser.id,
            name: backendUser.name || 'Unknown User',
            avatarUrl: backendUser.avatarUrl || ''
          }))
        
        setUsers(mappedUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status, fetchUsers])

  if (status === 'loading' || loading) {
    return (
      <div className='bg-black h-screen flex items-center justify-center'>
        <div className='text-white font-mono text-xl'>Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className='bg-black min-h-screen'>
      <DashboardNavbar />
      
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-mono font-bold text-white mb-2'>
            People Directory
          </h1>
          <p className='text-gray-400 font-mono'>
            Discover and connect with amazing people
          </p>
        </div>

        {users.length === 0 ? (
          <div className='text-center py-20'>
            <div className='text-gray-400 font-mono text-xl mb-4'>
              No users found
            </div>
            <div className='text-gray-600 font-mono'>
              Be the first to join our community!
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {users.map((user, index) => (
              <UserCard key={`${user.id}-${index}`} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
