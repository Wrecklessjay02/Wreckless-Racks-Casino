'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  Trophy,
  Star,
  Zap,
  Calendar,
  Gift,
  Medal,
  Crown,
  Diamond,
  X,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'special'
  progress: number
  target: number
  reward: number
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  completed: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  category: 'games' | 'social' | 'spending' | 'special'
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  unlockedAt?: string
  reward: number
}

interface ChallengesAchievementsProps {
  isOpen: boolean
  onClose: () => void
  coins: number
  onCoinsUpdate: (coins: number) => void
  gameStats: {
    slotsPlayed: number
    blackjackWins: number
    rouletteSpins: number
    pokerHands: number
    totalWagered: number
    biggestWin: number
    loginStreak: number
  }
}

const initialChallenges: Challenge[] = [
  {
    id: 'daily_slots',
    title: 'Slot Spinner',
    description: 'Play 10 slot games',
    type: 'daily',
    progress: 0,
    target: 10,
    reward: 500,
    icon: '🎰',
    difficulty: 'easy',
    completed: false
  },
  {
    id: 'daily_blackjack',
    title: 'Card Master',
    description: 'Win 5 blackjack hands',
    type: 'daily',
    progress: 0,
    target: 5,
    reward: 750,
    icon: '🃏',
    difficulty: 'medium',
    completed: false
  },
  {
    id: 'daily_wagered',
    title: 'High Roller',
    description: 'Wager 5,000 coins',
    type: 'daily',
    progress: 0,
    target: 5000,
    reward: 1000,
    icon: '💰',
    difficulty: 'hard',
    completed: false
  },
  {
    id: 'weekly_variety',
    title: 'Game Explorer',
    description: 'Play all 5 different games',
    type: 'weekly',
    progress: 0,
    target: 5,
    reward: 2500,
    icon: '🎮',
    difficulty: 'medium',
    completed: false
  },
  {
    id: 'weekly_big_win',
    title: 'Jackpot Hunter',
    description: 'Win 10,000+ coins in a single game',
    type: 'weekly',
    progress: 0,
    target: 1,
    reward: 5000,
    icon: '💎',
    difficulty: 'hard',
    completed: false
  }
]

const initialAchievements: Achievement[] = [
  {
    id: 'first_spin',
    title: 'First Spin',
    description: 'Play your first slot game',
    category: 'games',
    icon: '🎰',
    rarity: 'common',
    unlocked: false,
    reward: 100
  },
  {
    id: 'slot_master',
    title: 'Slot Master',
    description: 'Play 100 slot games',
    category: 'games',
    icon: '🎯',
    rarity: 'rare',
    unlocked: false,
    reward: 1000
  },
  {
    id: 'blackjack_pro',
    title: 'Blackjack Pro',
    description: 'Win 50 blackjack hands',
    category: 'games',
    icon: '♠️',
    rarity: 'epic',
    unlocked: false,
    reward: 2500
  },
  {
    id: 'big_spender',
    title: 'Big Spender',
    description: 'Purchase 100,000 coins',
    category: 'spending',
    icon: '💳',
    rarity: 'rare',
    unlocked: false,
    reward: 5000
  },
  {
    id: 'lucky_seven',
    title: 'Lucky Seven',
    description: 'Login 7 days in a row',
    category: 'social',
    icon: '🍀',
    rarity: 'epic',
    unlocked: false,
    reward: 7777
  },
  {
    id: 'millionaire',
    title: 'Millionaire',
    description: 'Accumulate 1,000,000 coins',
    category: 'special',
    icon: '👑',
    rarity: 'legendary',
    unlocked: false,
    reward: 50000
  }
]

