import { Models } from 'appwrite'

import PostCard from './PostCard'

type props = {
  posts: Models.Document[]
}

export default function PostCardList({ posts }: props) {
  return (
    <>
      <ul className='flex flex-col gap-10'>
        {posts.map((post) => (
          <li key={post.$id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </>
  )
}
