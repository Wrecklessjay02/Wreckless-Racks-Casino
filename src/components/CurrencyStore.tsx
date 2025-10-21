'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Coins, Zap, Diamond, Crown, CreditCard, Smartphone } from 'lucide-react'

interface CurrencyStoreProps {
  isOpen: boolean
  onClose: () => void
  coins: number
  setCoins: (coins: number) => void
}

const coinPackages = [
  {
    id: 'starter',
    coins: 1000,
    price: 0.99,
    bonus: 0,
    popular: false,
    icon: <Coins className="text-yellow-500" size={24} />
  },
  {
    id: 'value',
    coins: 5000,
    price: 4.99,
    bonus: 1000,
    popular: true,
    icon: <Zap className="text-blue-500" size={24} />
  },
  {
    id: 'premium',
    coins: 12000,
    price: 9.99,
    bonus: 3000,
    popular: false,
    icon: <Diamond className="text-purple-500" size={24} />
  },
  {
    id: 'mega',
    coins: 25000,
    price: 19.99,
    bonus: 8000,
    popular: false,
    icon: <Crown className="text-orange-500" size={24} />
  },
  {
    id: 'ultimate',
    coins: 50000,
    price: 39.99,
    bonus: 20000,
    popular: false,
    icon: <Crown className="text-red-500" size={24} />
  },
  {
    id: 'whale',
    coins: 100000,
    price: 79.99,
    bonus: 50000,
    popular: false,
    icon: <Crown className="text-rainbow" size={24} />
  }
]

export default function CurrencyStore({ isOpen, onClose, coins, setCoins }: CurrencyStoreProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card')

  const handlePurchase = (packageData: typeof coinPackages[0]) => {
    const totalCoins = packageData.coins + packageData.bonus
    setCoins(coins + totalCoins)
    onClose()

    // In a real app, this would integrate with payment processors
    alert(`Successfully purchased ${totalCoins.toLocaleString()} coins for $${packageData.price}!`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-yellow-500/30"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Coin Store</h2>
            <p className="text-gray-300">Fuel your winning streak!</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {coinPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                pkg.popular
                  ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                  : selectedPackage === pkg.id
                  ? 'border-blue-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                  BEST VALUE
                </div>
              )}

              <div className="text-center">
                <div className="mb-4">{pkg.icon}</div>

                <div className="text-2xl font-bold text-white mb-2">
                  {pkg.coins.toLocaleString()} Coins
                </div>

                {pkg.bonus > 0 && (
                  <div className="text-green-400 font-semibold mb-2">
                    +{pkg.bonus.toLocaleString()} Bonus!
                  </div>
                )}

                <div className="text-3xl font-bold text-yellow-400 mb-4">
                  ${pkg.price}
                </div>

                <div className="text-sm text-gray-400 mb-4">
                  Total: {(pkg.coins + pkg.bonus).toLocaleString()} coins
                </div>

                <button
                  onClick={() => handlePurchase(pkg)}
                  className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-bold text-white mb-4">Payment Methods</h3>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                paymentMethod === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <CreditCard size={20} />
              Credit Card
            </button>

            <button
              onClick={() => setPaymentMethod('apple')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                paymentMethod === 'apple'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Smartphone size={20} />
              Apple Pay
            </button>

            <button
              onClick={() => setPaymentMethod('google')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                paymentMethod === 'google'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Smartphone size={20} />
              Google Pay
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>🔒 Secure payments • No real money gambling • 21+ only</p>
          <p>Coins have no cash value and cannot be redeemed for real money</p>
        </div>
      </motion.div>
    </div>
  )
}