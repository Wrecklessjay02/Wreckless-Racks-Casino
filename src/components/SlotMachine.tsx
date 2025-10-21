'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause } from 'lucide-react'

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '🎰', '💰']
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

  const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

  const checkWin = useCallback((results: string[]) => {
    if (results[0] === results[1] && results[1] === results[2]) {
      const symbol = results[0]
      switch (symbol) {
        case '💎': return 1000
        case '💰': return 500
        case '⭐': return 250
        case '🎰': return 150
        default: return 100
      }
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

  const getSymbolVariant = (symbol: string) => {
    switch (symbol) {
      case '💎': return 'bg-gradient-to-br from-blue-400 to-purple-600'
      case '💰': return 'bg-gradient-to-br from-yellow-400 to-orange-500'
      case '⭐': return 'bg-gradient-to-br from-yellow-300 to-yellow-600'
      case '🎰': return 'bg-gradient-to-br from-red-400 to-pink-600'
      default: return 'bg-gradient-to-br from-green-400 to-blue-500'
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-black/30 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Lucky Slots</h2>
        <p className="text-gray-300">Bet: {BET_AMOUNT} coins per spin</p>
      </div>

      <div className="flex gap-4 p-6 bg-black/50 rounded-2xl border-4 border-yellow-500">
        {reels.map((symbol, index) => (
          <motion.div
            key={index}
            className={`w-24 h-24 flex items-center justify-center text-4xl rounded-xl border-2 border-white/20 ${getSymbolVariant(symbol)}`}
            animate={isSpinning ? { rotateY: [0, 360] } : {}}
            transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
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

      <AnimatePresence>
        {lastWin > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-yellow-400 animate-pulse">
              🎉 WIN! +{lastWin} coins 🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={spin}
        disabled={isSpinning || coins < BET_AMOUNT}
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold text-xl rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
      >
        {isSpinning ? (
          <>
            <Pause size={24} />
            Spinning...
          </>
        ) : (
          <>
            <Play size={24} />
            Spin ({BET_AMOUNT} coins)
          </>
        )}
      </button>

      {coins < BET_AMOUNT && (
        <div className="text-red-400 text-center">
          <p>Not enough coins to spin!</p>
          <p className="text-sm">You need {BET_AMOUNT} coins per spin</p>
        </div>
      )}

      <div className="text-center text-gray-300 text-sm">
        <p>💎 = 1000 coins | 💰 = 500 coins | ⭐ = 250 coins</p>
        <p>🎰 = 150 coins | Others = 100 coins | Pairs = 25 coins</p>
      </div>
    </div>
  )
}