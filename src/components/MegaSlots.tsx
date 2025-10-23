'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Share2, Zap } from 'lucide-react'
import SocialShare from './SocialShare'

const MEGA_SYMBOLS = ['💎', '👑', '⚡', '🔥', '💰', '⭐', '🚀', '💸']
const REEL_COUNT = 5
const BET_AMOUNT = 100

interface MegaSlotsProps {
  coins: number
  setCoins: (coins: number) => void
}

export default function MegaSlots({ coins, setCoins }: MegaSlotsProps) {
  const [reels, setReels] = useState<string[]>(Array(REEL_COUNT).fill(MEGA_SYMBOLS[0]))
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWin, setLastWin] = useState<number>(0)
  const [showShare, setShowShare] = useState(false)
  const [jackpotBuildup, setJackpotBuildup] = useState(127543)

  const getRandomSymbol = () => MEGA_SYMBOLS[Math.floor(Math.random() * MEGA_SYMBOLS.length)]

  const checkWin = useCallback((results: string[]) => {
    // 5 of a kind
    if (results.every(symbol => symbol === results[0])) {
      const symbol = results[0]
      switch (symbol) {
        case '💎': return jackpotBuildup // JACKPOT!
        case '👑': return 5000
        case '⚡': return 2500
        case '🔥': return 1500
        case '💰': return 1000
        default: return 500
      }
    }

    // 4 of a kind
    const symbolCounts = results.reduce((acc, symbol) => {
      acc[symbol] = (acc[symbol] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const maxCount = Math.max(...Object.values(symbolCounts))
    if (maxCount >= 4) return 300
    if (maxCount >= 3) return 75

    // Consecutive symbols
    const consecutive = results.reduce((count, symbol, index) => {
      return index > 0 && results[index - 1] === symbol ? count + 1 : 1
    }, 1)

    if (consecutive >= 3) return 50
    return 0
  }, [jackpotBuildup])

  const spin = useCallback(async () => {
    if (isSpinning || coins < BET_AMOUNT) return

    setIsSpinning(true)
    setLastWin(0)
    setCoins(coins - BET_AMOUNT)
    setJackpotBuildup(prev => prev + 25) // Jackpot builds with each spin

    const finalResults = Array(REEL_COUNT).fill(null).map(() => getRandomSymbol())

    // Animation with different speeds for each reel
    for (let i = 0; i < 25; i++) {
      setReels(Array(REEL_COUNT).fill(null).map(() => getRandomSymbol()))
      await new Promise(resolve => setTimeout(resolve, 80))
    }

    setReels(finalResults)

    const winAmount = checkWin(finalResults)
    if (winAmount > 0) {
      setLastWin(winAmount)
      setCoins(prev => prev + winAmount)

      // Reset jackpot if won
      if (winAmount === jackpotBuildup) {
        setJackpotBuildup(50000)
      }
    }

    setIsSpinning(false)
  }, [isSpinning, coins, checkWin, setCoins, jackpotBuildup])

  const getSymbolVariant = (symbol: string) => {
    switch (symbol) {
      case '💎': return 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/50'
      case '👑': return 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50'
      case '⚡': return 'bg-gradient-to-br from-purple-400 to-pink-600 shadow-lg shadow-purple-500/50'
      case '🔥': return 'bg-gradient-to-br from-red-400 to-orange-600 shadow-lg shadow-red-500/50'
      case '💰': return 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/50'
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6 p-4 md:p-6 bg-black/40 backdrop-blur-lg rounded-3xl border border-purple-500/30 shadow-2xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="text-purple-400" size={32} />
          <h2 className="text-2xl md:text-3xl font-bold text-white">MEGA SLOTS</h2>
          <Zap className="text-purple-400" size={32} />
        </div>
        <p className="text-sm md:text-base text-gray-300">5-Reel Progressive Jackpot</p>
        <p className="text-xs md:text-sm text-purple-300">Bet: {BET_AMOUNT} coins per spin</p>
      </div>

      {/* Jackpot Display */}
      <div className="w-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-3 rounded-xl border border-purple-500/50">
        <div className="text-center">
          <p className="text-purple-300 text-sm font-semibold mb-1">PROGRESSIVE JACKPOT</p>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl md:text-3xl font-bold text-yellow-400"
          >
            💎 {jackpotBuildup.toLocaleString()} COINS 💎
          </motion.div>
        </div>
      </div>

      {/* Reels */}
      <div className="flex gap-1 md:gap-2 p-3 md:p-4 bg-black/60 rounded-2xl border-4 border-purple-500">
        {reels.map((symbol, index) => (
          <motion.div
            key={index}
            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl rounded-lg border-2 border-white/30 ${getSymbolVariant(symbol)}`}
            animate={isSpinning ? {
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{
              duration: 0.1,
              repeat: isSpinning ? Infinity : 0,
              delay: index * 0.1
            }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {symbol}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Win Animation */}
      <AnimatePresence>
        {lastWin > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            {lastWin === jackpotBuildup ? (
              <div>
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl md:text-6xl font-bold text-yellow-400 animate-pulse mb-3"
                >
                  🎆 JACKPOT! 🎆
                </motion.div>
                <div className="text-2xl md:text-3xl font-bold text-green-400">
                  +{lastWin.toLocaleString()} COINS!
                </div>
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 animate-pulse mb-3">
                ⚡ MEGA WIN! +{lastWin.toLocaleString()} coins ⚡
              </div>
            )}

            {lastWin >= 500 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full transition-all text-sm mt-3"
              >
                <Share2 size={16} />
                Share Mega Win!
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || coins < BET_AMOUNT}
        className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg md:text-xl rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg touch-manipulation"
      >
        {isSpinning ? (
          <>
            <Pause size={20} className="md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Spinning...</span>
          </>
        ) : (
          <>
            <Play size={20} className="md:w-6 md:h-6" />
            <span className="text-sm md:text-base">MEGA SPIN ({BET_AMOUNT} coins)</span>
          </>
        )}
      </button>

      {coins < BET_AMOUNT && (
        <div className="text-red-400 text-center px-4">
          <p className="text-sm md:text-base">Not enough coins for MEGA SPIN!</p>
          <p className="text-xs md:text-sm">You need {BET_AMOUNT} coins per spin</p>
        </div>
      )}

      {/* Paytable */}
      <div className="text-center text-gray-300 text-xs md:text-sm px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <p>💎 x5 = JACKPOT | 👑 x5 = 5000</p>
          <p>⚡ x5 = 2500 | 🔥 x5 = 1500 | 💰 x5 = 1000</p>
        </div>
      </div>

      <SocialShare
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareData={{
          title: lastWin === jackpotBuildup ?
            `🎆 MEGA JACKPOT WIN at Wreckless Racks Casino!` :
            `⚡ MEGA WIN at Wreckless Racks Casino!`,
          description: lastWin === jackpotBuildup ?
            `I just hit the PROGRESSIVE JACKPOT for ${lastWin.toLocaleString()} coins! 💎🎆` :
            `Just won ${lastWin.toLocaleString()} coins on MEGA SLOTS! ⚡💰 Join me for epic wins!`,
          url: 'https://wrecklessracks.vercel.app'
        }}
      />
    </div>
  )
}