'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'

const Home = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className='bg-black h-screen flex items-center justify-center'>
        <div className='text-white font-mono text-xl'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='bg-black min-h-screen'>
      <Navbar />
      
      <div className='container mx-auto px-4 py-20'>
        <div className='text-center'>
          <h1 className='text-8xl font-mono font-bold text-white mb-8 tracking-tighter'>
            PEOPLE
            <span className='text-gray-400'>.</span>
            DIRECTORY
          </h1>
          <p className='text-xl text-gray-400 font-mono mb-12 max-w-2xl mx-auto'>
            Discover, connect, and explore the digital realm of human connections
          </p>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
            <div className='bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors'>
              <div className='text-4xl mb-4'>🔍</div>
              <h3 className='text-xl font-mono text-white mb-2'>Discover</h3>
              <p className='text-gray-400 font-mono'>Find amazing people in our network</p>
            </div>
            <div className='bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors'>
              <div className='text-4xl mb-4'>🚀</div>
              <h3 className='text-xl font-mono text-white mb-2'>Connect</h3>
              <p className='text-gray-400 font-mono'>Build meaningful relationships</p>
            </div>
            <div className='bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors'>
              <div className='text-4xl mb-4'>⚡</div>
              <h3 className='text-xl font-mono text-white mb-2'>Explore</h3>
              <p className='text-gray-400 font-mono'>Navigate through profiles seamlessly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
