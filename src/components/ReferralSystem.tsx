'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import {
  Users,
  Copy,
  Gift,
  Share2,
  Crown,
  TrendingUp,
  Check,
  DollarSign,
  Star
} from 'lucide-react'

interface ReferralSystemProps {
  isOpen: boolean
  onClose: () => void
}

interface Referral {
  id: string
  username: string
  joinDate: string
  status: 'pending' | 'active' | 'completed'
  reward: number
  level: number
}

export default function ReferralSystem({ isOpen, onClose }: ReferralSystemProps) {
  const { user, updateCoins } = useUser()
  const [activeTab, setActiveTab] = useState<'invite' | 'rewards' | 'leaderboard'>('invite')
  const [referralCode, setReferralCode] = useState('')
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [totalEarned, setTotalEarned] = useState(0)
  const [copied, setCopied] = useState(false)
  const [pendingRewards, setPendingRewards] = useState(0)

  useEffect(() => {
    if (user) {
      // Generate unique referral code
      setReferralCode(`WRECK${user.id.slice(-6).toUpperCase()}`)

      // Load mock referral data
      const mockReferrals: Referral[] = [
        {
          id: '1',
          username: 'PlayerOne',
          joinDate: '2024-01-15',
          status: 'completed',
          reward: 1000,
          level: 3
        },
        {
          id: '2',
          username: 'LuckyWinner',
          joinDate: '2024-01-18',
          status: 'active',
          reward: 500,
          level: 2
        },
        {
          id: '3',
          username: 'NewPlayer',
          joinDate: '2024-01-20',
          status: 'pending',
          reward: 250,
          level: 1
        }
      ]

      setReferrals(mockReferrals)
      setTotalEarned(mockReferrals.reduce((sum, ref) => sum + (ref.status === 'completed' ? ref.reward : 0), 0))
      setPendingRewards(mockReferrals.reduce((sum, ref) => sum + (ref.status === 'pending' ? ref.reward : 0), 0))
    }
  }, [user])

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareReferral = async () => {
    const shareData = {
      title: 'Join Wreckless Racks Casino!',
      text: `Use my referral code ${referralCode} and get 500 bonus coins!`,
      url: `https://wrecklessracks.vercel.app?ref=${referralCode}`
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback - copy to clipboard
      await navigator.clipboard.writeText(
        `Join Wreckless Racks Casino with my code ${referralCode} for 500 bonus coins! https://wrecklessracks.vercel.app?ref=${referralCode}`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const claimRewards = () => {
    if (pendingRewards > 0 && user) {
      updateCoins(user.coins + pendingRewards)
      setPendingRewards(0)
      setReferrals(prev => prev.map(ref =>
        ref.status === 'pending' ? { ...ref, status: 'completed' } : ref
      ))
      setTotalEarned(prev => prev + pendingRewards)
    }
  }

  const getVIPLevel = (earned: number) => {
    if (earned >= 50000) return { name: 'Elite Ambassador', icon: '👑', color: 'text-purple-400' }
    if (earned >= 25000) return { name: 'Diamond Recruiter', icon: '💎', color: 'text-blue-400' }
    if (earned >= 10000) return { name: 'Gold Inviter', icon: '🥇', color: 'text-yellow-400' }
    if (earned >= 5000) return { name: 'Silver Referrer', icon: '🥈', color: 'text-gray-400' }
    if (earned >= 1000) return { name: 'Bronze Member', icon: '🥉', color: 'text-orange-400' }
    return { name: 'New Recruiter', icon: '⭐', color: 'text-green-400' }
  }

  const vipLevel = getVIPLevel(totalEarned)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-purple-400" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-white">Referral System</h2>
              <p className="text-gray-400">Invite friends, earn rewards!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* VIP Status */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 rounded-xl border border-purple-500/50 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{vipLevel.icon}</span>
              <div>
                <h3 className={`font-bold ${vipLevel.color}`}>{vipLevel.name}</h3>
                <p className="text-sm text-gray-400">Total Earned: {totalEarned.toLocaleString()} coins</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold">{referrals.length} Referrals</p>
              <p className="text-green-400 text-sm">+{pendingRewards} pending</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-xl">
          {[
            { id: 'invite', label: 'Invite Friends', icon: Share2 },
            { id: 'rewards', label: 'My Rewards', icon: Gift },
            { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all flex-1 justify-center ${
                activeTab === id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'invite' && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Referral Code */}
              <div className="bg-black/40 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Your Referral Code</h3>
                <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
                  <code className="text-yellow-400 font-mono text-xl flex-1">{referralCode}</code>
                  <button
                    onClick={copyReferralCode}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Referral Benefits */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="text-green-400" size={20} />
                    <h4 className="font-bold text-green-400">Your Friend Gets</h4>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 500 bonus coins on signup</li>
                    <li>• VIP status boost</li>
                    <li>• Exclusive welcome bonus</li>
                  </ul>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-purple-400" size={20} />
                    <h4 className="font-bold text-purple-400">You Earn</h4>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 250 coins when they join</li>
                    <li>• 500 coins when they reach level 2</li>
                    <li>• 1000 coins when they reach level 5</li>
                  </ul>
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={shareReferral}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all"
              >
                <Share2 size={20} />
                Share Referral Link
              </button>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Pending Rewards */}
              {pendingRewards > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-yellow-400">Pending Rewards</h4>
                      <p className="text-gray-300">{pendingRewards.toLocaleString()} coins ready to claim</p>
                    </div>
                    <button
                      onClick={claimRewards}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
                    >
                      Claim All
                    </button>
                  </div>
                </div>
              )}

              {/* Referral List */}
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-black/40 p-4 rounded-xl border border-gray-700 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {referral.username[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{referral.username}</h4>
                        <p className="text-sm text-gray-400">Joined {referral.joinDate} • Level {referral.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        referral.status === 'completed' ? 'text-green-400' :
                        referral.status === 'active' ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        +{referral.reward} coins
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{referral.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Top Referrers */}
              {[
                { rank: 1, name: 'MegaRecruiter', referrals: 847, earned: 125000, icon: '👑' },
                { rank: 2, name: 'GoldInviter', referrals: 623, earned: 95000, icon: '🥇' },
                { rank: 3, name: 'SilverPro', referrals: 445, earned: 67000, icon: '🥈' },
                { rank: 4, name: user?.username || 'You', referrals: referrals.length, earned: totalEarned, icon: '⭐' },
                { rank: 5, name: 'BronzeKing', referrals: 156, earned: 23000, icon: '🥉' }
              ].map((player) => (
                <div
                  key={player.rank}
                  className={`p-4 rounded-xl border flex justify-between items-center ${
                    player.name === user?.username || player.name === 'You'
                      ? 'bg-purple-900/30 border-purple-500/50'
                      : 'bg-black/40 border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{player.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">#{player.rank}</span>
                        <h4 className="font-bold text-white">{player.name}</h4>
                        {player.name === user?.username || player.name === 'You' && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">YOU</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{player.referrals} referrals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400">{player.earned.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">coins earned</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}