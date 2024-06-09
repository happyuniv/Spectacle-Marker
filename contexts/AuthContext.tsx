'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { getCurrentUser } from '@/lib/appwrite/api'
import { IUser } from '@/types'
import { useGetCurrentUser } from '@/lib/react-query/queries'

export const INITIAL_USER = {
  id: '',
  username: '',
  email: '',
  imageUrl: '',
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: true,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

type IContextType = {
  user: IUser
  isLoading: boolean
  setUser: React.Dispatch<React.SetStateAction<IUser>>
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
}

export const AuthContext = createContext<IContextType>(INITIAL_STATE)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuthUser = async () => {
    setIsLoading(true)
    try {
      const currentAccount = await getCurrentUser()

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
        })
        setIsAuthenticated(true)

        return true
      }

      setIsAuthenticated(false)
      setUser(INITIAL_USER)

      return false
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuthUser()
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useUserContext = () => useContext(AuthContext)
