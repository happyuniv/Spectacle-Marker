import { LoaderCircle } from 'lucide-react'

export default function Loader() {
  return (
    <>
      <div className='flex justify-center items-center w-full'>
        <LoaderCircle className='animate-spin' />
      </div>
    </>
  )
}
