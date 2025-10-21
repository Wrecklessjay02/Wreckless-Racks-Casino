'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Pause } from 'lucide-react'

interface Card {
  suit: string
  rank: string
  value: number
}

interface BlackjackProps {
  coins: number
  setCoins: (coins: number) => void
}

const suits = ['♠', '♥', '♦', '♣']
const ranks = [
  { rank: 'A', value: 11 },
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 10 },
  { rank: 'Q', value: 10 },
  { rank: 'K', value: 10 },
]

const BET_AMOUNT = 100

export default function Blackjack({ coins, setCoins }: BlackjackProps) {
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting')
  const [message, setMessage] = useState('Place your bet to start!')
  const [showDealerCard, setShowDealerCard] = useState(false)

  const createDeck = useCallback((): Card[] => {
    const newDeck: Card[] = []
    suits.forEach(suit => {
      ranks.forEach(({ rank, value }) => {
        newDeck.push({ suit, rank, value })
      })
    })
    return newDeck.sort(() => Math.random() - 0.5)
  }, [])

  const calculateHandValue = useCallback((hand: Card[]): number => {
    let value = 0
    let aces = 0

    hand.forEach(card => {
      if (card.rank === 'A') {
        aces++
        value += 11
      } else {
        value += card.value
      }
    })

    while (value > 21 && aces > 0) {
      value -= 10
      aces--
    }

    return value
  }, [])

  const dealCard = useCallback((currentDeck: Card[]): { card: Card; newDeck: Card[] } => {
    const newDeck = [...currentDeck]
    const card = newDeck.pop()!
    return { card, newDeck }
  }, [])

  const startGame = useCallback(() => {
    if (coins < BET_AMOUNT) return

    setCoins(coins - BET_AMOUNT)
    const newDeck = createDeck()

    const { card: playerCard1, newDeck: deck1 } = dealCard(newDeck)
    const { card: dealerCard1, newDeck: deck2 } = dealCard(deck1)
    const { card: playerCard2, newDeck: deck3 } = dealCard(deck2)
    const { card: dealerCard2, newDeck: finalDeck } = dealCard(deck3)

    setDeck(finalDeck)
    setPlayerHand([playerCard1, playerCard2])
    setDealerHand([dealerCard1, dealerCard2])
    setGameState('playing')
    setShowDealerCard(false)
    setMessage('Hit or Stand?')
  }, [coins, setCoins, createDeck, dealCard])

  const hit = useCallback(() => {
    if (gameState !== 'playing') return

    const { card, newDeck } = dealCard(deck)
    const newPlayerHand = [...playerHand, card]
    setPlayerHand(newPlayerHand)
    setDeck(newDeck)

    const playerValue = calculateHandValue(newPlayerHand)
    if (playerValue > 21) {
      setGameState('finished')
      setMessage('Bust! You lose!')
      setShowDealerCard(true)
    }
  }, [gameState, deck, playerHand, dealCard, calculateHandValue])

  const stand = useCallback(() => {
    if (gameState !== 'playing') return

    setGameState('dealer')
    setShowDealerCard(true)
    setMessage('Dealer&apos;s turn...')

    setTimeout(() => {
      const currentDealerHand = [...dealerHand]
      let currentDeck = [...deck]

      while (calculateHandValue(currentDealerHand) < 17) {
        const { card, newDeck } = dealCard(currentDeck)
        currentDealerHand.push(card)
        currentDeck = newDeck
      }

      setDealerHand(currentDealerHand)
      setDeck(currentDeck)

      const playerValue = calculateHandValue(playerHand)
      const dealerValue = calculateHandValue(currentDealerHand)

      if (dealerValue > 21) {
        setMessage('Dealer busts! You win!')
        setCoins(prev => prev + BET_AMOUNT * 2)
      } else if (dealerValue > playerValue) {
        setMessage('Dealer wins!')
      } else if (playerValue > dealerValue) {
        setMessage('You win!')
        setCoins(prev => prev + BET_AMOUNT * 2)
      } else {
        setMessage('Push! It\'s a tie!')
        setCoins(prev => prev + BET_AMOUNT)
      }

      setGameState('finished')
    }, 1500)
  }, [gameState, dealerHand, deck, playerHand, calculateHandValue, dealCard, setCoins])

  const resetGame = useCallback(() => {
    setPlayerHand([])
    setDealerHand([])
    setGameState('betting')
    setMessage('Place your bet to start!')
    setShowDealerCard(false)
  }, [])

  const getCardColor = (suit: string) => {
    return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-black'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-yellow-400 mb-2">Blackjack 🃏</h2>
        <p className="text-gray-300">Get as close to 21 as possible without going over!</p>
        <p className="text-sm text-gray-400 mt-2">Bet: {BET_AMOUNT} coins per hand</p>
      </div>

      <div className="bg-green-800 rounded-3xl p-8 shadow-2xl border-4 border-yellow-500">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Dealer's Hand {showDealerCard ? `(${calculateHandValue(dealerHand)})` : '(?)'}
          </h3>
          <div className="flex gap-2 justify-center">
            {dealerHand.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`w-20 h-28 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border-2 border-gray-300 ${
                  index === 1 && !showDealerCard ? 'bg-blue-900' : ''
                }`}
              >
                {index === 1 && !showDealerCard ? (
                  <div className="text-white text-xs">Hidden</div>
                ) : (
                  <>
                    <div className={`text-2xl ${getCardColor(card.suit)}`}>{card.suit}</div>
                    <div className={`text-lg font-bold ${getCardColor(card.suit)}`}>{card.rank}</div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Your Hand ({calculateHandValue(playerHand)})
          </h3>
          <div className="flex gap-2 justify-center">
            {playerHand.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="w-20 h-28 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border-2 border-gray-300"
              >
                <div className={`text-2xl ${getCardColor(card.suit)}`}>{card.suit}</div>
                <div className={`text-lg font-bold ${getCardColor(card.suit)}`}>{card.rank}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-6">{message}</div>

          <div className="flex gap-4 justify-center">
            {gameState === 'betting' && (
              <button
                onClick={startGame}
                disabled={coins < BET_AMOUNT}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
              >
                <Play size={20} />
                Deal Cards ({BET_AMOUNT} coins)
              </button>
            )}

            {gameState === 'playing' && (
              <>
                <button
                  onClick={hit}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                  Hit
                </button>
                <button
                  onClick={stand}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Stand
                </button>
              </>
            )}

            {gameState === 'dealer' && (
              <div className="flex items-center gap-2 text-yellow-400">
                <Pause size={20} />
                Dealer is playing...
              </div>
            )}

            {gameState === 'finished' && (
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
              >
                <RotateCcw size={20} />
                New Game
              </button>
            )}
          </div>

          {coins < BET_AMOUNT && gameState === 'betting' && (
            <div className="text-red-400 mt-4">
              <p>Not enough coins to play!</p>
              <p className="text-sm">You need {BET_AMOUNT} coins to play Blackjack</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-gray-300 text-sm">
        <p>🃏 Blackjack pays 2:1 | Dealer stands on 17 | Aces count as 1 or 11</p>
      </div>
    </div>
  )
}