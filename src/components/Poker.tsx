'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Eye, EyeOff } from 'lucide-react'

interface Card {
  suit: string
  rank: string
  value: number
}

interface PokerProps {
  coins: number
  setCoins: (coins: number) => void
}

const suits = ['♠', '♥', '♦', '♣']
const ranks = [
  { rank: 'A', value: 14 },
  { rank: 'K', value: 13 },
  { rank: 'Q', value: 12 },
  { rank: 'J', value: 11 },
  { rank: '10', value: 10 },
  { rank: '9', value: 9 },
  { rank: '8', value: 8 },
  { rank: '7', value: 7 },
  { rank: '6', value: 6 },
  { rank: '5', value: 5 },
  { rank: '4', value: 4 },
  { rank: '3', value: 3 },
  { rank: '2', value: 2 },
]

const BET_AMOUNT = 200

const handRankings = [
  { name: 'Royal Flush', payout: 500 },
  { name: 'Straight Flush', payout: 50 },
  { name: 'Four of a Kind', payout: 25 },
  { name: 'Full House', payout: 9 },
  { name: 'Flush', payout: 6 },
  { name: 'Straight', payout: 4 },
  { name: 'Three of a Kind', payout: 3 },
  { name: 'Two Pair', payout: 2 },
  { name: 'Pair of Jacks or Better', payout: 1 },
]

