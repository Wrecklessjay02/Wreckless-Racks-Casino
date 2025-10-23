'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Clock,
  Smartphone,
  Globe,
  X,
  Calendar,
  Zap,
  Crown
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    today: number
    week: number
    month: number
    growth: number
  }
  players: {
    active: number
    new: number
    retention: number
    avgSession: number
  }
  games: {
    mostPlayed: string
    avgBet: number
    totalSpins: number
    winRate: number
  }
  conversion: {
    signupToFirstPurchase: number
    freeToPayingRate: number
    avgPurchaseSize: number
    ltv: number
  }
}

interface ABTest {
  id: string
  name: string
  status: 'running' | 'completed' | 'planned'
  participants: number
  improvement: number | null
  startDate: string
  endDate?: string
  variants: {
    name: string
    traffic: number
    conversion: number
  }[]
}

interface AnalyticsDashboardProps {
  isOpen: boolean
  onClose: () => void
  userRole: 'admin' | 'owner' | 'analytics'
}

export default function AnalyticsDashboard({ isOpen, onClose, userRole }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'revenue' | 'abtests'>('overview')
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')

  // Simulated analytics data
  const [analyticsData] = useState<AnalyticsData>({
    revenue: {
      today: 2847,
      week: 18934,
      month: 78432,
      growth: 12.5
    },
    players: {
      active: 1247,
      new: 89,
      retention: 68.4,
      avgSession: 23.7
    },
    games: {
      mostPlayed: 'MEGA SLOTS',
      avgBet: 125,
      totalSpins: 45672,
      winRate: 42.3
    },
    conversion: {
      signupToFirstPurchase: 8.7,
      freeToPayingRate: 15.2,
      avgPurchaseSize: 24.99,
      ltv: 187.50
    }
  })

  const [abTests] = useState<ABTest[]>([
    {
      id: 'coin_packages',
      name: 'Coin Package Prices',
      status: 'running',
      participants: 1200,
      improvement: null,
      startDate: '2024-10-15',
      variants: [
        { name: 'Control (Current)', traffic: 50, conversion: 8.2 },
        { name: 'Lower Prices', traffic: 50, conversion: 11.7 }
      ]
    },
    {
      id: 'onboarding_flow',
      name: 'New Player Onboarding',
      status: 'completed',
      participants: 2500,
      improvement: 23.5,
      startDate: '2024-09-20',
      endDate: '2024-10-10',
      variants: [
        { name: 'Original Flow', traffic: 50, conversion: 6.8 },
        { name: 'Guided Tutorial', traffic: 50, conversion: 8.4 }
      ]
    },
    {
      id: 'daily_bonus_ui',
      name: 'Daily Bonus Modal Design',
      status: 'planned',
      participants: 0,
      improvement: null,
      startDate: '2024-11-01',
      variants: [
        { name: 'Current Design', traffic: 50, conversion: 0 },
        { name: 'Animated Version', traffic: 50, conversion: 0 }
      ]
    }
  ])

  const revenueChartData = [
    { day: 'Mon', amount: 2400 },
    { day: 'Tue', amount: 3200 },
    { day: 'Wed', amount: 2800 },
    { day: 'Thu', amount: 3800 },
    { day: 'Fri', amount: 4200 },
    { day: 'Sat', amount: 5100 },
    { day: 'Sun', amount: 4800 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-400/20'
      case 'completed': return 'text-blue-400 bg-blue-400/20'
      case 'planned': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-blue-500/30"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BarChart className="text-blue-400" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <p className="text-gray-300">Real-time casino performance metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart size={16} /> },
            { id: 'players', label: 'Players', icon: <Users size={16} /> },
            { id: 'revenue', label: 'Revenue', icon: <DollarSign size={16} /> },
            { id: 'abtests', label: 'A/B Tests', icon: <Target size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="text-green-400" size={24} />
                  <div className="text-green-400 text-sm font-semibold">+{analyticsData.revenue.growth}%</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">${analyticsData.revenue.week.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Weekly Revenue</div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 rounded-xl border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-blue-400" size={24} />
                  <div className="text-blue-400 text-sm font-semibold">+{analyticsData.players.new}</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{analyticsData.players.active.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Active Players</div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <Target className="text-purple-400" size={24} />
                  <div className="text-purple-400 text-sm font-semibold">{analyticsData.conversion.freeToPayingRate}%</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">${analyticsData.conversion.avgPurchaseSize}</div>
                <div className="text-gray-400 text-sm">Avg Purchase</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="text-yellow-400" size={24} />
                  <div className="text-yellow-400 text-sm font-semibold">{analyticsData.players.retention}%</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{analyticsData.players.avgSession}m</div>
                <div className="text-gray-400 text-sm">Avg Session</div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-800/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4">Revenue Trend</h3>
              <div className="flex items-end gap-2 h-40">
                {revenueChartData.map((data, index) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.amount / 5100) * 100}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t min-h-[4px] mb-2"
                    />
                    <div className="text-xs text-gray-400">{data.day}</div>
                    <div className="text-xs text-white font-semibold">${(data.amount / 1000).toFixed(1)}k</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Top Performing Games</h3>
                <div className="space-y-3">
                  {[
                    { name: 'MEGA SLOTS', plays: 15420, revenue: 8932 },
                    { name: 'Lucky Slots', plays: 12380, revenue: 6741 },
                    { name: 'Blackjack', plays: 8760, revenue: 4892 },
                    { name: 'Roulette', plays: 6540, revenue: 3654 },
                    { name: 'Video Poker', plays: 4320, revenue: 2187 }
                  ].map((game, index) => (
                    <div key={game.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{game.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">${game.revenue}</div>
                        <div className="text-gray-400 text-xs">{game.plays} plays</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Player Segments</h3>
                <div className="space-y-4">
                  {[
                    { segment: 'High Rollers', count: 45, ltv: 1250, color: 'from-yellow-500 to-orange-500' },
                    { segment: 'Regular Players', count: 312, ltv: 287, color: 'from-blue-500 to-purple-500' },
                    { segment: 'Casual Players', count: 890, ltv: 89, color: 'from-green-500 to-emerald-500' }
                  ].map((segment) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white font-medium">{segment.segment}</span>
                        <span className="text-gray-400">{segment.count} players</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${segment.color} h-2 rounded-full`}
                          style={{ width: `${(segment.count / 890) * 100}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-400">Avg LTV: ${segment.ltv}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* A/B Tests Tab */}
        {activeTab === 'abtests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Active A/B Tests</h3>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
                Create New Test
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {abTests.map((test) => (
                <div key={test.id} className="bg-gray-800/50 p-6 rounded-xl border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white">{test.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(test.status)}`}>
                          {test.status.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">{test.participants} participants</span>
                        <span className="text-gray-400 text-sm">Started {test.startDate}</span>
                      </div>
                    </div>
                    {test.improvement && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">+{test.improvement}%</div>
                        <div className="text-sm text-gray-400">Improvement</div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {test.variants.map((variant, index) => (
                      <div key={variant.name} className={`p-4 rounded-lg ${index === 0 ? 'bg-gray-700/50' : 'bg-blue-900/30'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-white">{variant.name}</span>
                          <span className="text-sm text-gray-400">{variant.traffic}% traffic</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{variant.conversion}%</div>
                        <div className="text-sm text-gray-400">Conversion Rate</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional tabs can be implemented similarly */}
      </motion.div>
    </div>
  )
}