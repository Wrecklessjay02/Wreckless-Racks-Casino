'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Trophy, Clock, Users, Target, Star, Crown, Zap } from 'lucide-react'

interface TournamentProps {
  isOpen: boolean
  onClose: () => void
  coins: number
  setCoins: (coins: number) => void
}

const activeTournaments = [
  {
    id: 'slots-championship',
    name: 'Weekly Slots Championship',
    game: 'All Slots',
    type: 'weekly',
    entryFee: 500,
    prizePool: 50000,
    participants: 342,
    maxParticipants: 1000,
    timeLeft: '2d 14h',
    status: 'active',
    icon: '🎰',
    rewards: [
      { place: '1st', prize: 15000, percentage: 30 },
      { place: '2nd', prize: 10000, percentage: 20 },
      { place: '3rd', prize: 7500, percentage: 15 },
      { place: '4th-10th', prize: 2500, percentage: 5 },
      { place: '11th-50th', prize: 500, percentage: 1 }
    ]
  },
  {
    id: 'blackjack-blitz',
    name: 'Blackjack Blitz',
    game: 'Blackjack',
    type: 'daily',
    entryFee: 250,
    prizePool: 12500,
    participants: 89,
    maxParticipants: 100,
    timeLeft: '6h 32m',
    status: 'active',
    icon: '🃏',
    rewards: [
      { place: '1st', prize: 5000, percentage: 40 },
      { place: '2nd', prize: 3000, percentage: 24 },
      { place: '3rd', prize: 2000, percentage: 16 },
      { place: '4th-10th', prize: 250, percentage: 2 }
    ]
  },
  {
    id: 'high-roller',
    name: 'High Roller Challenge',
    game: 'All Games',
    type: 'monthly',
    entryFee: 2000,
    prizePool: 200000,
    participants: 67,
    maxParticipants: 500,
    timeLeft: '12d 8h',
    status: 'active',
    icon: '💎',
    rewards: [
      { place: '1st', prize: 75000, percentage: 37.5 },
      { place: '2nd', prize: 40000, percentage: 20 },
      { place: '3rd', prize: 25000, percentage: 12.5 },
      { place: '4th-10th', prize: 7500, percentage: 3.75 },
      { place: '11th-25th', prize: 2000, percentage: 1 }
    ]
  }
]

const leaderboard = [
  { rank: 1, name: 'SlotKing92', score: 127500, prize: 15000, avatar: '👑' },
  { rank: 2, name: 'LuckyLady', score: 89300, prize: 10000, avatar: '🍀' },
  { rank: 3, name: 'CardShark', score: 76800, prize: 7500, avatar: '🦈' },
  { rank: 4, name: 'BigWinner', score: 68200, prize: 2500, avatar: '💰' },
  { rank: 5, name: 'RoulettePro', score: 64100, prize: 2500, avatar: '🎯' },
  { rank: 6, name: 'You', score: 42500, prize: 2500, avatar: '🎰', isUser: true },
  { rank: 7, name: 'PokerFace', score: 41200, prize: 2500, avatar: '🃏' },
  { rank: 8, name: 'SpinMaster', score: 38900, prize: 2500, avatar: '⚡' },
  { rank: 9, name: 'JackpotHunter', score: 35600, prize: 2500, avatar: '🏆' },
  { rank: 10, name: 'VegasVegas', score: 32100, prize: 2500, avatar: '🎲' }
]

export default function Tournament({ isOpen, onClose, coins, setCoins }: TournamentProps) {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'leaderboard' | 'rewards'>('tournaments')
  const [selectedTournament, setSelectedTournament] = useState(activeTournaments[0])

  const joinTournament = (tournament: typeof activeTournaments[0]) => {
    if (coins < tournament.entryFee) return

    setCoins(coins - tournament.entryFee)
    alert(`Successfully joined ${tournament.name}! Good luck!`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-3xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-yellow-500/30"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-400" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-yellow-400">Tournaments</h2>
              <p className="text-gray-300">Compete against players worldwide!</p>
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
            { id: 'tournaments', label: 'Active Tournaments', icon: <Trophy size={16} /> },
            { id: 'leaderboard', label: 'Leaderboard', icon: <Crown size={16} /> },
            { id: 'rewards', label: 'Prize Structure', icon: <Star size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'tournaments' | 'leaderboard' | 'rewards')}
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

        {activeTab === 'tournaments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTournaments.map((tournament) => (
              <motion.div
                key={tournament.id}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTournament.id === tournament.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                }`}
                onClick={() => setSelectedTournament(tournament)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{tournament.icon}</div>
                  <div>
                    <h3 className="font-bold text-white">{tournament.name}</h3>
                    <p className="text-sm text-gray-400">{tournament.game}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prize Pool:</span>
                    <span className="text-yellow-400 font-bold">{tournament.prizePool.toLocaleString()} coins</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Entry Fee:</span>
                    <span className="text-white font-bold">{tournament.entryFee} coins</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Players:</span>
                    <span className="text-blue-400">{tournament.participants}/{tournament.maxParticipants}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Time Left:</span>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Clock size={14} />
                      {tournament.timeLeft}
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      joinTournament(tournament)
                    }}
                    disabled={coins < tournament.entryFee}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      coins >= tournament.entryFee
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {coins >= tournament.entryFee ? 'Join Tournament' : 'Insufficient Coins'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Weekly Slots Championship</h3>
              <div className="flex items-center gap-2 text-orange-400">
                <Clock size={20} />
                <span className="font-bold">2d 14h remaining</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    player.isUser
                      ? 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-2 border-yellow-500/50'
                      : index < 3
                      ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30'
                      : 'bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {player.rank}
                    </div>

                    <div className="text-2xl">{player.avatar}</div>

                    <div>
                      <h4 className={`font-bold ${player.isUser ? 'text-yellow-400' : 'text-white'}`}>
                        {player.name}
                      </h4>
                      <p className="text-sm text-gray-400">Score: {player.score.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-green-400 font-bold">{player.prize.toLocaleString()} coins</div>
                    {index < 3 && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Crown size={14} />
                        <span className="text-xs">Top 3</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Prize Distribution</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedTournament.rewards.map((reward, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    index < 3
                      ? 'border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-orange-900/20'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl mb-2 ${
                      index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'}
                    </div>
                    <h4 className="font-bold text-white mb-2">{reward.place} Place</h4>
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {reward.prize.toLocaleString()} coins
                    </div>
                    <div className="text-sm text-gray-400">
                      {reward.percentage}% of prize pool
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="text-xl font-bold text-white mb-4">Tournament Rules</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Highest coin winnings during tournament period wins</li>
                <li>• Only games played after joining count toward score</li>
                <li>• Minimum 10 games must be played to qualify</li>
                <li>• Prizes distributed automatically after tournament ends</li>
                <li>• In case of tie, player who joined first wins</li>
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}