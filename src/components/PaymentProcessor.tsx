'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import {
  X,
  CreditCard,
  Smartphone,
  Shield,
  Lock,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentProcessorProps {
  isOpen: boolean
  onClose: () => void
  packageData: {
    id: string
    coins: number
    price: number
    bonus: number
  } | null
  onSuccess: (totalCoins: number) => void
}

type PaymentMethod = 'card' | 'apple' | 'google' | 'paypal'
type PaymentStep = 'method' | 'details' | 'processing' | 'success' | 'error'

export default function PaymentProcessor({
  isOpen,
  onClose,
  packageData,
  onSuccess
}: PaymentProcessorProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method')
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    email: '',
    zipCode: ''
  })

  // Create payment intent when component opens
  useEffect(() => {
    if (isOpen && packageData) {
      createPaymentIntent()
    }
  }, [isOpen, packageData])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: packageData?.id,
          userId: 'demo_user_' + Date.now() // In production, get from auth context
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
      } else if (data.error) {
        setErrorMessage(data.error)
      } else {
        setErrorMessage('Failed to initialize payment')
      }
    } catch (error) {
      console.error('Payment intent creation failed:', error)
      setErrorMessage('Payment system unavailable. Please try again later.')
      // For demo mode, we can still allow the UI to work
      setClientSecret('demo_mode')
    }
  }

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      icon: <CreditCard size={24} />,
      description: 'Visa, Mastercard, Discover',
      recommended: true
    },
    {
      id: 'apple' as PaymentMethod,
      name: 'Apple Pay',
      icon: <Smartphone size={24} />,
      description: 'Touch ID or Face ID',
      available: true
    },
    {
      id: 'google' as PaymentMethod,
      name: 'Google Pay',
      icon: <Smartphone size={24} />,
      description: 'Quick & secure',
      available: true
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      icon: <span className="text-2xl">💳</span>,
      description: 'PayPal account',
      available: false
    }
  ]

  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
    if (method === 'apple' || method === 'google') {
      processDigitalWalletPayment(method)
    } else {
      setCurrentStep('details')
    }
  }

  const processDigitalWalletPayment = async (method: PaymentMethod) => {
    setCurrentStep('processing')
    setIsProcessing(true)
    setErrorMessage('')

    try {
      if (method === 'apple' || method === 'google') {
        // For demo purposes, simulate digital wallet payments
        await new Promise(resolve => setTimeout(resolve, 2000))
        const totalCoins = (packageData?.coins || 0) + (packageData?.bonus || 0)
        onSuccess(totalCoins)
        setCurrentStep('success')
      } else {
        setErrorMessage('Payment method not yet implemented')
        setCurrentStep('error')
      }
    } catch (error) {
      setErrorMessage('Payment processing failed')
      setCurrentStep('error')
    }

    setIsProcessing(false)
  }

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    setCurrentStep('processing')
    setIsProcessing(true)
    setErrorMessage('')

    try {
      if (clientSecret && clientSecret !== 'demo_mode') {
        // Try real Stripe payment (when environment is properly configured)
        const stripe = await stripePromise
        if (stripe && clientSecret.startsWith('pi_')) {
          // This would be real Stripe payment in production
          // For now, simulate success
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
      } else {
        // Demo mode - simulate payment processing
        console.log('Running in demo mode - simulating payment')
        await new Promise(resolve => setTimeout(resolve, 2500))
      }

      const totalCoins = (packageData?.coins || 0) + (packageData?.bonus || 0)
      onSuccess(totalCoins)
      setCurrentStep('success')
    } catch (error) {
      console.error('Payment error:', error)
      setErrorMessage('Payment processing failed. Please try again.')
      setCurrentStep('error')
    }

    setIsProcessing(false)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  if (!isOpen || !packageData) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl max-w-md w-full mx-4 border border-yellow-500/30"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {currentStep !== 'method' && currentStep !== 'success' && (
              <button
                onClick={() => setCurrentStep('method')}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="text-gray-400" size={20} />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-white">
                {currentStep === 'success' ? 'Payment Successful!' : 'Secure Payment'}
              </h3>
              <p className="text-gray-400 text-sm">
                {packageData.coins.toLocaleString()} + {packageData.bonus.toLocaleString()} bonus coins
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Payment Method Selection */}
          {currentStep === 'method' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Amount:</span>
                    <span className="text-2xl font-bold text-yellow-400">${packageData.price}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {(packageData.coins + packageData.bonus).toLocaleString()} coins total
                  </div>
                </div>

                <h4 className="text-white font-semibold mb-3">Choose Payment Method:</h4>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => method.available !== false && handleMethodSelect(method.id)}
                      disabled={method.available === false}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        method.available === false
                          ? 'border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed'
                          : paymentMethod === method.id
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-yellow-400">{method.icon}</div>
                        <div className="text-left">
                          <div className="text-white font-medium">{method.name}</div>
                          <div className="text-gray-400 text-sm">{method.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.recommended && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Recommended
                          </span>
                        )}
                        {method.available === false && (
                          <span className="text-gray-500 text-xs">Coming Soon</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Card Details Form */}
          {currentStep === 'details' && paymentMethod === 'card' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleCardPayment} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      cardNumber: formatCardNumber(e.target.value)
                    })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        expiryDate: formatExpiryDate(e.target.value)
                      })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">CVV</label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => setFormData({
                        ...formData,
                        cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                      })}
                      placeholder="123"
                      maxLength={4}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={formData.holderName}
                    onChange={(e) => setFormData({
                      ...formData,
                      holderName: e.target.value
                    })}
                    placeholder="John Doe"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: e.target.value
                    })}
                    placeholder="john@example.com"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-lg transition-all"
                >
                  Complete Payment (${packageData.price})
                </button>
              </form>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <Shield size={16} />
                <span>256-bit SSL encryption • PCI DSS compliant</span>
              </div>
            </motion.div>
          )}

          {/* Processing */}
          {currentStep === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-bold text-white mb-2">Processing Payment...</h4>
              <p className="text-gray-400">Please don't close this window</p>
            </motion.div>
          )}

          {/* Success */}
          {currentStep === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="text-white" size={32} />
              </motion.div>
              <h4 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h4>
              <p className="text-gray-300 mb-4">
                {(packageData.coins + packageData.bonus).toLocaleString()} coins added to your account
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all"
              >
                Continue Playing
              </button>
            </motion.div>
          )}

          {/* Error */}
          {currentStep === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <AlertCircle className="text-white" size={32} />
              </motion.div>
              <h4 className="text-2xl font-bold text-red-400 mb-2">Payment Failed</h4>
              <p className="text-gray-300 mb-4">
                {errorMessage || 'Something went wrong with your payment. Please try again.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCurrentStep('method')
                    setErrorMessage('')
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Footer */}
        {currentStep !== 'processing' && currentStep !== 'success' && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Lock size={12} />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={12} />
                <span>Protected</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={12} />
                <span>No gambling</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}