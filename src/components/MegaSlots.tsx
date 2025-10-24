'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Share2, Zap } from 'lucide-react'
import SocialShare from './SocialShare'
import SlotSymbol from './SlotSymbols'

const MEGA_SYMBOLS = ['diamond', 'jackpot', 'star', 'seven', 'wild', 'bar', 'cherry', 'lemon', 'orange', 'grape']
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
  const [bonusRound, setBonusRound] = useState(false)
  const [freeSpins, setFreeSpins] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [showBonusAnimation, setShowBonusAnimation] = useState(false)

  const getRandomSymbol = () => MEGA_SYMBOLS[Math.floor(Math.random() * MEGA_SYMBOLS.length)]

  const checkWin = useCallback((results: string[]) => {
    let baseWin = 0
    let bonusTriggered = false

    // Check for bonus round trigger (3+ scatters)
    const scatterCount = results.filter(symbol => symbol === 'star').length
    if (scatterCount >= 3) {
      bonusTriggered = true
      setFreeSpins(10 + (scatterCount - 3) * 5) // 10-20 free spins
      setMultiplier(scatterCount >= 4 ? 3 : 2) // Higher multiplier for more scatters
      setShowBonusAnimation(true)
      setTimeout(() => {
        setBonusRound(true)
        setShowBonusAnimation(false)
      }, 2000)
    }

    // 5 of a kind
    if (results.every(symbol => symbol === results[0])) {
      const symbol = results[0]
      switch (symbol) {
        case 'diamond': baseWin = jackpotBuildup // JACKPOT!
        case 'jackpot': baseWin = 5000; break
        case 'wild': baseWin = 2500; break
        case 'seven': baseWin = 1500; break
        case 'star': baseWin = 1000; break
        default: baseWin = 500
      }
    }

    if (!baseWin) {
      // 4 of a kind
      const symbolCounts = results.reduce((acc, symbol) => {
        acc[symbol] = (acc[symbol] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const maxCount = Math.max(...Object.values(symbolCounts))
      if (maxCount >= 4) baseWin = 300
      else if (maxCount >= 3) baseWin = 75

      // Consecutive symbols
      if (!baseWin) {
        const consecutive = results.reduce((count, symbol, index) => {
          return index > 0 && results[index - 1] === symbol ? count + 1 : 1
        }, 1)

        if (consecutive >= 3) baseWin = 50
      }
    }

    // Apply bonus multiplier
    const finalWin = bonusRound ? baseWin * multiplier : baseWin

    // Bonus round scatter wins
    if (bonusTriggered && !baseWin) {
      return 200 * scatterCount // Scatter pay
    }

    return finalWin
  }, [jackpotBuildup, bonusRound, multiplier])

  const spin = useCallback(async () => {
    if (isSpinning || (!bonusRound && coins < BET_AMOUNT)) return

    setIsSpinning(true)
    setLastWin(0)

    // Only deduct coins if not in bonus round
    if (!bonusRound) {
      setCoins(coins - BET_AMOUNT)
      setJackpotBuildup(prev => prev + 25) // Jackpot builds with each spin
    } else {
      // Use a free spin
      setFreeSpins(prev => prev - 1)
    }

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

    // Check if bonus round ends
    if (bonusRound && freeSpins <= 1) {
      setBonusRound(false)
      setMultiplier(1)
      setFreeSpins(0)
    }

    setIsSpinning(false)
  }, [isSpinning, coins, checkWin, setCoins, jackpotBuildup, bonusRound, freeSpins])

  const isWinningSymbol = (symbol: string, index: number) => {
    return lastWin > 0 && (
      results.every(s => s === symbol) ||
      symbol === 'wild' ||
      (lastWin >= 1000 && (symbol === 'diamond' || symbol === 'jackpot'))
    )
  }

  const results = reels

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

      {/* Bonus Round Status */}
      {bonusRound && (
        <div className="w-full bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-3 rounded-xl border border-yellow-500/50">
          <div className="text-center">
            <p className="text-yellow-300 text-sm font-semibold mb-1">🎆 BONUS ROUND ACTIVE 🎆</p>
            <div className="flex justify-center items-center gap-4">
              <div className="text-lg font-bold text-orange-400">
                Free Spins: {freeSpins}
              </div>
              <div className="text-lg font-bold text-yellow-400">
                Multiplier: x{multiplier}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bonus Animation */}
      <AnimatePresence>
        {showBonusAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-4xl md:text-6xl font-bold text-yellow-400 mb-3"
            >
              🎆 BONUS ROUND! 🎆
            </motion.div>
            <div className="text-xl font-bold text-orange-400">
              {freeSpins} Free Spins with {multiplier}x Multiplier!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reels */}
      <div className="flex gap-1 md:gap-2 p-3 md:p-4 bg-black/60 rounded-2xl border-4 border-purple-500">
        {reels.map((symbol, index) => (
          <motion.div
            key={index}
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
            <SlotSymbol
              symbol={symbol}
              size="medium"
              isWinning={isWinningSymbol(symbol, index)}
              className={isSpinning ? 'blur-sm' : ''}
            />
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
        disabled={isSpinning || (!bonusRound && coins < BET_AMOUNT)}
        className={`flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 ${
          bonusRound
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        } disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg md:text-xl rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg touch-manipulation`}
      >
        {isSpinning ? (
          <>
            <Pause size={20} className="md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Spinning...</span>
          </>
        ) : bonusRound ? (
          <>
            <Play size={20} className="md:w-6 md:h-6" />
            <span className="text-sm md:text-base">FREE SPIN! ({freeSpins} left)</span>
          </>
        ) : (
          <>
            <Play size={20} className="md:w-6 md:h-6" />
            <span className="text-sm md:text-base">MEGA SPIN ({BET_AMOUNT} coins)</span>
          </>
        )}
      </button>

      {!bonusRound && coins < BET_AMOUNT && (
        <div className="text-red-400 text-center px-4">
          <p className="text-sm md:text-base">Not enough coins for MEGA SPIN!</p>
          <p className="text-xs md:text-sm">You need {BET_AMOUNT} coins per spin</p>
        </div>
      )}

      {/* Paytable */}
      <div className="text-center text-gray-300 text-xs md:text-sm px-4">
        <div className="space-y-1">
          <p>💎 DIAMOND x5 = PROGRESSIVE JACKPOT</p>
          <p>👑 JACKPOT x5 = 5000 | WILD x5 = 2500</p>
          <p>7 SEVEN x5 = 1500 | ⭐ STAR x5 = 1000</p>
          <p>4 of a kind = 300 | 3 of a kind = 75</p>
          <p className="text-yellow-400 font-semibold">⭐ 3+ STARS = BONUS ROUND! ⭐</p>
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