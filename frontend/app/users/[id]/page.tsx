'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardNavbar from '@/components/DashboardNavbar'

interface BackendUser {
  ID: number
  Provider: string
  ProviderAccountID: string
  Email: string
  Name: string
  AvatarUrl: string
  EmailVerified: boolean
  CreatedAt: string
  UpdatedAt: string
}

// Frontend interface for display
interface User {
  id: number
  provider: string
  providerAccountId: string
  email: string
  name: string
  avatarUrl: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

const UserProfile = () => {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const fetchUser = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/users/${userId}`)
      if (response.ok) {
        const backendUser: BackendUser = await response.json()

        
        // Map backend fields to frontend interface
        const mappedUser: User = {
          id: backendUser.ID,
          provider: backendUser.Provider,
          providerAccountId: backendUser.ProviderAccountID,
          email: backendUser.Email,
          name: backendUser.Name,
          avatarUrl: backendUser.AvatarUrl,
          emailVerified: backendUser.EmailVerified,
          createdAt: backendUser.CreatedAt,
          updatedAt: backendUser.UpdatedAt
        }
        

        setUser(mappedUser)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch user')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setError('Failed to fetch user data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadUser = async () => {
      if (status === 'authenticated' && params.id) {
        try {
          const userId = await params.id
          if (typeof userId === 'string') {
            await fetchUser(userId)
          } else {
            setError('Invalid user ID format')
          }
        } catch (error) {
          console.error('Error getting user ID:', error)
          setError('Invalid user ID')
        }
      }
    }
    
    loadUser()
  }, [status, params.id, fetchUser])

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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not available'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString()
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className='bg-black min-h-screen'>
      <DashboardNavbar />
      
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <button
            onClick={() => router.push('/dashboard')}
            className='text-gray-400 hover:text-white font-mono mb-6'
          >
            ← Back to Dashboard
          </button>

          {error && (
            <div className='bg-red-900 border border-red-700 rounded-lg p-4 mb-6'>
              <div className='text-red-200 font-mono'>{error}</div>
            </div>
          )}

          {user && (
            <div className='bg-gray-900 border border-gray-800 rounded-lg p-8'>
              <h1 className='text-3xl font-mono font-bold text-white mb-6 text-center'>
                {user.name || 'Unknown User'}
              </h1>
              
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-400 font-mono'>Email:</span>
                  <span className='text-white font-mono'>{user.email || 'Not available'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400 font-mono'>Provider:</span>
                  <span className='text-white font-mono capitalize'>{user.provider || 'Not available'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400 font-mono'>Email Verified:</span>
                  <span className={`font-mono ${user.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400 font-mono'>Created:</span>
                  <span className='text-white font-mono'>
                    {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400 font-mono'>Last Updated:</span>
                  <span className='text-white font-mono'>
                    {formatDate(user.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!user && !error && !loading && (
            <div className='bg-gray-900 border border-gray-800 rounded-lg p-8 text-center'>
              <div className='text-gray-400 font-mono text-xl'>No user data found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
