'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  Trophy,
  Crown,
  Medal,
  Star,
  Gift,
  MessageCircle,
  Search,
  X,
  Copy,
  Check,
  Zap,
  Target,
  Calendar
} from 'lucide-react'

interface Friend {
  id: string
  username: string
  avatar: string
  level: number
  lastSeen: string
  isOnline: boolean
  totalWins: number
  favoriteGame: string
}

interface LeaderboardEntry {
  id: string
  username: string
  avatar: string
  score: number
  rank: number
  change: number // +1, -1, 0 for rank change
  isCurrentUser?: boolean
}

interface SocialSystemProps {
  isOpen: boolean
  onClose: () => void
  currentUser: {
    id: string
    username: string
    coins: number
    totalWins: number
  }
}

export default function SocialSystem({ isOpen, onClose, currentUser }: SocialSystemProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'leaderboard' | 'find'>('friends')
  const [leaderboardType, setLeaderboardType] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('weekly')
  const [searchQuery, setSearchQuery] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Mock data
  const [friends] = useState<Friend[]>([
    {
      id: '1',
      username: 'LuckyPlayer99',
      avatar: '🎰',
      level: 15,
      lastSeen: 'Online now',
      isOnline: true,
      totalWins: 47,
      favoriteGame: 'MEGA SLOTS'
    },
    {
      id: '2',
      username: 'CardShark',
      avatar: '🃏',
      level: 22,
      lastSeen: '2 hours ago',
      isOnline: false,
      totalWins: 89,
      favoriteGame: 'Blackjack'
    },
    {
      id: '3',
      username: 'RouletteKing',
      avatar: '🎯',
      level: 18,
      lastSeen: 'Online now',
      isOnline: true,
      totalWins: 63,
      favoriteGame: 'Roulette'
    },
    {
      id: '4',
      username: 'SlotMaster',
      avatar: '👑',
      level: 31,
      lastSeen: '1 day ago',
      isOnline: false,
      totalWins: 156,
      favoriteGame: 'Lucky Slots'
    }
  ])

  const [leaderboards] = useState({
    daily: [
      { id: '1', username: 'HighRoller23', avatar: '💎', score: 45280, rank: 1, change: 2 },
      { id: '2', username: 'LuckyStreak', avatar: '🍀', score: 42150, rank: 2, change: -1 },
      { id: '3', username: 'CardCounter', avatar: '🃏', score: 38950, rank: 3, change: 1 },
      { id: '4', username: currentUser.username, avatar: '🎰', score: 35600, rank: 4, change: 0, isCurrentUser: true },
      { id: '5', username: 'SpinDoctor', avatar: '⚡', score: 33200, rank: 5, change: -3 }
    ],
    weekly: [
      { id: '1', username: 'MegaWinner', avatar: '👑', score: 187500, rank: 1, change: 0 },
      { id: '2', username: 'JackpotHunter', avatar: '💰', score: 165200, rank: 2, change: 1 },
      { id: '3', username: 'VIPPlayer', avatar: '💎', score: 142800, rank: 3, change: -1 },
      { id: '4', username: 'LuckyLady', avatar: '🌟', score: 128400, rank: 4, change: 2 },
      { id: '5', username: currentUser.username, avatar: '🎰', score: 115600, rank: 5, change: 1, isCurrentUser: true }
    ],
    monthly: [
      { id: '1', username: 'CasinoLegend', avatar: '🏆', score: 892300, rank: 1, change: 0 },
      { id: '2', username: 'MillionaireMaker', avatar: '💸', score: 756800, rank: 2, change: 0 },
      { id: '3', username: currentUser.username, avatar: '🎰', score: 623400, rank: 3, change: 2, isCurrentUser: true },
      { id: '4', username: 'PokerPro', avatar: '♠️', score: 587200, rank: 4, change: -1 },
      { id: '5', username: 'RouletteRoyalty', avatar: '🎯', score: 534900, rank: 5, change: -1 }
    ],
    alltime: [
      { id: '1', username: 'CasinoGod', avatar: '👑', score: 5420000, rank: 1, change: 0 },
      { id: '2', username: 'LegendaryPlayer', avatar: '⚡', score: 4830000, rank: 2, change: 0 },
      { id: '3', username: 'MasterGambler', avatar: '💎', score: 4250000, rank: 3, change: 0 },
      { id: '4', username: 'EliteWinner', avatar: '🌟', score: 3890000, rank: 4, change: 1 },
      { id: '5', username: currentUser.username, avatar: '🎰', score: 3420000, rank: 5, change: -1, isCurrentUser: true }
    ]
  })

  const referralCode = 'WRECKLESS2024'
  const referralLink = `https://wrecklessracks.vercel.app?ref=${referralCode}`

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={20} />
      case 2: return <Medal className="text-gray-300" size={20} />
      case 3: return <Medal className="text-amber-600" size={20} />
      default: return <span className="text-gray-400 font-bold">#{rank}</span>
    }
  }

  const getRankChange = (change: number) => {
    if (change > 0) return <span className="text-green-400 text-xs">↗ +{change}</span>
    if (change < 0) return <span className="text-red-400 text-xs">↘ {change}</span>
    return <span className="text-gray-400 text-xs">—</span>
  }

  const currentLeaderboard = leaderboards[leaderboardType]

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-purple-500/30"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Users className="text-purple-400" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-white">Social Center</h2>
                <p className="text-gray-300">Connect with players and compete on leaderboards</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'friends', label: 'Friends', icon: <Users size={16} /> },
              { id: 'leaderboard', label: 'Leaderboards', icon: <Trophy size={16} /> },
              { id: 'find', label: 'Find Players', icon: <Search size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Your Friends ({friends.length})</h3>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                >
                  <UserPlus size={16} />
                  Invite Friends
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
                          {friend.avatar}
                        </div>
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{friend.username}</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-400">Level {friend.level}</span>
                          <span className="text-gray-400">•</span>
                          <span className={friend.isOnline ? 'text-green-400' : 'text-gray-400'}>
                            {friend.lastSeen}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{friend.totalWins}</div>
                        <div className="text-xs text-gray-400">Total Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-400">{friend.favoriteGame}</div>
                        <div className="text-xs text-gray-400">Favorite Game</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-all">
                        <MessageCircle className="inline mr-1" size={14} />
                        Chat
                      </button>
                      <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded transition-all">
                        <Gift className="inline mr-1" size={14} />
                        Send Gift
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {friends.length === 0 && (
                <div className="text-center py-12">
                  <Users className="text-gray-600 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No friends yet</h3>
                  <p className="text-gray-500 mb-4">Invite friends to start competing and earning rewards together!</p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all"
                  >
                    Invite Your First Friend
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'daily', label: 'Daily', icon: <Calendar size={14} /> },
                  { id: 'weekly', label: 'Weekly', icon: <Star size={14} /> },
                  { id: 'monthly', label: 'Monthly', icon: <Trophy size={14} /> },
                  { id: 'alltime', label: 'All Time', icon: <Crown size={14} /> }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setLeaderboardType(type.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      leaderboardType === type.id
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 border-b border-gray-600">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy className="text-yellow-400" size={24} />
                    {leaderboardType.charAt(0).toUpperCase() + leaderboardType.slice(1)} Leaderboard
                  </h3>
                  <p className="text-gray-300 text-sm">Top players by total winnings</p>
                </div>

                <div className="space-y-0">
                  {currentLeaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 border-b border-gray-700 last:border-b-0 ${
                        entry.isCurrentUser ? 'bg-purple-500/10 border-purple-500/30' : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-[60px]">
                        {getRankIcon(entry.rank)}
                        {entry.rank <= 3 && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            ✨
                          </motion.div>
                        )}
                      </div>

                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                        {entry.avatar}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${entry.isCurrentUser ? 'text-purple-400' : 'text-white'}`}>
                            {entry.username}
                          </span>
                          {entry.isCurrentUser && (
                            <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">YOU</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {entry.score.toLocaleString()} coins won
                        </div>
                      </div>

                      <div className="text-right">
                        {getRankChange(entry.change)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Rewards Info */}
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-4 rounded-xl border border-yellow-500/30">
                <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                  <Gift size={16} />
                  Leaderboard Rewards
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">🥇 1st Place</div>
                    <div className="text-white">50,000 coins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-300 font-bold">🥈 2nd Place</div>
                    <div className="text-white">25,000 coins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-600 font-bold">🥉 3rd Place</div>
                    <div className="text-white">10,000 coins</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Find Players Tab */}
          {activeTab === 'find' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for players..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="text-center py-8">
                <Search className="text-gray-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Find Players</h3>
                <p className="text-gray-500">Search for players by username to add them as friends</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-md w-full mx-4 border border-green-500/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Invite Friends</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                <h4 className="font-bold text-green-400 mb-2">🎁 Referral Rewards</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• You get 5,000 coins for each friend who joins</li>
                  <li>• Your friend gets 2,500 bonus coins</li>
                  <li>• Earn 10% of their first purchase as bonus coins</li>
                </ul>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Your Referral Link:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-400 text-sm mt-2">Link copied to clipboard!</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
                  Share on Facebook
                </button>
                <button className="py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-all">
                  Share on Twitter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}