export default function ChallengesAchievements({
  isOpen,
  onClose,
  coins,
  onCoinsUpdate,
  gameStats
}: ChallengesAchievementsProps) {
  const [activeTab, setActiveTab] = useState<'challenges' | 'achievements'>('challenges')
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges)
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [showReward, setShowReward] = useState<{ type: 'challenge' | 'achievement', item: any } | null>(null)

  // Check for completed challenges and achievements
  useEffect(() => {
    // Update challenge progress based on game stats
    setChallenges(prev => prev.map(challenge => {
      let newProgress = challenge.progress

      switch (challenge.id) {
        case 'daily_slots':
          newProgress = gameStats.slotsPlayed
          break
        case 'daily_blackjack':
          newProgress = gameStats.blackjackWins
          break
        case 'daily_wagered':
          newProgress = gameStats.totalWagered
          break
        case 'weekly_variety':
          // Count unique games played (simplified)
          newProgress = Math.min(gameStats.slotsPlayed > 0 ? 1 : 0 +
                               gameStats.blackjackWins > 0 ? 1 : 0 +
                               gameStats.rouletteSpins > 0 ? 1 : 0 +
                               gameStats.pokerHands > 0 ? 1 : 0, 5)
          break
        case 'weekly_big_win':
          newProgress = gameStats.biggestWin >= 10000 ? 1 : 0
          break
      }

      const completed = newProgress >= challenge.target && !challenge.completed

      if (completed) {
        setTimeout(() => {
          setShowReward({ type: 'challenge', item: challenge })
          onCoinsUpdate(coins + challenge.reward)
        }, 1000)
      }

      return {
        ...challenge,
        progress: newProgress,
        completed: completed || challenge.completed
      }
    }))

    // Check achievements
    setAchievements(prev => prev.map(achievement => {
      let shouldUnlock = false

      switch (achievement.id) {
        case 'first_spin':
          shouldUnlock = gameStats.slotsPlayed > 0
          break
        case 'slot_master':
          shouldUnlock = gameStats.slotsPlayed >= 100
          break
        case 'blackjack_pro':
          shouldUnlock = gameStats.blackjackWins >= 50
          break
        case 'big_spender':
          shouldUnlock = gameStats.totalWagered >= 100000
          break
        case 'lucky_seven':
          shouldUnlock = gameStats.loginStreak >= 7
          break
        case 'millionaire':
          shouldUnlock = coins >= 1000000
          break
      }

      if (shouldUnlock && !achievement.unlocked) {
        setTimeout(() => {
          setShowReward({ type: 'achievement', item: achievement })
          onCoinsUpdate(coins + achievement.reward)
        }, 1500)

        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        }
      }

      return achievement
    }))
  }, [gameStats, coins, onCoinsUpdate])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-600'
      case 'rare': return 'text-blue-400 border-blue-600'
      case 'epic': return 'text-purple-400 border-purple-600'
      case 'legendary': return 'text-yellow-400 border-yellow-600'
      default: return 'text-gray-400 border-gray-600'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-yellow-500/30"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Target className="text-yellow-400" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-white">Challenges & Achievements</h2>
                <p className="text-gray-300">Complete challenges and unlock achievements for rewards</p>
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
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'challenges'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Target size={16} />
              Challenges
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'achievements'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Trophy size={16} />
              Achievements
            </button>
          </div>

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {['daily', 'weekly', 'special'].map(type => (
                <div key={type}>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    {type === 'daily' && <Calendar size={20} className="text-green-400" />}
                    {type === 'weekly' && <Star size={20} className="text-blue-400" />}
                    {type === 'special' && <Zap size={20} className="text-purple-400" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)} Challenges
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {challenges.filter(c => c.type === type).map(challenge => (
                      <div
                        key={challenge.id}
                        className={`p-4 rounded-lg border-2 ${
                          challenge.completed
                            ? 'border-green-500/50 bg-green-500/10'
                            : 'border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{challenge.icon}</span>
                            <div>
                              <h4 className="font-bold text-white">{challenge.title}</h4>
                              <p className="text-gray-400 text-sm">{challenge.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty.toUpperCase()}
                            </div>
                            <div className="text-yellow-400 font-bold">{challenge.reward} coins</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">
                              {Math.min(challenge.progress, challenge.target)} / {challenge.target}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-1000 ${
                                challenge.completed ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        {challenge.completed && (
                          <div className="mt-3 flex items-center gap-2 text-green-400">
                            <CheckCircle size={16} />
                            <span className="text-sm font-semibold">COMPLETED</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.unlocked
                      ? `${getRarityColor(achievement.rarity)} bg-gradient-to-br from-yellow-500/10 to-orange-500/10`
                      : 'border-gray-600 bg-gray-800/50 opacity-75'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-4xl mb-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <h4 className={`font-bold mb-2 ${achievement.unlocked ? getRarityColor(achievement.rarity).split(' ')[0] : 'text-gray-400'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>

                    <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${getRarityColor(achievement.rarity).split(' ')[0]}`}>
                      {achievement.rarity}
                    </div>

                    <div className="text-yellow-400 font-bold">
                      {achievement.reward} coins
                    </div>

                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-green-400">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Reward Popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/90"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: 2 }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-4xl font-bold text-yellow-400 mb-2">
                {showReward.type === 'challenge' ? 'Challenge Complete!' : 'Achievement Unlocked!'}
              </h3>
              <p className="text-2xl text-white mb-4">{showReward.item.title}</p>
              <p className="text-xl text-green-400 font-bold">
                +{showReward.item.reward} coins earned!
              </p>
              <button
                onClick={() => setShowReward(null)}
                className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all"
              >
                Awesome!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}