import {
  Bookmark,
  Compass,
  Home,
  SquarePen,
  UserRoundSearch,
} from 'lucide-react'

export const sidebarList = [
  {
    link: '/',
    label: '홈',
    icon: <Home />,
  },
  {
    link: '/explore',
    label: '탐색',
    icon: <Compass />,
  },
  {
    link: '/saved',
    label: '저장목록',
    icon: <Bookmark />,
  },
  {
    link: '/social',
    label: '소셜',
    icon: <UserRoundSearch />,
  },
  {
    link: '/write',
    label: '글 작성',
    icon: <SquarePen />,
  },
]

export const bottombarList = [
  {
    link: '/',
    label: '홈',
    icon: <Home width={16} height={16} />,
  },
  {
    link: '/explore',
    label: '탐색',
    icon: <Compass width={16} height={16} />,
  },
  {
    link: '/saved',
    label: '저장목록',
    icon: <Bookmark width={16} height={16} />,
  },
  {
    link: '/social',
    label: '소셜',
    icon: <UserRoundSearch width={16} height={16} />,
  },
  {
    link: '/write',
    label: '글 작성',
    icon: <SquarePen width={16} height={16} />,
  },
]