export default function Poker({ coins, setCoins }: PokerProps) {
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [heldCards, setHeldCards] = useState<boolean[]>([false, false, false, false, false])
  const [gameState, setGameState] = useState<'betting' | 'draw' | 'result'>('betting')
  const [handResult, setHandResult] = useState<{ name: string; payout: number } | null>(null)
  const [showCards, setShowCards] = useState(true)

  const createDeck = useCallback((): Card[] => {
    const newDeck: Card[] = []
    suits.forEach(suit => {
      ranks.forEach(({ rank, value }) => {
        newDeck.push({ suit, rank, value })
      })
    })
    return newDeck.sort(() => Math.random() - 0.5)
  }, [])

  const dealCard = useCallback((currentDeck: Card[]): { card: Card; newDeck: Card[] } => {
    const newDeck = [...currentDeck]
    const card = newDeck.pop()!
    return { card, newDeck }
  }, [])

  const evaluateHand = useCallback((hand: Card[]): { name: string; payout: number } => {
    const sortedHand = [...hand].sort((a, b) => b.value - a.value)
    const values = sortedHand.map(card => card.value)
    const suits = sortedHand.map(card => card.suit)
    const valueCounts: { [key: number]: number } = {}

    values.forEach(value => {
      valueCounts[value] = (valueCounts[value] || 0) + 1
    })

    const counts = Object.values(valueCounts).sort((a, b) => b - a)
    const isFlush = suits.every(suit => suit === suits[0])
    const isStraight = values.every((val, i) => i === 0 || val === values[i - 1] - 1) ||
                      (values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2)

    const isRoyalFlush = isFlush && isStraight && values[0] === 14 && values[4] === 10

    if (isRoyalFlush) return { name: 'Royal Flush', payout: 500 }
    if (isFlush && isStraight) return { name: 'Straight Flush', payout: 50 }
    if (counts[0] === 4) return { name: 'Four of a Kind', payout: 25 }
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Full House', payout: 9 }
    if (isFlush) return { name: 'Flush', payout: 6 }
    if (isStraight) return { name: 'Straight', payout: 4 }
    if (counts[0] === 3) return { name: 'Three of a Kind', payout: 3 }
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Two Pair', payout: 2 }
    if (counts[0] === 2) {
      const pairValue = Object.keys(valueCounts).find(key => valueCounts[parseInt(key)] === 2)
      if (parseInt(pairValue!) >= 11) return { name: 'Pair of Jacks or Better', payout: 1 }
    }

    return { name: 'High Card', payout: 0 }
  }, [])

  const startGame = useCallback(() => {
    if (coins < BET_AMOUNT) return

    setCoins(coins - BET_AMOUNT)
    const newDeck = createDeck()
    const hand: Card[] = []
    let currentDeck = newDeck

    for (let i = 0; i < 5; i++) {
      const { card, newDeck: updatedDeck } = dealCard(currentDeck)
      hand.push(card)
      currentDeck = updatedDeck
    }

    setDeck(currentDeck)
    setPlayerHand(hand)
    setHeldCards([false, false, false, false, false])
    setGameState('draw')
    setHandResult(null)
  }, [coins, setCoins, createDeck, dealCard])

  const toggleHold = useCallback((index: number) => {
    if (gameState !== 'draw') return

    setHeldCards(prev => {
      const newHeld = [...prev]
      newHeld[index] = !newHeld[index]
      return newHeld
    })
  }, [gameState])

  const drawCards = useCallback(() => {
    if (gameState !== 'draw') return

    const newHand = [...playerHand]
    let currentDeck = [...deck]

    heldCards.forEach((held, index) => {
      if (!held) {
        const { card, newDeck } = dealCard(currentDeck)
        newHand[index] = card
        currentDeck = newDeck
      }
    })

    setPlayerHand(newHand)
    setDeck(currentDeck)

    const result = evaluateHand(newHand)
    setHandResult(result)

    if (result.payout > 0) {
      setCoins(prev => prev + (BET_AMOUNT * result.payout))
    }

    setGameState('result')
  }, [gameState, playerHand, deck, heldCards, dealCard, evaluateHand, setCoins])

  const newGame = useCallback(() => {
    setGameState('betting')
    setPlayerHand([])
    setHeldCards([false, false, false, false, false])
    setHandResult(null)
  }, [])

  const getCardColor = (suit: string) => {
    return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-black'
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-yellow-400 mb-2">Video Poker ♠️</h2>
        <p className="text-gray-300">Jacks or Better - Hold your best cards and draw!</p>
        <p className="text-sm text-gray-400 mt-2">Bet: {BET_AMOUNT} coins per hand</p>
      </div>

      <div className="bg-green-800 rounded-3xl p-8 shadow-2xl border-4 border-yellow-500 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Your Hand</h3>
          <button
            onClick={() => setShowCards(!showCards)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {showCards ? <EyeOff size={20} /> : <Eye size={20} />}
            {showCards ? 'Hide Cards' : 'Show Cards'}
          </button>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          {playerHand.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleHold(index)}
                className={`w-24 h-32 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border-4 cursor-pointer transition-all ${
                  heldCards[index] ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                } ${gameState !== 'draw' ? 'cursor-default' : ''}`}
              >
                {showCards ? (
                  <>
                    <div className={`text-3xl ${getCardColor(card.suit)}`}>{card.suit}</div>
                    <div className={`text-xl font-bold ${getCardColor(card.suit)}`}>{card.rank}</div>
                  </>
                ) : (
                  <div className="text-blue-900 text-sm font-bold">HIDDEN</div>
                )}
              </motion.div>

              {gameState === 'draw' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-2 px-3 py-1 rounded text-sm font-bold ${
                    heldCards[index]
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  {heldCards[index] ? 'HELD' : 'DRAW'}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {handResult && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-center mb-6"
            >
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {handResult.name}
              </div>
              {handResult.payout > 0 ? (
                <div className="text-2xl font-bold text-green-400">
                  🎉 You won {BET_AMOUNT * handResult.payout} coins! 🎉
                </div>
              ) : (
                <div className="text-xl text-red-400">
                  Better luck next time!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 justify-center">
          {gameState === 'betting' && (
            <button
              onClick={startGame}
              disabled={coins < BET_AMOUNT}
              className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-xl rounded-lg transition-colors"
            >
              <Play size={24} />
              Deal Cards ({BET_AMOUNT} coins)
            </button>
          )}

          {gameState === 'draw' && (
            <button
              onClick={drawCards}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-lg transition-colors"
            >
              Draw Cards
            </button>
          )}

          {gameState === 'result' && (
            <button
              onClick={newGame}
              className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl rounded-lg transition-colors"
            >
              <RotateCcw size={24} />
              New Game
            </button>
          )}
        </div>

        {coins < BET_AMOUNT && gameState === 'betting' && (
          <div className="text-red-400 text-center mt-4">
            <p>Not enough coins to play!</p>
            <p className="text-sm">You need {BET_AMOUNT} coins to play Video Poker</p>
          </div>
        )}
      </div>

      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Paytable</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 text-sm">
          {handRankings.map((hand, index) => (
            <div
              key={index}
              className={`p-2 rounded text-center ${
                handResult?.name === hand.name
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <div className="font-semibold">{hand.name}</div>
              <div className="text-yellow-400">{hand.payout}:1</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}