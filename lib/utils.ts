import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
  })
  const formattedDate = date
    .replaceAll('.', '')
    .replace(' ', '.')
    .replace(' ', '.')
    .slice(0, -3)

  return formattedDate
}
