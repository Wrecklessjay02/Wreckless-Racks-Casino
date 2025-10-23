'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown,
  Star,
  Gift,
  TrendingUp,
  Calendar,
  Zap,
  Diamond,
  Trophy,
  X,
  ChevronRight
} from 'lucide-react'

interface VIPSystemProps {
  coins: number
  totalWagered: number
  onCoinsUpdate: (coins: number) => void
}

interface VIPTier {
  id: number
  name: string
  minWagered: number
  color: string
  bgGradient: string
  benefits: string[]
  dailyBonus: number
  cashbackRate: number
  icon: string
}

const vipTiers: VIPTier[] = [
  {
    id: 1,
    name: 'Bronze',
    minWagered: 0,
    color: 'text-amber-600',
    bgGradient: 'from-amber-700/20 to-orange-700/20',
    benefits: ['Daily bonus: 100 coins', 'Email support', 'Basic tournaments'],
    dailyBonus: 100,
    cashbackRate: 0,
    icon: '🥉'
  },
  {
    id: 2,
    name: 'Silver',
    minWagered: 25000,
    color: 'text-gray-300',
    bgGradient: 'from-gray-500/20 to-gray-600/20',
    benefits: ['Daily bonus: 300 coins', 'Priority support', '2% cashback', 'Silver tournaments'],
    dailyBonus: 300,
    cashbackRate: 0.02,
    icon: '🥈'
  },
  {
    id: 3,
    name: 'Gold',
    minWagered: 100000,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    benefits: ['Daily bonus: 750 coins', 'Personal manager', '5% cashback', 'Exclusive games', 'Gold tournaments'],
    dailyBonus: 750,
    cashbackRate: 0.05,
    icon: '🥇'
  },
  {
    id: 4,
    name: 'Platinum',
    minWagered: 500000,
    color: 'text-purple-300',
    bgGradient: 'from-purple-500/20 to-indigo-500/20',
    benefits: ['Daily bonus: 1500 coins', 'VIP support', '8% cashback', 'Higher limits', 'Platinum events'],
    dailyBonus: 1500,
    cashbackRate: 0.08,
    icon: '💎'
  },
  {
    id: 5,
    name: 'Diamond',
    minWagered: 2000000,
    color: 'text-cyan-300',
    bgGradient: 'from-cyan-400/20 to-blue-500/20',
    benefits: ['Daily bonus: 3000 coins', '24/7 VIP support', '12% cashback', 'Exclusive games', 'Diamond privileges'],
    dailyBonus: 3000,
    cashbackRate: 0.12,
    icon: '💍'
  },
  {
    id: 6,
    name: 'Elite',
    minWagered: 10000000,
    color: 'text-red-400',
    bgGradient: 'from-red-500/20 to-pink-500/20',
    benefits: ['Daily bonus: 5000 coins', 'Dedicated host', '15% cashback', 'Custom rewards', 'Elite access'],
    dailyBonus: 5000,
    cashbackRate: 0.15,
    icon: '👑'
  }
]

