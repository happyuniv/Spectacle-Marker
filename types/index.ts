export type INavLink = {
  imgURL: string
  route: string
  label: string
}

export type IUser = {
  id: string
  username: string
  email: string
  imageUrl: string
}

export type INewUser = {
  email: string
  username: string
  password: string
}

export type INewPost = {
  userId: string
  title: string
  files: File[]
  place?: string
  coords?: number[]
  location?: string
}

export type IUpdateUser = {
  userId: string
  username: string
  imageId: string
  imageUrl: URL | string
  file: File[]
}

export type INewComment = {
  userId: string
  postId: string
  content: string
}

export type IUpdateComment = {
  commentId: string
  content: string
}
