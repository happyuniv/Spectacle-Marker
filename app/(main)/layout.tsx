import { Bottombar, Sidebar, Topbar } from '@/components/index'

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-[1600px]'>
        <Topbar />
        <div className='flex mt-[50px] mb-[92px] md:mb-0'>
          <Sidebar />
          <main className='flex w-full'>{children}</main>
        </div>
        <Bottombar />
      </div>
    </div>
  )
}
