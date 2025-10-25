'use client'

import { useState, useEffect } from 'react'
import { UserProvider, useUser } from '@/contexts/UserContext'
import AuthSystem from '@/components/AuthSystem'
import GameLobby from '@/components/GameLobby'
import SlotMachine from '@/components/SlotMachine'
import MegaSlots from '@/components/MegaSlots'
import Blackjack from '@/components/Blackjack'
import Roulette from '@/components/Roulette'
import Poker from '@/components/Poker'
import CurrencyStore from '@/components/CurrencyStore'
import UserProfile from '@/components/UserProfile'
import UserDashboard from '@/components/UserDashboard'
import DailyBonus from '@/components/DailyBonus'
import Tournament from '@/components/Tournament'
import AgeVerification from '@/components/AgeVerification'
import VIPSystem from '@/components/VIPSystem'
import ChallengesAchievements from '@/components/ChallengesAchievements'
import SocialSystem from '@/components/SocialSystem'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import ReferralSystem from '@/components/ReferralSystem'
import LiveChat from '@/components/LiveChat'
import { Coins, User, Trophy, Gift, Home, Plus, Bell, Users, Target, BarChart, Crown, LogOut, UserPlus, MessageCircle } from 'lucide-react'

type GameType = 'lobby' | 'slots' | 'megaslots' | 'blackjack' | 'roulette' | 'poker'