export default function VIPSystem({ coins, totalWagered, onCoinsUpdate }: VIPSystemProps) {
  const [currentTier, setCurrentTier] = useState<VIPTier>(vipTiers[0])
  const [showVIPModal, setShowVIPModal] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [lastClaimedDaily, setLastClaimedDaily] = useState<string | null>(null)
  const [vipPoints, setVipPoints] = useState(0)

  useEffect(() => {
    // Calculate current VIP tier
    let newTier = vipTiers[0]
    for (const tier of vipTiers) {
      if (totalWagered >= tier.minWagered) {
        newTier = tier
      }
    }

    // Check for level up
    if (newTier.id > currentTier.id) {
      setCurrentTier(newTier)
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 5000)
    } else {
      setCurrentTier(newTier)
    }

    // Update VIP points (1 point per 100 coins wagered)
    setVipPoints(Math.floor(totalWagered / 100))
  }, [totalWagered, currentTier.id])

  const getNextTier = () => {
    const nextIndex = vipTiers.findIndex(tier => tier.id === currentTier.id) + 1
    return nextIndex < vipTiers.length ? vipTiers[nextIndex] : null
  }

  const getProgressToNext = () => {
    const nextTier = getNextTier()
    if (!nextTier) return 100

    const progress = ((totalWagered - currentTier.minWagered) / (nextTier.minWagered - currentTier.minWagered)) * 100
    return Math.min(progress, 100)
  }

  const claimDailyVIPBonus = () => {
    const today = new Date().toDateString()
    if (lastClaimedDaily === today) return

    onCoinsUpdate(coins + currentTier.dailyBonus)
    setLastClaimedDaily(today)
    localStorage.setItem('vip_daily_claimed', today)
  }

  const canClaimDaily = () => {
    const today = new Date().toDateString()
    return lastClaimedDaily !== today
  }

  useEffect(() => {
    const stored = localStorage.getItem('vip_daily_claimed')
    setLastClaimedDaily(stored)
  }, [])

  const nextTier = getNextTier()
  const progress = getProgressToNext()

  return (
    <>
      {/* VIP Status Bar */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-3 rounded-lg border border-purple-500/30 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentTier.icon}</span>
            <div>
              <span className={`font-bold ${currentTier.color}`}>VIP {currentTier.name}</span>
              <div className="text-xs text-gray-400">{vipPoints.toLocaleString()} points</div>
            </div>
          </div>
          <button
            onClick={() => setShowVIPModal(true)}
            className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-white text-sm transition-all"
          >
            <Crown size={14} />
            VIP Center
          </button>
        </div>

        {nextTier && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress to {nextTier.name}</span>
              <span>{totalWagered.toLocaleString()} / {nextTier.minWagered.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}

        {canClaimDaily() && (
          <motion.button
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={claimDailyVIPBonus}
            className="w-full mt-2 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-lg transition-all text-sm"
          >
            <Gift className="inline mr-2" size={16} />
            Claim VIP Daily Bonus ({currentTier.dailyBonus} coins)
          </motion.button>
        )}
      </div>

      {/* Level Up Notification */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl shadow-2xl border border-yellow-500/50"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-2"
              >
                {currentTier.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-1">VIP LEVEL UP!</h3>
              <p className="text-yellow-400 font-semibold">
                Welcome to {currentTier.name} tier!
              </p>
              <p className="text-white text-sm mt-2">
                New daily bonus: {currentTier.dailyBonus} coins
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIP Modal */}
      {showVIPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-purple-500/30"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Crown className="text-purple-400" size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-white">VIP Center</h2>
                  <p className="text-gray-300">Exclusive benefits and rewards</p>
                </div>
              </div>
              <button
                onClick={() => setShowVIPModal(false)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Current Status */}
            <div className={`bg-gradient-to-r ${currentTier.bgGradient} p-6 rounded-xl mb-6 border border-purple-500/30`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{currentTier.icon}</span>
                  <div>
                    <h3 className={`text-2xl font-bold ${currentTier.color}`}>
                      VIP {currentTier.name}
                    </h3>
                    <p className="text-gray-300">Current Tier</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{vipPoints.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">VIP Points</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{currentTier.dailyBonus}</div>
                  <div className="text-gray-400 text-sm">Daily Bonus</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{(currentTier.cashbackRate * 100)}%</div>
                  <div className="text-gray-400 text-sm">Cashback Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">{totalWagered.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Total Wagered</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2">Your Benefits:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <Star className="text-yellow-500" size={16} />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* All Tiers */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">All VIP Tiers</h3>
              <div className="space-y-3">
                {vipTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      tier.id === currentTier.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : tier.id < currentTier.id
                        ? 'border-green-500/50 bg-green-500/5'
                        : 'border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tier.icon}</span>
                      <div>
                        <span className={`font-bold ${tier.color}`}>{tier.name}</span>
                        <div className="text-xs text-gray-400">
                          {tier.minWagered.toLocaleString()} coins wagered
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">{tier.dailyBonus} daily bonus</div>
                      <div className="text-xs text-gray-400">{(tier.cashbackRate * 100)}% cashback</div>
                    </div>
                    {tier.id === currentTier.id && (
                      <div className="text-purple-400 font-bold">CURRENT</div>
                    )}
                    {tier.id < currentTier.id && (
                      <div className="text-green-400 font-bold">UNLOCKED</div>
                    )}
                    {tier.id > currentTier.id && (
                      <ChevronRight className="text-gray-500" size={20} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}