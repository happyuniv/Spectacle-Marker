'use client'

import { useState } from 'react'
import { MapPinned } from 'lucide-react'

import KakaoMap from './KakaoMap'

type props = {
  lat: number
  lon: number
}

export default function ToggleMap({ lat, lon }: props) {
  const [activeMap, setActiveMap] = useState(false)

  return (
    <>
      <div className='flex items-center gap-1 w-fit mt-3 border rounded-xl p-2 hover:cursor-pointer'>
        <MapPinned color='#1919f0' />
        <span
          onClick={() => setActiveMap(!activeMap)}
          className='font-semibold'
        >
          {activeMap ? '지도 접기' : '지도 펼치기'}
        </span>
      </div>
      {activeMap && <KakaoMap targetCoords={[lat, lon]} />}
    </>
  )
}
