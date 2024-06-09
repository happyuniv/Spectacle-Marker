'use client'

import Link from 'next/link'
import {
  Bookmark,
  Compass,
  Home,
  MapPin,
  SquarePen,
  UserRoundSearch,
} from 'lucide-react'
import { sidebarList } from '@/constants'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <>
      <nav className='hidden md:block min-w-[260px]'>
        <div className='md:fixed px-5 py-10'>
          <Link
            href={'/'}
            className='flex justify-center items-center gap-1 w-[230px] h-[100px]'
          >
            <MapPin width={64} height={64} />
            <span className='text-2xl font-extrabold'>Spectacle Marker</span>
          </Link>
          <ul className='flex relative flex-col gap-8 mt-10 h-full text-xl font-semibold'>
            {sidebarList.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.link}
                  className={`
                ${pathname === item.link && 'bg-lime-300 bg-opacity-20'}
                ${item.link === '/write' && 'text-xl font-bold'}
                flex items-center gap-3 px-5 py-4 rounded-lg transition`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}
