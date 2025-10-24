'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  UserPlus,
  LogIn,
  Calendar,
  MapPin,
  Phone,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface AuthSystemProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (user: UserAccount) => void
}

export interface UserAccount {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  dateOfBirth: string
  country: string
  state: string
  phoneNumber: string
  coins: number
  totalWagered: number
  vipLevel: number
  accountCreated: string
  lastLogin: string
  emailVerified: boolean
  phoneVerified: boolean
  kycVerified: boolean
  gameStats: {
    slotsPlayed: number
    blackjackWins: number
    rouletteSpins: number
    pokerHands: number
    biggestWin: number
    loginStreak: number
    totalGamesPlayed: number
  }
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    responsibleGamingLimits: {
      dailyDepositLimit: number
      weeklyDepositLimit: number
      monthlyDepositLimit: number
      sessionTimeLimit: number
    }
  }
}

export default function AuthSystem({ isOpen, onClose, onAuthSuccess }: AuthSystemProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    country: '',
    state: '',
    phoneNumber: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    over18: false,
    emailNotifications: true
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
  }

  const validateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18
    }
    return age >= 18
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Check if user exists in localStorage (demo purposes)
      const existingUsers = JSON.parse(localStorage.getItem('wreckless_racks_users') || '[]')
      const user = existingUsers.find((u: any) =>
        u.email === loginData.email && u.password === loginData.password
      )

      if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString()
        const updatedUsers = existingUsers.map((u: any) => u.id === user.id ? user : u)
        localStorage.setItem('wreckless_racks_users', JSON.stringify(updatedUsers))
        // Don't set current user here - let UserContext handle it with session tokens

        onAuthSuccess(user)
        onClose()
      } else {
        setErrors({ general: 'Invalid email or password' })
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' })
    }

    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!validateEmail(registerData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!registerData.username || registerData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!registerData.firstName) {
      newErrors.firstName = 'First name is required'
    }

    if (!registerData.lastName) {
      newErrors.lastName = 'Last name is required'
    }

    if (!validatePassword(registerData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number'
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!registerData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else if (!validateAge(registerData.dateOfBirth)) {
      newErrors.dateOfBirth = 'You must be at least 18 years old'
    }

    if (!registerData.country) {
      newErrors.country = 'Country is required'
    }

    if (!registerData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    if (!registerData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service'
    }

    if (!registerData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the Privacy Policy'
    }

    if (!registerData.over18) {
      newErrors.over18 = 'You must confirm you are over 18'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('wreckless_racks_users') || '[]')
      const userExists = existingUsers.some((u: any) =>
        u.email === registerData.email || u.username === registerData.username
      )

      if (userExists) {
        setErrors({ general: 'User with this email or username already exists' })
        setLoading(false)
        return
      }

      // Create new user
      const newUser: UserAccount = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: registerData.email,
        username: registerData.username,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        dateOfBirth: registerData.dateOfBirth,
        country: registerData.country,
        state: registerData.state,
        phoneNumber: registerData.phoneNumber,
        coins: 10000, // Welcome bonus
        totalWagered: 0,
        vipLevel: 0,
        accountCreated: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        emailVerified: false,
        phoneVerified: false,
        kycVerified: false,
        gameStats: {
          slotsPlayed: 0,
          blackjackWins: 0,
          rouletteSpins: 0,
          pokerHands: 0,
          biggestWin: 0,
          loginStreak: 1,
          totalGamesPlayed: 0
        },
        preferences: {
          emailNotifications: registerData.emailNotifications,
          smsNotifications: false,
          responsibleGamingLimits: {
            dailyDepositLimit: 500,
            weeklyDepositLimit: 2000,
            monthlyDepositLimit: 5000,
            sessionTimeLimit: 240 // 4 hours in minutes
          }
        }
      }

      // Save user
      const updatedUsers = [...existingUsers, { ...newUser, password: registerData.password }]
      localStorage.setItem('wreckless_racks_users', JSON.stringify(updatedUsers))
      // Don't set current user here - let UserContext handle it with session tokens

      setSuccess('Account created successfully! Welcome to Wreckless Racks Casino!')
      setTimeout(() => {
        onAuthSuccess(newUser)
        onClose()
      }, 2000)

    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    }

    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-yellow-500/30"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💸</div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join Wreckless Racks' : 'Reset Password'}
              </h2>
              <p className="text-gray-300 text-sm">
                {mode === 'login' ? 'Sign in to your account' : mode === 'register' ? 'Create your casino account' : 'Enter your email to reset password'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2"
            >
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-400 text-sm">{success}</span>
            </motion.div>
          )}

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-red-400 text-sm">{errors.general}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-yellow-400 hover:text-yellow-300 text-sm underline"
              >
                Forgot your password?
              </button>
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-yellow-400 hover:text-yellow-300 underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="First name"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="Last name"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <User size={16} className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                placeholder="Choose a username"
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date of Birth
              </label>
              <input
                type="date"
                value={registerData.dateOfBirth}
                onChange={(e) => setRegisterData({ ...registerData, dateOfBirth: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              />
              {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Country
                </label>
                <select
                  value={registerData.country}
                  onChange={(e) => setRegisterData({ ...registerData, country: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="SE">Sweden</option>
                  <option value="NO">Norway</option>
                  <option value="DK">Denmark</option>
                </select>
                {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={registerData.state}
                  onChange={(e) => setRegisterData({ ...registerData, state: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="State/Province"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={registerData.phoneNumber}
                onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={registerData.agreeToTerms}
                  onChange={(e) => setRegisterData({ ...registerData, agreeToTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300 text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-yellow-400 hover:text-yellow-300 underline">
                    Terms of Service
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-400 text-xs">{errors.agreeToTerms}</p>}

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={registerData.agreeToPrivacy}
                  onChange={(e) => setRegisterData({ ...registerData, agreeToPrivacy: e.target.checked })}
                  className="mt-1 w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300 text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-yellow-400 hover:text-yellow-300 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeToPrivacy && <p className="text-red-400 text-xs">{errors.agreeToPrivacy}</p>}

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={registerData.over18}
                  onChange={(e) => setRegisterData({ ...registerData, over18: e.target.checked })}
                  className="mt-1 w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300 text-sm">
                  <Shield size={16} className="inline mr-1" />
                  I confirm that I am over 18 years of age
                </span>
              </label>
              {errors.over18 && <p className="text-red-400 text-xs">{errors.over18}</p>}

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={registerData.emailNotifications}
                  onChange={(e) => setRegisterData({ ...registerData, emailNotifications: e.target.checked })}
                  className="mt-1 w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300 text-sm">
                  I would like to receive promotional emails and updates
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>

            <p className="text-gray-400 text-sm text-center">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                Sign in here
              </button>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  )
}