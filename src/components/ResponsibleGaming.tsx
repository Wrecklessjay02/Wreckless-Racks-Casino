'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Clock, DollarSign, AlertTriangle, Heart, Phone } from 'lucide-react'

interface ResponsibleGamingProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResponsibleGaming({ isOpen, onClose }: ResponsibleGamingProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'limits' | 'support'>('overview')

  const supportResources = [
    {
      name: 'National Council on Problem Gambling',
      phone: '1-800-522-4700',
      website: 'ncpgambling.org',
      description: '24/7 confidential helpline'
    },
    {
      name: 'Gamblers Anonymous',
      phone: '1-855-222-5542',
      website: 'gamblersanonymous.org',
      description: 'Support groups and meetings'
    },
    {
      name: 'GamCare',
      phone: '0808-8020-133',
      website: 'gamcare.org.uk',
      description: 'UK support and advice'
    }
  ]

  const warningSignsItems = [
    'Spending more time or money than intended',
    'Feeling anxious or upset when not playing',
    'Borrowing money to purchase coins',
    'Neglecting responsibilities or relationships',
    'Playing to escape problems or negative feelings',
    'Lying about time or money spent on gaming'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-green-500/30"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Shield className="text-green-400" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-white">Responsible Gaming</h2>
              <p className="text-gray-300">Your well-being is our priority</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <Heart size={16} /> },
            { id: 'limits', label: 'Set Limits', icon: <Clock size={16} /> },
            { id: 'support', label: 'Get Help', icon: <Phone size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-4">Play Responsibly</h3>
                <p className="text-gray-300 mb-4">
                  Wreckless Racks Casino is designed for entertainment. Our virtual coins have no real monetary value
                  and cannot be exchanged for real money or prizes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="text-green-400" size={20} />
                    <span className="text-white">Set time limits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-green-400" size={20} />
                    <span className="text-white">Track your spending</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-400" size={20} />
                  Warning Signs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {warningSignsItems.map((sign, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{sign}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
                <h4 className="text-lg font-bold text-blue-400 mb-2">Healthy Gaming Tips</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Only spend money you can afford to lose</li>
                  <li>• Take regular breaks from gaming</li>
                  <li>• Don't chase losses or try to win back money</li>
                  <li>• Keep gaming as a form of entertainment, not income</li>
                  <li>• Talk to friends and family about your gaming habits</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'limits' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-500/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Set Your Limits</h3>
                <p className="text-gray-300 mb-6">
                  Setting limits helps you maintain control over your gaming experience. These limits will be enforced
                  to help you stay within your comfort zone.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Daily Spending Limit</label>
                    <select className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none">
                      <option value="">No limit</option>
                      <option value="10">$10 per day</option>
                      <option value="25">$25 per day</option>
                      <option value="50">$50 per day</option>
                      <option value="100">$100 per day</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Session Time Limit</label>
                    <select className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none">
                      <option value="">No limit</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="180">3 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Loss Limit</label>
                    <select className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none">
                      <option value="">No limit</option>
                      <option value="1000">1,000 coins</option>
                      <option value="5000">5,000 coins</option>
                      <option value="10000">10,000 coins</option>
                      <option value="25000">25,000 coins</option>
                    </select>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-lg transition-all">
                    Save Limits
                  </button>
                </div>
              </div>

              <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
                <h4 className="text-lg font-bold text-red-400 mb-2">Self-Exclusion</h4>
                <p className="text-gray-300 text-sm mb-3">
                  If you need a break, you can temporarily exclude yourself from the casino.
                </p>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all text-sm">
                  Request Self-Exclusion
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Get Help & Support</h3>
                <p className="text-gray-300 mb-6">
                  If you or someone you know has a gambling problem, help is available. These organizations
                  provide free, confidential support.
                </p>

                <div className="space-y-4">
                  {supportResources.map((resource, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white">{resource.name}</h4>
                        <div className="text-right">
                          <div className="text-green-400 font-mono text-sm">{resource.phone}</div>
                          <div className="text-blue-400 text-xs">{resource.website}</div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{resource.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
                <h4 className="text-lg font-bold text-blue-400 mb-2">Crisis Support</h4>
                <p className="text-gray-300 text-sm mb-3">
                  If you're in immediate crisis or having thoughts of self-harm:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="text-red-400" size={16} />
                    <span className="text-white font-semibold">988 Suicide & Crisis Lifeline</span>
                  </div>
                  <div className="text-gray-400 text-sm">Call or text 988 for immediate support</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>🔒 Confidential Support</span>
            <span>📞 24/7 Helplines</span>
            <span>💚 Your Wellbeing Matters</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}