'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Share2 } from 'lucide-react'
import SocialShare from './SocialShare'
import SlotSymbol, { ENHANCED_SYMBOLS } from './SlotSymbols'

const SYMBOLS = ENHANCED_SYMBOLS
const REEL_COUNT = 3
const BET_AMOUNT = 50

interface SlotMachineProps {
  coins: number
  setCoins: (coins: number) => void
}

export default function SlotMachine({ coins, setCoins }: SlotMachineProps) {
  const [reels, setReels] = useState<string[]>(Array(REEL_COUNT).fill(SYMBOLS[0]))
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWin, setLastWin] = useState<number>(0)
  const [spinResults, setSpinResults] = useState<string[]>([])
  const [showShare, setShowShare] = useState(false)

  const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

  const checkWin = useCallback((results: string[]) => {
    if (results[0] === results[1] && results[1] === results[2]) {
      const symbol = results[0]
      switch (symbol) {
        case 'jackpot': return 2500
        case 'diamond': return 1000
        case 'wild': return 750
        case 'seven': return 500
        case 'star': return 250
        case 'bar': return 150
        default: return 100
      }
    }

    // Special wild card matching
    const wildCount = results.filter(r => r === 'wild').length
    if (wildCount >= 2) {
      return 500
    }
    if (wildCount === 1) {
      return 150
    }

    if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
      return 25
    }

    return 0
  }, [])

  const spin = useCallback(async () => {
    if (isSpinning || coins < BET_AMOUNT) return

    setIsSpinning(true)
    setLastWin(0)
    setCoins(coins - BET_AMOUNT)

    const finalResults = Array(REEL_COUNT).fill(null).map(() => getRandomSymbol())

    for (let i = 0; i < 20; i++) {
      setReels(Array(REEL_COUNT).fill(null).map(() => getRandomSymbol()))
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setReels(finalResults)
    setSpinResults(finalResults)

    const winAmount = checkWin(finalResults)
    if (winAmount > 0) {
      setLastWin(winAmount)
      setCoins(prev => prev + winAmount)
    }

    setIsSpinning(false)
  }, [isSpinning, coins, checkWin, setCoins])

  const isWinningSymbol = (symbol: string, index: number) => {
    return lastWin > 0 && (
      (reels[0] === reels[1] && reels[1] === reels[2]) ||
      symbol === 'wild' ||
      (lastWin >= 500 && symbol === 'jackpot')
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 p-4 md:p-8 bg-black/30 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl max-w-md md:max-w-none mx-auto">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Lucky Slots</h2>
        <p className="text-sm md:text-base text-gray-300">Bet: {BET_AMOUNT} coins per spin</p>
      </div>

      <div className="flex gap-2 md:gap-4 p-4 md:p-6 bg-black/50 rounded-2xl border-4 border-yellow-500">
        {reels.map((symbol, index) => (
          <motion.div
            key={index}
            animate={isSpinning ? { rotateY: [0, 360] } : {}}
            transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
          >
            <SlotSymbol
              symbol={symbol}
              size="large"
              isWinning={isWinningSymbol(symbol, index)}
              className={isSpinning ? 'blur-sm' : ''}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lastWin > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 animate-pulse mb-3">
              🎉 WIN! +{lastWin} coins 🎉
            </div>
            {lastWin >= 250 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full transition-all text-sm"
              >
                <Share2 size={16} />
                Share Big Win!
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={spin}
        disabled={isSpinning || coins < BET_AMOUNT}
        className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold text-lg md:text-xl rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg touch-manipulation"
      >
        {isSpinning ? (
          <>
            <Pause size={20} className="md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Spinning...</span>
          </>
        ) : (
          <>
            <Play size={20} className="md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Spin ({BET_AMOUNT} coins)</span>
          </>
        )}
      </button>

      {coins < BET_AMOUNT && (
        <div className="text-red-400 text-center px-4">
          <p className="text-sm md:text-base">Not enough coins to spin!</p>
          <p className="text-xs md:text-sm">You need {BET_AMOUNT} coins per spin</p>
        </div>
      )}

      <div className="text-center text-gray-300 text-xs md:text-sm px-4">
        <div className="space-y-1">
          <p>👑 JACKPOT = 2500 | 💎 DIAMOND = 1000 | WILD = 750</p>
          <p>7 SEVEN = 500 | ⭐ STAR = 250 | BAR = 150</p>
          <p>🍒🍋🍊🍇 FRUITS = 100 | Any Pairs = 25</p>
          <p className="text-yellow-400">WILD substitutes for any symbol!</p>
        </div>
      </div>

      <SocialShare
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareData={{
          title: `🎰 HUGE WIN at Wreckless Racks Casino!`,
          description: `Just won ${lastWin.toLocaleString()} coins on Lucky Slots! 💰 Join me for free spins and big wins!`,
          url: 'https://wrecklessracks.vercel.app'
        }}
      />
    </div>
  )
}