'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Calendar, Zap, Crown, Star } from 'lucide-react'

interface DailyBonusProps {
  isOpen: boolean
  onClose: () => void
  coins: number
  setCoins: (coins: number) => void
}

const dailyRewards = [
  { day: 1, coins: 100, type: 'coins', icon: '🪙' },
  { day: 2, coins: 200, type: 'coins', icon: '🪙' },
  { day: 3, coins: 300, type: 'coins', icon: '🪙' },
  { day: 4, coins: 500, type: 'coins', icon: '🪙' },
  { day: 5, coins: 750, type: 'coins', icon: '💰' },
  { day: 6, coins: 1000, type: 'coins', icon: '💰' },
  { day: 7, coins: 2000, type: 'mega', icon: '💎' }
]

const bonusEvents = [
  {
    id: 'weekend',
    name: 'Weekend Warrior',
    description: 'Double coins on weekends!',
    multiplier: 2,
    active: true,
    icon: '🎉'
  },
  {
    id: 'hourly',
    name: 'Hourly Surprise',
    description: 'Free coins every hour!',
    amount: 50,
    active: true,
    icon: '⏰'
  },
  {
    id: 'social',
    name: 'Social Bonus',
    description: 'Invite friends for rewards!',
    amount: 1000,
    active: false,
    icon: '👥'
  }
]

export default function DailyBonus({ isOpen, onClose, coins, setCoins }: DailyBonusProps) {
  const [currentDay, setCurrentDay] = useState(3) // Simulated current day
  const [claimed, setClaimed] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [claimedHourly, setClaimedHourly] = useState(false)

  const getCurrentDayReward = () => dailyRewards[currentDay - 1]

  const claimDailyBonus = () => {
    const reward = getCurrentDayReward()
    setCoins(coins + reward.coins)
    setClaimed(true)
    setShowCelebration(true)

    setTimeout(() => {
      setShowCelebration(false)
      onClose()
    }, 3000)
  }

  const claimHourlyBonus = () => {
    setCoins(coins + 50)
    setClaimedHourly(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-yellow-500/30"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Gift className="text-yellow-400" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-yellow-400">Daily Rewards</h2>
              <p className="text-gray-300">Claim your daily bonus and keep your streak!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-60"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-4xl font-bold text-yellow-400 mb-2">Bonus Claimed!</h3>
              <p className="text-2xl text-white">+{getCurrentDayReward().coins} coins added!</p>
            </div>
          </motion.div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">7-Day Streak Bonus</h3>
            <div className="flex items-center gap-2 text-yellow-400">
              <Calendar size={20} />
              <span className="font-bold">Day {currentDay}</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {dailyRewards.map((reward, index) => {
              const isCurrentDay = reward.day === currentDay
              const isPastDay = reward.day < currentDay
              const isFutureDay = reward.day > currentDay

              return (
                <motion.div
                  key={reward.day}
                  whileHover={isCurrentDay ? { scale: 1.05 } : {}}
                  className={`relative p-4 rounded-xl text-center border-2 ${
                    isCurrentDay
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500 shadow-lg shadow-yellow-500/20'
                      : isPastDay
                      ? 'bg-gray-800 border-green-500/50 opacity-75'
                      : 'bg-gray-800 border-gray-600 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{reward.icon}</div>
                  <div className="text-xs text-gray-400 mb-1">Day {reward.day}</div>
                  <div className={`font-bold ${isCurrentDay ? 'text-yellow-400' : 'text-white'}`}>
                    {reward.coins} coins
                  </div>
                  {isPastDay && (
                    <div className="absolute top-1 right-1 text-green-500">
                      ✓
                    </div>
                  )}
                  {isCurrentDay && !claimed && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold"
                    >
                      CLAIM
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {!claimed && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={claimDailyBonus}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-xl rounded-xl transition-all shadow-lg"
            >
              Claim Day {currentDay} Bonus ({getCurrentDayReward().coins} coins)
            </motion.button>
          )}

          {claimed && (
            <div className="w-full py-4 bg-green-600 text-white font-bold text-xl rounded-xl text-center">
              ✓ Today's Bonus Claimed!
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-2xl font-bold text-white mb-4">Bonus Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bonusEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-xl border-2 ${
                  event.active
                    ? 'bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/50'
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{event.icon}</div>
                  <div>
                    <h4 className={`font-bold ${event.active ? 'text-green-400' : 'text-gray-400'}`}>
                      {event.name}
                    </h4>
                    {event.active && (
                      <span className="text-xs text-green-400 font-semibold">ACTIVE</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{event.description}</p>

                {event.id === 'hourly' && event.active && (
                  <button
                    onClick={claimHourlyBonus}
                    disabled={claimedHourly}
                    className={`w-full py-2 rounded-lg font-semibold transition-all ${
                      claimedHourly
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {claimedHourly ? 'Claimed (58m left)' : 'Claim 50 Coins'}
                  </button>
                )}

                {event.id === 'social' && (
                  <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all">
                    Invite Friends
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-yellow-400" size={16} />
            <span className="text-sm font-semibold text-yellow-400">Pro Tips</span>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Login daily to maintain your streak and get bigger rewards</li>
            <li>• Day 7 gives you a mega bonus - don&apos;t miss it!</li>
            <li>• Check back hourly for surprise bonuses</li>
            <li>• Invite friends to unlock exclusive social bonuses</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}