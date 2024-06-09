import { useEffect, useState } from 'react'

export default function useModal(ref: React.RefObject<HTMLElement>) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onClick = ({ target }: MouseEvent) => {
      if (ref.current && !ref.current.contains(target as Node)) {
        setIsOpen(!isOpen)
      }
    }

    if (isOpen) {
      window.addEventListener('click', onClick)
    }

    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [isOpen])

  return [isOpen, setIsOpen] as const
}
