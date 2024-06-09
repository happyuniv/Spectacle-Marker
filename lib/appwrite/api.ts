import { ID, Query } from 'appwrite'

import { appwriteConfig, account, databases, storage, avatars } from './config'
import {
  INewPost,
  INewUser,
  IUpdateUser,
  INewComment,
  IUpdateComment,
} from '@/types'

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password
    )

    // if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(user.username)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })

    return newUser
  } catch (error) {
    console.log(error)
    throw Error
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string
  email: string
  username?: string
  imageUrl: URL
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    console.log(error)
    throw Error
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)

    return session
  } catch (error) {
    console.log(error)
    throw Error
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current')

    return session
  } catch (error) {
    console.log(error)
    throw Error
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
    return null
  }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: string[] = [Query.orderDesc('$createdAt')]

  if (limit) {
    queries.push(Query.limit(limit))
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    )

    if (!users) throw Error

    return users
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    )

    if (!user) throw Error

    return user
  } catch (error) {
    console.log(error)
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0

  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    }

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0])
      if (!uploadedFile) throw Error

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        username: user.username,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    )

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId)
      }
      // If no new file uploaded, just throw error
      throw Error
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId)
    }

    return updatedUser
  } catch (error) {
    console.log(error)
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    const uploadedFileIds = []
    const fileUrls = []
    for (let i = 0; i < post.files.length; i++) {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.files[i])

      if (!uploadedFile) throw Error

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id)

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      uploadedFileIds.push(uploadedFile.$id)
      fileUrls.push(fileUrl)
    }

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        title: post.title,
        imageUrls: fileUrls,
        imageIds: uploadedFileIds,
        place: post.place,
        coords: post.coords,
        location: post.location,
      }
    )

    if (!newPost) {
      for (let i = 0; i < uploadedFileIds.length; i++)
        await deleteFile(uploadedFileIds[i])
      throw Error
    }

    return newPost
  } catch (error) {
    console.log(error)
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    )

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET POSTS
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: string[] = [Query.orderDesc('$createdAt'), Query.limit(2)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('title', searchTerm)]
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    if (!post) throw Error

    return post
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )

    if (!post) throw Error

    return post
  } catch (error) {
    console.log(error)
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageIds?: string[]) {
  if (!postId || !imageIds) return

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    if (!statusCode) throw Error

    for (let i = 0; i < imageIds.length; i++) await deleteFile(imageIds[i])

    return { status: 'Ok' }
  } catch (error) {
    console.log(error)
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      savedRecordId
    )

    if (!statusCode) throw Error

    return { status: 'Ok' }
  } catch (error) {
    console.log(error)
  }
}

// ============================================================
// COMMENTS
// ============================================================

export async function createComment(comment: INewComment) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentCollectionId,
      ID.unique(),
      {
        user: comment.userId,
        post: comment.postId,
        content: comment.content,
      }
    )

    if (!newComment) throw Error

    return newComment
  } catch (error) {
    console.log(error)
  }
}

export async function getComments(postId: string) {
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentCollectionId,
      [Query.equal('post', postId), Query.orderAsc('$createdAt')]
    )

    if (!comments) throw Error

    return comments
  } catch (error) {
    console.log(error)
  }
}

export async function updateComment(comment: IUpdateComment) {
  try {
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentCollectionId,
      comment.commentId,
      {
        content: comment.content,
      }
    )

    if (!updatedComment) throw Error

    return updatedComment
  } catch (error) {
    console.log(error)
  }
}

export async function deleteComment(commentId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentCollectionId,
      commentId
    )

    if (!statusCode) throw Error

    return { status: 'Ok' }
  } catch (error) {
    console.log(error)
  }
}
