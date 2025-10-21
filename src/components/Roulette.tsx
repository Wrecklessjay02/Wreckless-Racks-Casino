'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'

interface RouletteProps {
  coins: number
  setCoins: (coins: number) => void
}

const numbers = [
  { num: 0, color: 'green' },
  { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' }, { num: 4, color: 'black' },
  { num: 21, color: 'red' }, { num: 2, color: 'black' }, { num: 25, color: 'red' }, { num: 17, color: 'black' },
  { num: 34, color: 'red' }, { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
  { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' }, { num: 8, color: 'black' },
  { num: 23, color: 'red' }, { num: 10, color: 'black' }, { num: 5, color: 'red' }, { num: 24, color: 'black' },
  { num: 16, color: 'red' }, { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
  { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' }, { num: 22, color: 'black' },
  { num: 18, color: 'red' }, { num: 29, color: 'black' }, { num: 7, color: 'red' }, { num: 28, color: 'black' },
  { num: 12, color: 'red' }, { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' }
]

const BET_AMOUNTS = [25, 50, 100, 250]

export default function Roulette({ coins, setCoins }: RouletteProps) {
  const [selectedBet, setSelectedBet] = useState(BET_AMOUNTS[0])
  const [bets, setBets] = useState<{ [key: string]: number }>({})
  const [isSpinning, setIsSpinning] = useState(false)
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [lastWin, setLastWin] = useState(0)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [ballRotation, setBallRotation] = useState(0)

  const placeBet = useCallback((betType: string) => {
    if (selectedBet > coins) return

    setBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + selectedBet
    }))
    setCoins(coins - selectedBet)
  }, [selectedBet, coins, setCoins])

  const getTotalBets = useCallback(() => {
    return Object.values(bets).reduce((sum, bet) => sum + bet, 0)
  }, [bets])

  const spin = useCallback(async () => {
    if (isSpinning || getTotalBets() === 0) return

    setIsSpinning(true)
    setLastWin(0)
    setWinningNumber(null)

    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)]
    const winningIndex = numbers.findIndex(n => n.num === randomNumber.num)

    // Wheel spins clockwise, ball spins counter-clockwise
    const wheelSpins = 3 + Math.random() * 2 // 3-5 full rotations
    const ballSpins = 5 + Math.random() * 3 // 5-8 full rotations

    // Calculate final positions
    const segmentAngle = 360 / numbers.length
    const finalWheelAngle = wheelRotation + (wheelSpins * 360)
    const finalBallAngle = ballRotation - (ballSpins * 360) + (winningIndex * segmentAngle)

    setWheelRotation(finalWheelAngle)
    setBallRotation(finalBallAngle)

    setTimeout(() => {
      setWinningNumber(randomNumber.num)

      let totalWin = 0

      Object.entries(bets).forEach(([betType, betAmount]) => {
        const payout = calculatePayout(betType, randomNumber, betAmount)
        totalWin += payout
      })

      if (totalWin > 0) {
        setLastWin(totalWin)
        setCoins(prev => prev + totalWin)
      }

      setIsSpinning(false)
    }, 4000)
  }, [isSpinning, getTotalBets, bets, wheelRotation, ballRotation, setCoins])

  const calculatePayout = useCallback((betType: string, winningNum: typeof numbers[0], betAmount: number): number => {
    const { num, color } = winningNum

    switch (betType) {
      case `number-${num}`:
        return betAmount * 36
      case 'red':
        return color === 'red' ? betAmount * 2 : 0
      case 'black':
        return color === 'black' ? betAmount * 2 : 0
      case 'even':
        return num !== 0 && num % 2 === 0 ? betAmount * 2 : 0
      case 'odd':
        return num !== 0 && num % 2 === 1 ? betAmount * 2 : 0
      case 'low':
        return num >= 1 && num <= 18 ? betAmount * 2 : 0
      case 'high':
        return num >= 19 && num <= 36 ? betAmount * 2 : 0
      case 'first12':
        return num >= 1 && num <= 12 ? betAmount * 3 : 0
      case 'second12':
        return num >= 13 && num <= 24 ? betAmount * 3 : 0
      case 'third12':
        return num >= 25 && num <= 36 ? betAmount * 3 : 0
      default:
        return 0
    }
  }, [])

  const clearBets = useCallback(() => {
    const totalBets = getTotalBets()
    setCoins(prev => prev + totalBets)
    setBets({})
  }, [getTotalBets, setCoins])

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-green-600'
    const numberData = numbers.find(n => n.num === num)
    return numberData?.color === 'red' ? 'bg-red-600' : 'bg-black'
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-yellow-400 mb-2">Roulette 🎯</h2>
        <p className="text-gray-300">Place your bets and spin the wheel!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-80 h-80 mb-6">
            {/* Outer rim */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full shadow-2xl border-8 border-yellow-400"></div>

            {/* Spinning wheel */}
            <motion.div
              className="absolute inset-4 rounded-full border-4 border-white"
              animate={{ rotate: wheelRotation }}
              transition={{
                duration: isSpinning ? 4 : 0,
                ease: isSpinning ? [0.25, 0.1, 0.25, 1] : "linear"
              }}
              style={{
                background: `conic-gradient(${numbers.map((number, index) => {
                  const startAngle = (index * 360) / numbers.length
                  const endAngle = ((index + 1) * 360) / numbers.length
                  const color = number.color === 'red' ? '#dc2626' :
                              number.color === 'black' ? '#1f2937' : '#059669'
                  return `${color} ${startAngle}deg ${endAngle}deg`
                }).join(', ')})`
              }}
            >
              {/* Number labels */}
              <div className="w-full h-full relative">
                {numbers.map((number, index) => {
                  const angle = (index * 360) / numbers.length + (360 / numbers.length / 2)
                  return (
                    <div
                      key={`label-${number.num}`}
                      className="absolute text-white text-sm font-bold"
                      style={{
                        left: `${50 + 30 * Math.cos((angle - 90) * Math.PI / 180)}%`,
                        top: `${50 + 30 * Math.sin((angle - 90) * Math.PI / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        zIndex: 10
                      }}
                    >
                      {number.num}
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Ball */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ rotate: ballRotation }}
              transition={{
                duration: isSpinning ? 4 : 0,
                ease: isSpinning ? [0.25, 0.1, 0.25, 1] : "linear"
              }}
            >
              <div className="relative w-full h-full">
                <div
                  className="absolute w-3 h-3 bg-white rounded-full shadow-lg border border-gray-300"
                  style={{
                    left: '50%',
                    top: '20px',
                    transform: 'translateX(-50%)',
                    zIndex: 20
                  }}
                />
              </div>
            </motion.div>

            {/* Center indicator */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg z-30 border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            </div>
          </div>

          <AnimatePresence>
            {winningNumber !== null && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-center mb-4"
              >
                <div className="text-3xl font-bold text-yellow-400">
                  Winning Number: {winningNumber}
                </div>
                {lastWin > 0 && (
                  <div className="text-2xl font-bold text-green-400">
                    🎉 You won {lastWin} coins! 🎉
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mb-4">
            <button
              onClick={spin}
              disabled={isSpinning || getTotalBets() === 0}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
              <Play size={20} />
              {isSpinning ? 'Spinning...' : 'Spin'}
            </button>

            <button
              onClick={clearBets}
              disabled={isSpinning || getTotalBets() === 0}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Clear Bets
            </button>
          </div>

          <div className="text-white text-center">
            <p>Total Bets: {getTotalBets()} coins</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Bet Amount</h3>
            <div className="grid grid-cols-4 gap-2">
              {BET_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  onClick={() => setSelectedBet(amount)}
                  disabled={amount > coins}
                  className={`p-2 rounded font-bold transition-colors ${
                    selectedBet === amount
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Outside Bets</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => placeBet('red')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                Red (2:1)
                {bets['red'] && <div className="text-sm">Bet: {bets['red']}</div>}
              </button>
              <button
                onClick={() => placeBet('black')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-black hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                Black (2:1)
                {bets['black'] && <div className="text-sm">Bet: {bets['black']}</div>}
              </button>
              <button
                onClick={() => placeBet('even')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                Even (2:1)
                {bets['even'] && <div className="text-sm">Bet: {bets['even']}</div>}
              </button>
              <button
                onClick={() => placeBet('odd')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                Odd (2:1)
                {bets['odd'] && <div className="text-sm">Bet: {bets['odd']}</div>}
              </button>
              <button
                onClick={() => placeBet('low')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                1-18 (2:1)
                {bets['low'] && <div className="text-sm">Bet: {bets['low']}</div>}
              </button>
              <button
                onClick={() => placeBet('high')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                19-36 (2:1)
                {bets['high'] && <div className="text-sm">Bet: {bets['high']}</div>}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Dozen Bets</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => placeBet('first12')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                1st 12 (3:1)
                {bets['first12'] && <div className="text-sm">Bet: {bets['first12']}</div>}
              </button>
              <button
                onClick={() => placeBet('second12')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                2nd 12 (3:1)
                {bets['second12'] && <div className="text-sm">Bet: {bets['second12']}</div>}
              </button>
              <button
                onClick={() => placeBet('third12')}
                disabled={selectedBet > coins || isSpinning}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                3rd 12 (3:1)
                {bets['third12'] && <div className="text-sm">Bet: {bets['third12']}</div>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-300 text-sm">
        <p>🎯 Straight up (single number): 36:1 | Outside bets: 2:1 | Dozen bets: 3:1</p>
      </div>
    </div>
  )
}