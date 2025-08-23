'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const DashboardNavbar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className='bg-gray-900 border-b border-gray-800 px-6 py-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='text-2xl font-mono font-bold text-white cursor-pointer' onClick={() => router.push('/dashboard')}>
          PEOPLE<span className='text-gray-400'>.</span>DIRECTORY
        </div>
        
        <div className='flex items-center space-x-4'>
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors'
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className='rounded-full'
                />
              ) : (
                <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm font-mono'>
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50'>
                <div className='py-2'>
                  <div className='px-4 py-3 border-b border-gray-700'>
                    <div className='text-white font-mono text-sm font-semibold mb-1 truncate'>
                      {session?.user?.name || 'User'}
                    </div>
                    <div className='text-gray-400 font-mono text-xs break-words'>
                      {session?.user?.email || 'user@example.com'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-mono'
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
