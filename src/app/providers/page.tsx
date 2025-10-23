'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  Globe,
  Star,
  Mail,
  Calendar,
  Target,
  Zap,
  BarChart,
  Crown
} from 'lucide-react'

export default function ProvidersPage() {
  const [showContact, setShowContact] = useState(false)

  const stats = [
    { label: 'Daily Active Users', value: '25,000+', icon: <Users className="text-blue-400" size={24} /> },
    { label: 'Monthly Revenue', value: '$150K+', icon: <TrendingUp className="text-green-400" size={24} /> },
    { label: 'Games Played Daily', value: '100K+', icon: <Target className="text-purple-400" size={24} /> },
    { label: 'Mobile Users', value: '85%', icon: <Smartphone className="text-yellow-400" size={24} /> }
  ]

  const features = [
    {
      title: 'Proven Player Base',
      description: 'Access to 25,000+ daily active players with high engagement rates',
      icon: <Users className="text-blue-400" size={32} />
    },
    {
      title: 'Modern Tech Stack',
      description: 'Built with Next.js, TypeScript, and scalable cloud infrastructure',
      icon: <Zap className="text-yellow-400" size={32} />
    },
    {
      title: 'Mobile-First Design',
      description: 'PWA-optimized platform with 85% mobile user base',
      icon: <Smartphone className="text-green-400" size={32} />
    },
    {
      title: 'Advanced Analytics',
      description: 'Real-time player insights, engagement metrics, and revenue tracking',
      icon: <BarChart className="text-purple-400" size={32} />
    },
    {
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with social casino compliance standards',
      icon: <Shield className="text-red-400" size={32} />
    },
    {
      title: 'Global Reach',
      description: 'Multi-language support and international payment processing',
      icon: <Globe className="text-cyan-400" size={32} />
    }
  ]

  const integrationSteps = [
    {
      step: '1',
      title: 'API Integration',
      description: 'Connect your games through our RESTful API with comprehensive documentation'
    },
    {
      step: '2',
      title: 'Testing & QA',
      description: 'Thorough testing in our sandbox environment with real player scenarios'
    },
    {
      step: '3',
      title: 'Launch & Promote',
      description: 'Go live with featured placement and promotional campaigns'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Partner with <span className="text-yellow-400">Wreckless Racks Casino</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Join the leading social casino platform. Reach engaged players, maximize revenue, and scale your games globally.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => setShowContact(true)}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              <Mail className="inline mr-2" size={20} />
              Contact Partnership Team
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold text-lg rounded-full transition-all">
              <Calendar className="inline mr-2" size={20} />
              Schedule Demo Call
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Platform Performance
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 p-6 rounded-xl text-center border border-gray-700 hover:border-yellow-500/50 transition-all"
              >
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Partner with Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Process */}
      <section className="py-16 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Simple Integration Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Sharing */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8 rounded-2xl border border-purple-500/30">
            <Crown className="text-yellow-400 mx-auto mb-4" size={48} />
            <h2 className="text-3xl font-bold text-white mb-4">
              Competitive Revenue Sharing
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Industry-leading revenue split with transparent reporting and monthly payouts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400">70%</div>
                <div className="text-gray-400">Provider Revenue Share</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">Real-time</div>
                <div className="text-gray-400">Analytics Dashboard</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">Monthly</div>
                <div className="text-gray-400">Guaranteed Payouts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join successful game providers already earning on our platform
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContact(true)}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Start Partnership Process
            </button>
            <a
              href="mailto:partnerships@wrecklessracks.com"
              className="px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold text-lg rounded-full transition-all"
            >
              partnerships@wrecklessracks.com
            </a>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 p-8 rounded-2xl max-w-md w-full mx-4 border border-yellow-500/30"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Contact Partnership Team</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                  placeholder="Your Game Studio"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none"
                  placeholder="partnerships@yourstudio.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 outline-none h-24"
                  placeholder="Tell us about your games and partnership interest..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg">
                Send Message
              </button>
              <button
                onClick={() => setShowContact(false)}
                className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}