function CasinoContent() {
  const { user, isAuthenticated, login, logout, updateCoins, updateGameStats, updateTotalWagered } = useUser()
  const [currentGame, setCurrentGame] = useState<GameType>('lobby')
  const [showStore, setShowStore] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showDailyBonus, setShowDailyBonus] = useState(false)
  const [showTournament, setShowTournament] = useState(false)
  const [hasUnclaimedBonus, setHasUnclaimedBonus] = useState(true)
  const [isAgeVerified, setIsAgeVerified] = useState(false)
  const [showAgeVerification, setShowAgeVerification] = useState(false)
  const [showChallenges, setShowChallenges] = useState(false)
  const [showSocial, setShowSocial] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showReferrals, setShowReferrals] = useState(false)
  const [showLiveChat, setShowLiveChat] = useState(false)

  useEffect(() => {
    console.log('Page: Authentication state changed:', { isAuthenticated, user: user?.username })
    if (!isAuthenticated) {
      console.log('Page: User not authenticated, showing auth modal')
      setShowAuth(true)
      return
    } else {
      console.log('Page: User is authenticated, checking age verification')
    }

    // Check if user has already been age verified
    const stored = localStorage.getItem('wreckless_racks_age_verified')
    if (stored) {
      const { verified, timestamp } = JSON.parse(stored)
      const daysSinceVerification = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)

      // Require re-verification after 30 days
      if (verified && daysSinceVerification < 30) {
        setIsAgeVerified(true)
      } else {
        setShowAgeVerification(true)
      }
    } else {
      // Temporarily auto-approve age verification for existing users
      console.log('Page: Auto-approving age verification for existing authenticated user')
      setIsAgeVerified(true)
      // Store age verification
      localStorage.setItem('wreckless_racks_age_verified', JSON.stringify({
        verified: true,
        timestamp: Date.now()
      }))
    }
  }, [isAuthenticated])

  const handleAgeVerified = () => {
    setIsAgeVerified(true)
    setShowAgeVerification(false)
  }

  const handleAgeVerificationClose = () => {
    // Redirect to a safe page or show under-age message
    window.location.href = 'https://www.usa.gov/youth'
  }

  const renderGame = () => {
    if (!user) return null

    switch (currentGame) {
      case 'slots':
        return <SlotMachine coins={user.coins} setCoins={updateCoins} />
      case 'megaslots':
        return <MegaSlots coins={user.coins} setCoins={updateCoins} />
      case 'blackjack':
        return <Blackjack coins={user.coins} setCoins={updateCoins} />
      case 'roulette':
        return <Roulette coins={user.coins} setCoins={updateCoins} />
      case 'poker':
        return <Poker coins={user.coins} setCoins={updateCoins} />
      default:
        return <GameLobby onSelectGame={setCurrentGame} />
    }
  }

  // Don't render casino content until authenticated and age verified
  if (!isAuthenticated || !isAgeVerified) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-yellow-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-8 animate-spin">💸</div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-4">Wreckless Racks Casino</h1>
            <p className="text-xl text-white">
              {!isAuthenticated ? 'Please sign in to continue...' : 'Loading your casino experience...'}
            </p>
            {!isAuthenticated && (
              <button
                onClick={() => setShowAuth(true)}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-full transition-all duration-200 transform hover:scale-105"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>

        <AuthSystem
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onAuthSuccess={(newUser) => {
            console.log('Page: Auth successful, logging in user:', newUser.username)
            login(newUser) // Use UserContext login function to create session
            setShowAuth(false)
          }}
        />

        {isAuthenticated && (
          <AgeVerification
            isOpen={showAgeVerification}
            onVerified={handleAgeVerified}
            onClose={handleAgeVerificationClose}
          />
        )}
      </>
    )
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
                <p className="text-xs text-yellow-300">Welcome, {user?.firstName}!</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full font-bold shadow-lg text-sm">
                <Coins size={16} />
                {user?.coins.toLocaleString()}
              </div>
              <button
                onClick={() => alert('💰 Coin store coming soon! Keep playing to earn more coins!')}
                className="p-1.5 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={logout}
                className="p-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
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
                onClick={() => setShowDashboard(true)}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
              >
                <User size={18} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowChallenges(true)}
                className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-full text-white transition-colors"
              >
                <Target size={18} />
              </button>

              <button
                onClick={() => setShowReferrals(true)}
                className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white transition-colors"
              >
                <UserPlus size={18} />
              </button>

              <button
                onClick={() => setShowSocial(true)}
                className="p-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors"
              >
                <Users size={18} />
              </button>

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
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💸</div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">Wreckless Racks</h1>
              <p className="text-xs text-yellow-300">Welcome back, {user?.firstName}!</p>
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
                {user?.coins.toLocaleString()}
              </div>
              <button
                onClick={() => alert('💰 Coin store coming soon! Keep playing to earn more coins!')}
                className="p-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors relative"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={() => setShowChallenges(true)}
              className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-full text-white transition-colors"
            >
              <Target size={20} />
            </button>

            <button
              onClick={() => setShowReferrals(true)}
              className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white transition-colors"
            >
              <UserPlus size={20} />
            </button>

            <button
              onClick={() => setShowSocial(true)}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors"
            >
              <Users size={20} />
            </button>

            <button
              onClick={() => setShowDashboard(true)}
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

            <button
              onClick={() => setShowAnalytics(true)}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white transition-colors"
            >
              <BarChart size={20} />
            </button>

            <button
              onClick={() => setShowLiveChat(true)}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white transition-colors"
            >
              <MessageCircle size={20} />
            </button>

            <button
              onClick={logout}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4">
        <VIPSystem
          coins={user?.coins || 0}
          totalWagered={user?.totalWagered || 0}
          onCoinsUpdate={updateCoins}
        />
        {renderGame()}
      </main>

      <CurrencyStore
        isOpen={showStore}
        onClose={() => setShowStore(false)}
        coins={user?.coins || 0}
        setCoins={updateCoins}
      />

      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        coins={user?.coins || 0}
      />

      <DailyBonus
        isOpen={showDailyBonus}
        onClose={() => {
          setShowDailyBonus(false)
          setHasUnclaimedBonus(false)
        }}
        coins={user?.coins || 0}
        setCoins={updateCoins}
      />

      <Tournament
        isOpen={showTournament}
        onClose={() => setShowTournament(false)}
        coins={user?.coins || 0}
        setCoins={updateCoins}
      />

      <ChallengesAchievements
        isOpen={showChallenges}
        onClose={() => setShowChallenges(false)}
        coins={user?.coins || 0}
        onCoinsUpdate={updateCoins}
        gameStats={user?.gameStats || {
          slotsPlayed: 0,
          blackjackWins: 0,
          rouletteSpins: 0,
          pokerHands: 0,
          biggestWin: 0,
          loginStreak: 0,
          totalGamesPlayed: 0
        }}
      />

      <SocialSystem
        isOpen={showSocial}
        onClose={() => setShowSocial(false)}
        currentUser={{
          id: user?.id || 'guest',
          username: user?.username || 'Guest',
          coins: user?.coins || 0,
          totalWins: (user?.gameStats.blackjackWins || 0) + Math.floor((user?.gameStats.slotsPlayed || 0) / 3)
        }}
      />

      <AnalyticsDashboard
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        userRole="owner"
      />

      <UserDashboard
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
      />

      <ReferralSystem
        isOpen={showReferrals}
        onClose={() => setShowReferrals(false)}
      />

      <LiveChat
        isOpen={showLiveChat}
        onClose={() => setShowLiveChat(false)}
      />
    </div>
  )
}

export default function CasinoPage() {
  return (
    <UserProvider>
      <CasinoContent />
    </UserProvider>
  )
}
