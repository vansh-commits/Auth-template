import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='bg-black min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-6xl font-mono font-bold text-white mb-4'>404</h1>
        <p className='text-xl text-gray-400 font-mono mb-8'>Page not found</p>
        <Link 
          href='/'
          className='text-gray-400 hover:text-white font-mono underline'
        >
          Return to home
        </Link>
      </div>
    </div>
  )
}
