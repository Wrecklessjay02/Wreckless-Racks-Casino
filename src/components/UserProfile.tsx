'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Crown, Star, Trophy, Gift, Users, Calendar, Zap, Target } from 'lucide-react'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
  coins: number
}

const vipLevels = [
  { level: 1, name: 'Bronze', minCoins: 0, color: 'text-amber-600', benefits: ['Daily bonus: 100 coins', 'Email support'] },
  { level: 2, name: 'Silver', minCoins: 10000, color: 'text-gray-400', benefits: ['Daily bonus: 200 coins', 'Priority support', '5% bonus coins'] },
  { level: 3, name: 'Gold', minCoins: 50000, color: 'text-yellow-500', benefits: ['Daily bonus: 500 coins', 'Personal account manager', '10% bonus coins', 'Exclusive tournaments'] },
  { level: 4, name: 'Platinum', minCoins: 150000, color: 'text-purple-400', benefits: ['Daily bonus: 1000 coins', 'VIP support', '15% bonus coins', 'Higher limits', 'Special events'] },
  { level: 5, name: 'Diamond', minCoins: 500000, color: 'text-blue-400', benefits: ['Daily bonus: 2500 coins', '24/7 VIP support', '25% bonus coins', 'Exclusive games', 'Custom rewards'] }
]

const achievements = [
  { id: 'first_win', name: 'First Win', description: 'Win your first game', icon: '🏆', unlocked: true },
  { id: 'big_winner', name: 'Big Winner', description: 'Win 10,000 coins in a single game', icon: '💰', unlocked: true },
  { id: 'slot_master', name: 'Slot Master', description: 'Play 100 slot games', icon: '🎰', unlocked: false },
  { id: 'card_shark', name: 'Card Shark', description: 'Win 50 blackjack hands', icon: '🃏', unlocked: false },
  { id: 'high_roller', name: 'High Roller', description: 'Bet 100,000 coins total', icon: '💎', unlocked: false },
  { id: 'daily_player', name: 'Daily Player', description: 'Play 7 days in a row', icon: '📅', unlocked: true },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Add 10 friends', icon: '👥', unlocked: false },
  { id: 'jackpot_hunter', name: 'Jackpot Hunter', description: 'Hit a progressive jackpot', icon: '🎯', unlocked: false }
]

const userStats = {
  totalWagered: 125000,
  totalWon: 98000,
  gamesPlayed: 342,
  biggestWin: 15000,
  currentStreak: 3,
  joinDate: '2024-01-15',
  lastLogin: '2024-10-18',
  favoriteGame: 'Lucky Slots'
}

export default function UserProfile({ isOpen, onClose, coins }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'vip' | 'stats'>('profile')

  const getCurrentVipLevel = () => {
    let currentLevel = vipLevels[0]
    for (const level of vipLevels) {
      if (coins >= level.minCoins) {
        currentLevel = level
      }
    }
    return currentLevel
  }

  const getNextVipLevel = () => {
    const currentLevel = getCurrentVipLevel()
    const nextIndex = vipLevels.findIndex(l => l.level === currentLevel.level) + 1
    return nextIndex < vipLevels.length ? vipLevels[nextIndex] : null
  }

  const currentVip = getCurrentVipLevel()
  const nextVip = getNextVipLevel()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-yellow-500/30"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl">
              🎰
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Player Profile</h2>
              <div className="flex items-center gap-2">
                <Crown className={currentVip.color} size={20} />
                <span className={`font-semibold ${currentVip.color}`}>{currentVip.name} Member</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: <Users size={16} /> },
            { id: 'achievements', label: 'Achievements', icon: <Trophy size={16} /> },
            { id: 'vip', label: 'VIP Status', icon: <Crown size={16} /> },
            { id: 'stats', label: 'Statistics', icon: <Target size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'achievements' | 'vip' | 'stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Account Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Player ID:</span>
                    <span className="text-white font-mono">#WR7834</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-white">Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Login:</span>
                    <span className="text-white">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Balance:</span>
                    <span className="text-yellow-400 font-bold">{coins.toLocaleString()} coins</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Games Played:</span>
                    <span className="text-white">{userStats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Biggest Win:</span>
                    <span className="text-green-400">{userStats.biggestWin.toLocaleString()} coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Streak:</span>
                    <span className="text-blue-400">{userStats.currentStreak} games</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Favorite Game:</span>
                    <span className="text-white">{userStats.favoriteGame}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50'
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className={`font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    {achievement.unlocked && (
                      <span className="text-xs text-green-400 font-semibold">UNLOCKED</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vip' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/50 to-yellow-900/50 p-6 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Crown className={currentVip.color} size={24} />
                <h3 className="text-2xl font-bold text-white">Current VIP Status</h3>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xl font-bold ${currentVip.color}`}>{currentVip.name} Level</span>
                <span className="text-yellow-400 font-bold">Level {currentVip.level}</span>
              </div>

              {nextVip && (
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress to {nextVip.name}</span>
                    <span>{coins.toLocaleString()} / {nextVip.minCoins.toLocaleString()} coins</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((coins / nextVip.minCoins) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xl font-bold text-white mb-4">Your VIP Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentVip.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300">
                    <Star className="text-yellow-500" size={16} />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="text-xl font-bold text-white mb-4">All VIP Levels</h4>
              <div className="space-y-3">
                {vipLevels.map((level) => (
                  <div
                    key={level.level}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      level.level === currentVip.level ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Crown className={level.color} size={20} />
                      <span className={`font-semibold ${level.color}`}>{level.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{level.minCoins.toLocaleString()} coins</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4">Betting Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Total Wagered</span>
                    <span className="text-white font-bold">{userStats.totalWagered.toLocaleString()} coins</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Total Won</span>
                    <span className="text-green-400 font-bold">{userStats.totalWon.toLocaleString()} coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Net Result</span>
                    <span className={`font-bold ${userStats.totalWon - userStats.totalWagered >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(userStats.totalWon - userStats.totalWagered).toLocaleString()} coins
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4">Game Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Win Rate:</span>
                  <span className="text-green-400 font-bold">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Bet:</span>
                  <span className="text-white">365 coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Biggest Win:</span>
                  <span className="text-yellow-400 font-bold">{userStats.biggestWin.toLocaleString()} coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Streak:</span>
                  <span className="text-blue-400 font-bold">{userStats.currentStreak} wins</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}