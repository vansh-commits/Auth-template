'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface User {
  id: number
  name: string
  avatarUrl: string
}

interface UserCardProps {
  user: User
}

const UserCard = ({ user }: UserCardProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/users/${user.id}`)
  }

  // Safely get the first character of the name
  const getInitial = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string') return 'U'
    return name.charAt(0).toUpperCase()
  }

  // Safely get the display name
  const getDisplayName = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string') return 'Unknown User'
    return name
  }

  return (
    <div
      onClick={handleClick}
      className='bg-gray-900 border border-gray-800 rounded-lg p-6 cursor-pointer hover:border-gray-600 hover:bg-gray-800 transition-all duration-200 transform hover:scale-105'
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-4'>
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={getDisplayName(user.name)}
              width={80}
              height={80}
              className='rounded-full border-2 border-gray-700'
            />
          ) : (
            <div className='w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600'>
              <span className='text-white text-2xl font-mono font-bold'>
                {getInitial(user.name)}
              </span>
            </div>
          )}
        </div>
        
        <h3 className='text-xl font-mono font-semibold text-white mb-2'>
          {getDisplayName(user.name)}
        </h3>
        
        <div className='text-gray-400 font-mono text-sm'>
          Click to view profile
        </div>
      </div>
    </div>
  )
}

export default UserCard
