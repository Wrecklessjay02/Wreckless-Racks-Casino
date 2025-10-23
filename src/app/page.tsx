'use client'

import { useState } from 'react'
import GameLobby from '@/components/GameLobby'
import SlotMachine from '@/components/SlotMachine'
import Blackjack from '@/components/Blackjack'
import Roulette from '@/components/Roulette'
import Poker from '@/components/Poker'
import CurrencyStore from '@/components/CurrencyStore'
import UserProfile from '@/components/UserProfile'
import DailyBonus from '@/components/DailyBonus'
import Tournament from '@/components/Tournament'
import { Coins, User, Trophy, Gift, Home, Plus, Bell } from 'lucide-react'

type GameType = 'lobby' | 'slots' | 'blackjack' | 'roulette' | 'poker'

export default function CasinoPage() {
  const [coins, setCoins] = useState(5000)
  const [currentGame, setCurrentGame] = useState<GameType>('lobby')
  const [showStore, setShowStore] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showDailyBonus, setShowDailyBonus] = useState(false)
  const [showTournament, setShowTournament] = useState(false)
  const [hasUnclaimedBonus, setHasUnclaimedBonus] = useState(true)

  const renderGame = () => {
    switch (currentGame) {
      case 'slots':
        return <SlotMachine coins={coins} setCoins={setCoins} />
      case 'blackjack':
        return <Blackjack coins={coins} setCoins={setCoins} />
      case 'roulette':
        return <Roulette coins={coins} setCoins={setCoins} />
      case 'poker':
        return <Poker coins={coins} setCoins={setCoins} />
      default:
        return <GameLobby onSelectGame={setCurrentGame} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-yellow-900">
      <header className="p-4 bg-black/40 backdrop-blur-sm border-b border-yellow-500/30">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">💸</div>
              <div>
                <h1 className="text-lg font-bold text-yellow-400">Wreckless Racks</h1>
                <p className="text-xs text-yellow-300">CASINO</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full font-bold shadow-lg text-sm">
                <Coins size={16} />
                {coins.toLocaleString()}
              </div>
              <button
                onClick={() => setShowStore(true)}
                className="p-1.5 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentGame !== 'lobby' && (
                <button
                  onClick={() => setCurrentGame('lobby')}
                  className="p-2 bg-gray-600 hover:bg-gray-700 rounded-full text-white transition-colors"
                >
                  <Home size={18} />
                </button>
              )}

              <button
                onClick={() => setShowProfile(true)}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
              >
                <User size={18} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowTournament(true)}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors"
              >
                <Trophy size={18} />
              </button>

              <button
                onClick={() => setShowDailyBonus(true)}
                className="p-2 bg-pink-600 hover:bg-pink-700 rounded-full text-white transition-colors relative"
              >
                <Gift size={18} />
                {hasUnclaimedBonus && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              <button className="p-2 bg-orange-600 hover:bg-orange-700 rounded-full text-white transition-colors relative">
                <Bell size={18} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💸</div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">Wreckless Racks</h1>
              <p className="text-xs text-yellow-300">CASINO</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentGame !== 'lobby' && (
              <button
                onClick={() => setCurrentGame('lobby')}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-full text-white transition-colors"
              >
                <Home size={20} />
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                <Coins size={20} />
                {coins.toLocaleString()}
              </div>
              <button
                onClick={() => setShowStore(true)}
                className="p-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors relative"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={() => setShowProfile(true)}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
            >
              <User size={20} />
            </button>

            <button
              onClick={() => setShowTournament(true)}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors"
            >
              <Trophy size={20} />
            </button>

            <button
              onClick={() => setShowDailyBonus(true)}
              className="p-2 bg-pink-600 hover:bg-pink-700 rounded-full text-white transition-colors relative"
            >
              <Gift size={20} />
              {hasUnclaimedBonus && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            <button className="p-2 bg-orange-600 hover:bg-orange-700 rounded-full text-white transition-colors relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4">
        {renderGame()}
      </main>

      <CurrencyStore
        isOpen={showStore}
        onClose={() => setShowStore(false)}
        coins={coins}
        setCoins={setCoins}
      />

      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        coins={coins}
      />

      <DailyBonus
        isOpen={showDailyBonus}
        onClose={() => {
          setShowDailyBonus(false)
          setHasUnclaimedBonus(false)
        }}
        coins={coins}
        setCoins={setCoins}
      />

      <Tournament
        isOpen={showTournament}
        onClose={() => setShowTournament(false)}
        coins={coins}
        setCoins={setCoins}
      />
    </div>
  )
}
