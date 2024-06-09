'use client'

import { bottombarList } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Bottombar() {
  const pathname = usePathname()
  return (
    <>
      <nav className='fixed md:hidden bottom-0 w-full z-10'>
        <ul className='flex justify-between rounded-t-[20px] bg-white px-5 py-4'>
          {bottombarList.map((item) => (
            <li key={item.label} className='flex-1'>
              <Link
                href={item.link}
                className={`${
                  pathname === item.link && 'bg-lime-300 bg-opacity-20'
                } 
                flex flex-col items-center gap-1 p-2 transition
              `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
