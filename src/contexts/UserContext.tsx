'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserAccount } from '@/components/AuthSystem'

interface UserContextType {
  user: UserAccount | null
  isAuthenticated: boolean
  login: (user: UserAccount) => void
  logout: () => void
  updateUser: (updates: Partial<UserAccount>) => void
  updateCoins: (amount: number) => void
  updateGameStats: (stats: Partial<UserAccount['gameStats']>) => void
  updateTotalWagered: (amount: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount - BUT ONLY if session is still valid
  useEffect(() => {
    console.log('UserContext: Checking authentication status...')

    // One-time migration: Clear old data without session system
    const migrationKey = 'wreckless_racks_auth_migration_v2'
    if (!localStorage.getItem(migrationKey)) {
      console.log('UserContext: Running authentication migration - clearing old data')
      const keysToRemove = ['wreckless_racks_current_user', 'wreckless_racks_users', 'wreckless_racks_session_token', 'wreckless_racks_session_expiry']
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          console.log('UserContext: Removing old data:', key)
          localStorage.removeItem(key)
        }
      })
      localStorage.setItem(migrationKey, 'completed')
      console.log('UserContext: Migration completed - users will need to re-authenticate')
    }

    const savedUser = localStorage.getItem('wreckless_racks_current_user')
    const sessionToken = localStorage.getItem('wreckless_racks_session_token')
    const sessionExpiry = localStorage.getItem('wreckless_racks_session_expiry')

    console.log('UserContext: localStorage check:', {
      hasUser: !!savedUser,
      hasToken: !!sessionToken,
      hasExpiry: !!sessionExpiry
    })

    // If user exists but no session tokens, clear everything (old data)
    if (savedUser && (!sessionToken || !sessionExpiry)) {
      console.log('UserContext: Clearing old user data without session tokens')
      localStorage.removeItem('wreckless_racks_current_user')
      localStorage.removeItem('wreckless_racks_session_token')
      localStorage.removeItem('wreckless_racks_session_expiry')
      localStorage.removeItem('wreckless_racks_users') // Clear users array too
      console.log('UserContext: Not authenticated - no valid session')
      return
    }

    if (savedUser && sessionToken && sessionExpiry) {
      try {
        const parsedUser = JSON.parse(savedUser)
        const expiryTime = parseInt(sessionExpiry)

        console.log('UserContext: Session check:', {
          expiryTime,
          currentTime: Date.now(),
          isValid: Date.now() < expiryTime
        })

        // Check if session is still valid (24 hours)
        if (Date.now() < expiryTime) {
          console.log('UserContext: Valid session found, authenticating user:', parsedUser.username)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } else {
          console.log('UserContext: Session expired, clearing data')
          // Session expired, clear everything
          localStorage.removeItem('wreckless_racks_current_user')
          localStorage.removeItem('wreckless_racks_session_token')
          localStorage.removeItem('wreckless_racks_session_expiry')
          localStorage.removeItem('wreckless_racks_users')
        }
      } catch (error) {
        console.error('UserContext: Failed to parse saved user:', error)
        localStorage.removeItem('wreckless_racks_current_user')
        localStorage.removeItem('wreckless_racks_session_token')
        localStorage.removeItem('wreckless_racks_session_expiry')
        localStorage.removeItem('wreckless_racks_users')
      }
    } else {
      console.log('UserContext: No authentication data found - user needs to login')
    }
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('wreckless_racks_current_user', JSON.stringify(user))

      // Also update the user in the users array
      const existingUsers = JSON.parse(localStorage.getItem('wreckless_racks_users') || '[]')
      const updatedUsers = existingUsers.map((u: any) =>
        u.id === user.id ? { ...u, ...user } : u
      )
      localStorage.setItem('wreckless_racks_users', JSON.stringify(updatedUsers))
    }
  }, [user])

  const login = (newUser: UserAccount) => {
    setUser(newUser)
    setIsAuthenticated(true)

    // Create session with 24-hour expiry
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sessionExpiry = Date.now() + (24 * 60 * 60 * 1000) // 24 hours

    localStorage.setItem('wreckless_racks_session_token', sessionToken)
    localStorage.setItem('wreckless_racks_session_expiry', sessionExpiry.toString())
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('wreckless_racks_current_user')
    localStorage.removeItem('wreckless_racks_session_token')
    localStorage.removeItem('wreckless_racks_session_expiry')
  }

  const updateUser = (updates: Partial<UserAccount>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
  }

  const updateCoins = (amount: number) => {
    if (!user) return

    updateUser({ coins: amount })
  }

  const updateGameStats = (stats: Partial<UserAccount['gameStats']>) => {
    if (!user) return

    const updatedGameStats = { ...user.gameStats, ...stats }
    updateUser({ gameStats: updatedGameStats })
  }

  const updateTotalWagered = (amount: number) => {
    if (!user) return

    const newTotalWagered = user.totalWagered + amount

    // Update VIP level based on total wagered
    let newVipLevel = user.vipLevel
    if (newTotalWagered >= 1000000) newVipLevel = 5 // Elite
    else if (newTotalWagered >= 500000) newVipLevel = 4 // Diamond
    else if (newTotalWagered >= 100000) newVipLevel = 3 // Platinum
    else if (newTotalWagered >= 25000) newVipLevel = 2 // Gold
    else if (newTotalWagered >= 5000) newVipLevel = 1 // Silver
    else newVipLevel = 0 // Bronze

    updateUser({
      totalWagered: newTotalWagered,
      vipLevel: newVipLevel
    })
  }

  const value: UserContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
    updateCoins,
    updateGameStats,
    updateTotalWagered
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}