import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/apiService'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('synagogue_token'))
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!token

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('synagogue_token')
      
      if (storedToken) {
        try {
          apiService.setAuthToken(storedToken)
          const response = await apiService.auth.verify()
          setUser(response.user)
          setToken(storedToken)
        } catch (error) {
          console.error('Token verification failed:', error)
          localStorage.removeItem('synagogue_token')
          setToken(null)
          setUser(null)
        }
      }
      
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiService.auth.login(email, password)
      
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('synagogue_token', response.token)
      apiService.setAuthToken(response.token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await apiService.auth.register(userData)
      
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('synagogue_token', response.token)
      apiService.setAuthToken(response.token)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('synagogue_token')
    apiService.clearAuthToken()
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 