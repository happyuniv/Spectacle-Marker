import Image from 'next/image'

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <main className='flex w-screen h-screen'>
      <section className='flex flex-col justify-center items-center flex-1  py-10'>
        {children}
      </section>
      <div className='hidden md:block relative flex-1 bg-black'>
        <Image
          src={'/group_image.webp'}
          fill
          alt='logo'
          className='object-cover'
        />
      </div>
    </main>
  )
}
