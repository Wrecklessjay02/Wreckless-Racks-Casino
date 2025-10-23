'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Facebook, Twitter, Instagram, Copy, Check } from 'lucide-react'

interface SocialShareProps {
  isOpen: boolean
  onClose: () => void
  shareData: {
    title: string
    description: string
    url?: string
    image?: string
  }
}

export default function SocialShare({ isOpen, onClose, shareData }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = shareData.url || 'https://wrecklessracks.vercel.app'
  const shareText = `${shareData.title} - ${shareData.description}`

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <Facebook size={24} />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Twitter',
      icon: <Twitter size={24} />,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: <span className="text-2xl">💬</span>,
      color: 'bg-green-600 hover:bg-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    },
    {
      name: 'Telegram',
      icon: <span className="text-2xl">✈️</span>,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    }
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl max-w-md w-full mx-4 border border-yellow-500/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="text-yellow-400" size={24} />
          <h3 className="text-xl font-bold text-white">Share Your Win!</h3>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Preview Card */}
        <div className="bg-gray-800/50 p-4 rounded-xl mb-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xl">
              💸
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{shareData.title}</h4>
              <p className="text-gray-400 text-xs">Wreckless Racks Casino</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">{shareData.description}</p>
        </div>

        {/* Social Platforms */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {socialPlatforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handleShare(platform.url)}
              className={`flex items-center gap-3 p-3 rounded-lg text-white font-medium transition-all ${platform.color}`}
            >
              {platform.icon}
              <span className="text-sm">{platform.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link */}
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-all"
          >
            {copied ? (
              <>
                <Check size={20} className="text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={20} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Invite Friends Bonus */}
        <div className="mt-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-3 rounded-lg border border-purple-500/30">
          <div className="text-center">
            <div className="text-2xl mb-1">🎁</div>
            <p className="text-sm text-purple-300 font-semibold">Invite Friends Bonus</p>
            <p className="text-xs text-gray-400">Get 1000 coins for each friend who joins!</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}