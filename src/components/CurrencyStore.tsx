'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface CurrencyStoreProps {
  isOpen: boolean
  onClose: () => void
  coins: number
  setCoins: (coins: number) => void
}

export default function CurrencyStore({ isOpen, onClose, coins, setCoins }: CurrencyStoreProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Coin Store</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="text-center py-8">
            <div className="text-6xl mb-4">🪙</div>
            <h4 className="text-xl font-bold text-yellow-400 mb-2">Store Coming Soon!</h4>
            <p className="text-gray-300 mb-4">
              Coin purchases are temporarily unavailable.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Keep playing with your current coins and earn more by winning!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Continue Playing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}