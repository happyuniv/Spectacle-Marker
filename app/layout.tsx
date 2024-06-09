import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { QueryProvider } from '@/lib/react-query/QueryProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'

const font = Noto_Sans_KR({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spectacle Marker',
  description:
    '위치와 함께 멋진 광경들을 공유해요. ㅡ 전국의 아름다운 사진들을 구경하고, 각 지역들의 숨겨진 매력들을 발견하세요. 특별한 순간을 지도에 마킹하고 공유하세요.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <Script
          type='text/javascript'
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&libraries=services&autoload=false`}
          defer
        />
      </head>
      <body className={font.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
