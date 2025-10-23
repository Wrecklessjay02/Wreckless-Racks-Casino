'use client'

import { motion } from 'framer-motion'
import { Spade, DollarSign, Target, Diamond } from 'lucide-react'

type GameType = 'lobby' | 'slots' | 'blackjack' | 'roulette' | 'poker'

interface GameLobbyProps {
  onSelectGame: (game: GameType) => void
}

const games = [
  {
    id: 'slots' as GameType,
    title: 'Lucky Slots',
    description: 'Spin the reels and hit the jackpot!',
    icon: '🎰',
    gradient: 'from-purple-600 to-pink-600',
    minBet: 50,
    maxWin: '1,000x'
  },
  {
    id: 'blackjack' as GameType,
    title: 'Blackjack',
    description: 'Beat the dealer and get 21!',
    icon: '🃏',
    gradient: 'from-green-600 to-emerald-600',
    minBet: 100,
    maxWin: '2:1'
  },
  {
    id: 'roulette' as GameType,
    title: 'Roulette',
    description: 'Place your bets and spin the wheel!',
    icon: '🎯',
    gradient: 'from-red-600 to-rose-600',
    minBet: 25,
    maxWin: '35:1'
  },
  {
    id: 'poker' as GameType,
    title: 'Texas Hold\'em',
    description: 'Play poker against the house!',
    icon: '♠️',
    gradient: 'from-blue-600 to-indigo-600',
    minBet: 200,
    maxWin: '500:1'
  }
]

export default function GameLobby({ onSelectGame }: GameLobbyProps) {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-yellow-400 mb-4"
        >
          Welcome to Wreckless Racks Casino! 💸
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300"
        >
          Choose your game and start winning big!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={() => onSelectGame(game.id)}
          >
            <div className={`bg-gradient-to-br ${game.gradient} p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-yellow-400/50 transition-all duration-300 touch-manipulation`}>
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-3 md:mb-4">{game.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-gray-200 mb-3 md:mb-4 text-sm">{game.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Min Bet:</span>
                    <span className="text-yellow-400 font-bold">{game.minBet} coins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Max Win:</span>
                    <span className="text-green-400 font-bold">{game.maxWin}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 md:py-2 px-4 rounded-lg transition-colors touch-manipulation text-sm md:text-base"
                >
                  Play Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="text-yellow-400" size={24} />
            <h3 className="text-xl font-bold text-white">Daily Bonus</h3>
          </div>
          <p className="text-gray-300 mb-3">Get free coins every day!</p>
          <div className="text-sm text-green-400 mb-3">🔥 3-day streak active!</div>
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
            Claim 500 Coins
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Target className="text-red-400" size={24} />
            <h3 className="text-xl font-bold text-white">Tournaments</h3>
          </div>
          <p className="text-gray-300 mb-3">Weekly Slot Championship</p>
          <div className="text-sm text-blue-400 mb-3">💰 50K coins prize pool</div>
          <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
            Enter (500 coins)
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Diamond className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold text-white">Progressive Jackpot</h3>
          </div>
          <p className="text-gray-300 mb-3">Mega Slots Jackpot</p>
          <div className="text-lg font-bold text-yellow-400 mb-3">🎰 $127,543</div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
            Play for Jackpot
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Target className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-white">Daily Challenges</h3>
          </div>
          <p className="text-gray-300 mb-3">Win 5 blackjack hands</p>
          <div className="text-sm text-orange-400 mb-3">Progress: 2/5 ⭐</div>
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
            View All
          </button>
        </motion.div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-xl border border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">🔥 Hot Events This Week</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-bold text-yellow-400">Lightning Slots</h4>
            <p className="text-sm text-gray-300">Double XP on all slot games</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-bold text-green-400">Blackjack Blitz</h4>
            <p className="text-sm text-gray-300">Win streaks pay extra</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💎</div>
            <h4 className="font-bold text-blue-400">VIP Weekend</h4>
            <p className="text-sm text-gray-300">Enhanced rewards for VIP</p>
          </div>
        </div>
      </div>
    </div>
  )
}