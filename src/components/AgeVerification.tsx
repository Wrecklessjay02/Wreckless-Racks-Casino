'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, Calendar, Lock } from 'lucide-react'

interface AgeVerificationProps {
  isOpen: boolean
  onVerified: () => void
  onClose: () => void
}

export default function AgeVerification({ isOpen, onVerified, onClose }: AgeVerificationProps) {
  const [birthDate, setBirthDate] = useState({
    month: '',
    day: '',
    year: ''
  })
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const calculateAge = (month: number, day: number, year: number) => {
    const today = new Date()
    const birthDate = new Date(year, month - 1, day)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const handleVerification = async () => {
    setError('')

    if (!birthDate.month || !birthDate.day || !birthDate.year || !hasAgreed) {
      setError('Please complete all fields and agree to the terms')
      return
    }

    const month = parseInt(birthDate.month)
    const day = parseInt(birthDate.day)
    const year = parseInt(birthDate.year)

    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
      setError('Please enter a valid birth date')
      return
    }

    const age = calculateAge(month, day, year)

    if (age < 21) {
      setError('You must be 21 or older to access this site')
      return
    }

    setIsVerifying(true)

    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Store verification in localStorage
    localStorage.setItem('wreckless_racks_age_verified', JSON.stringify({
      verified: true,
      timestamp: Date.now()
    }))

    setIsVerifying(false)
    onVerified()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-md w-full mx-4 border border-yellow-500/30"
      >
        <div className="text-center mb-6">
          <Shield className="text-yellow-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Age Verification Required</h2>
          <p className="text-gray-300 text-sm">
            You must be 21 or older to access Wreckless Racks Casino
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isVerifying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <label className="block text-gray-300 mb-3">
                  <Calendar className="inline mr-2" size={16} />
                  Date of Birth
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={birthDate.month}
                    onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                  >
                    <option value="">Month</option>
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    value={birthDate.day}
                    onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>

                  <select
                    value={birthDate.year}
                    onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                  />
                  <span className="text-gray-300 text-sm">
                    I confirm that I am 21 years of age or older and agree to the{' '}
                    <a href="/terms" className="text-yellow-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle size={16} />
                    <span className="text-sm">{error}</span>
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleVerification}
                disabled={!hasAgreed}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all"
              >
                Verify Age & Enter Casino
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  I am under 21 - Take me back
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-3 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-white mb-2">Verifying Age...</h3>
              <p className="text-gray-400">Please wait while we verify your information</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock size={12} />
            <span>Your information is encrypted and secure</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}