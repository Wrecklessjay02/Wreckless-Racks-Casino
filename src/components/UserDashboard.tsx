'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Coins,
  Trophy,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit,
  Crown,
  Target,
  TrendingUp,
  Clock,
  X
} from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

interface UserDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserDashboard({ isOpen, onClose }: UserDashboardProps) {
  const { user, updateUser } = useUser()
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'security' | 'preferences'>('profile')

  if (!isOpen || !user) return null

  const getVIPLevelName = (level: number) => {
    switch (level) {
      case 0: return 'Bronze'
      case 1: return 'Silver'
      case 2: return 'Gold'
      case 3: return 'Platinum'
      case 4: return 'Diamond'
      case 5: return 'Elite'
      default: return 'Bronze'
    }
  }

  const getVIPLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'text-orange-400'
      case 1: return 'text-gray-300'
      case 2: return 'text-yellow-400'
      case 3: return 'text-purple-400'
      case 4: return 'text-cyan-400'
      case 5: return 'text-pink-400'
      default: return 'text-orange-400'
    }
  }

  const nextVIPThreshold = [5000, 25000, 100000, 500000, 1000000, Infinity][user.vipLevel]
  const currentVIPProgress = user.vipLevel === 5 ? 100 :
    ((user.totalWagered / nextVIPThreshold) * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-blue-500/30"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <User className="text-blue-400" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-white">Account Dashboard</h2>
              <p className="text-gray-300">Manage your account and view statistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Summary Card */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-xl mb-6 border border-blue-500/30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h3>
                <p className="text-blue-400">@{user.username}</p>
                <p className="text-gray-400 text-sm">Member since {new Date(user.accountCreated).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Coins className="text-yellow-400" size={20} />
                  <span className="text-2xl font-bold text-yellow-400">{user.coins.toLocaleString()}</span>
                </div>
                <p className="text-gray-400 text-xs">Current Balance</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Crown className={getVIPLevelColor(user.vipLevel)} size={20} />
                  <span className={`text-xl font-bold ${getVIPLevelColor(user.vipLevel)}`}>
                    {getVIPLevelName(user.vipLevel)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">VIP Status</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="text-green-400" size={20} />
                  <span className="text-xl font-bold text-green-400">${user.totalWagered.toLocaleString()}</span>
                </div>
                <p className="text-gray-400 text-xs">Total Wagered</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="text-purple-400" size={20} />
                  <span className="text-xl font-bold text-purple-400">{user.gameStats.biggestWin.toLocaleString()}</span>
                </div>
                <p className="text-gray-400 text-xs">Biggest Win</p>
              </div>
            </div>
          </div>

          {/* VIP Progress */}
          {user.vipLevel < 5 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Progress to {getVIPLevelName(user.vipLevel + 1)}</span>
                <span className="text-gray-300">${user.totalWagered.toLocaleString()} / ${nextVIPThreshold.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(currentVIPProgress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: <User size={16} /> },
            { id: 'stats', label: 'Statistics', icon: <Target size={16} /> },
            { id: 'security', label: 'Security', icon: <Shield size={16} /> },
            { id: 'preferences', label: 'Preferences', icon: <Edit size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <User size={16} />
                    Full Name
                  </label>
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{user.email}</p>
                    {user.emailVerified ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-400" />
                    )}
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{user.phoneNumber}</p>
                    {user.phoneVerified ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Account Details</h3>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  <p className="text-white font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  <p className="text-white font-medium">{user.state ? `${user.state}, ` : ''}{user.country}</p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <Clock size={16} />
                    Last Login
                  </label>
                  <p className="text-white font-medium">{new Date(user.lastLogin).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-4 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <Target size={20} className="text-blue-400" />
                  </div>
                  <span className="text-blue-400 font-semibold">Slots Played</span>
                </div>
                <p className="text-2xl font-bold text-white">{user.gameStats.slotsPlayed}</p>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-4 rounded-xl border border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <Trophy size={20} className="text-green-400" />
                  </div>
                  <span className="text-green-400 font-semibold">Blackjack Wins</span>
                </div>
                <p className="text-2xl font-bold text-white">{user.gameStats.blackjackWins}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-4 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-full">
                    <TrendingUp size={20} className="text-purple-400" />
                  </div>
                  <span className="text-purple-400 font-semibold">Roulette Spins</span>
                </div>
                <p className="text-2xl font-bold text-white">{user.gameStats.rouletteSpins}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 p-4 rounded-xl border border-yellow-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-500/20 rounded-full">
                    <Crown size={20} className="text-yellow-400" />
                  </div>
                  <span className="text-yellow-400 font-semibold">Poker Hands</span>
                </div>
                <p className="text-2xl font-bold text-white">{user.gameStats.pokerHands}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h4 className="text-lg font-bold text-white mb-4">Gaming Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Games Played:</span>
                    <span className="text-white font-semibold">{user.gameStats.totalGamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Biggest Win:</span>
                    <span className="text-green-400 font-semibold">{user.gameStats.biggestWin.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Login Streak:</span>
                    <span className="text-blue-400 font-semibold">{user.gameStats.loginStreak} days</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h4 className="text-lg font-bold text-white mb-4">VIP Benefits</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Level:</span>
                    <span className={`font-semibold ${getVIPLevelColor(user.vipLevel)}`}>
                      {getVIPLevelName(user.vipLevel)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cashback Rate:</span>
                    <span className="text-green-400 font-semibold">{user.vipLevel * 2}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Bonus:</span>
                    <span className="text-yellow-400 font-semibold">{(user.vipLevel + 1) * 100}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h4 className="text-lg font-bold text-white mb-4">Account Status</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Email Verified:</span>
                    {user.emailVerified ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-400" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Phone Verified:</span>
                    {user.phoneVerified ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-400" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">KYC Verified:</span>
                    {user.kycVerified ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <Shield size={20} />
                <span className="font-semibold">Account Security</span>
              </div>
              <p className="text-gray-300 text-sm">
                Keep your account secure by enabling all verification methods and using a strong password.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Verification Status</h3>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Email Verification</span>
                    {user.emailVerified ? (
                      <span className="text-green-400 text-sm">Verified</span>
                    ) : (
                      <button className="text-blue-400 text-sm hover:underline">Verify Now</button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Phone Verification</span>
                    {user.phoneVerified ? (
                      <span className="text-green-400 text-sm">Verified</span>
                    ) : (
                      <button className="text-blue-400 text-sm hover:underline">Verify Now</button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{user.phoneNumber}</p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Identity Verification (KYC)</span>
                    {user.kycVerified ? (
                      <span className="text-green-400 text-sm">Verified</span>
                    ) : (
                      <button className="text-blue-400 text-sm hover:underline">Start KYC</button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">Required for withdrawals above $1,000</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Account Actions</h3>

                <button className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                  Change Password
                </button>

                <button className="w-full p-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors">
                  Two-Factor Authentication
                </button>

                <button className="w-full p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors">
                  Download Account Data
                </button>

                <button className="w-full p-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Communication Preferences</h3>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={user.preferences.emailNotifications}
                    onChange={(e) => updateUser({
                      preferences: {
                        ...user.preferences,
                        emailNotifications: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-white font-medium">Email Notifications</span>
                    <p className="text-gray-400 text-sm">Receive promotional emails and account updates</p>
                  </div>
                </label>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={user.preferences.smsNotifications}
                    onChange={(e) => updateUser({
                      preferences: {
                        ...user.preferences,
                        smsNotifications: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-white font-medium">SMS Notifications</span>
                    <p className="text-gray-400 text-sm">Receive important account alerts via SMS</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Responsible Gaming Limits</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <label className="block text-white font-medium mb-2">Daily Deposit Limit</label>
                  <input
                    type="number"
                    value={user.preferences.responsibleGamingLimits.dailyDepositLimit}
                    onChange={(e) => updateUser({
                      preferences: {
                        ...user.preferences,
                        responsibleGamingLimits: {
                          ...user.preferences.responsibleGamingLimits,
                          dailyDepositLimit: parseInt(e.target.value) || 0
                        }
                      }
                    })}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <label className="block text-white font-medium mb-2">Session Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={user.preferences.responsibleGamingLimits.sessionTimeLimit}
                    onChange={(e) => updateUser({
                      preferences: {
                        ...user.preferences,
                        responsibleGamingLimits: {
                          ...user.preferences.responsibleGamingLimits,
                          sessionTimeLimit: parseInt(e.target.value) || 0
                        }
                      }
                    })}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}