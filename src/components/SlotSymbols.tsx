'use client'

import { motion } from 'framer-motion'

interface SlotSymbolProps {
  symbol: string
  size?: 'small' | 'medium' | 'large'
  isWinning?: boolean
  className?: string
}

const symbolData = {
  'cherry': {
    color: 'from-red-500 via-red-400 to-red-600',
    shadow: 'drop-shadow-lg shadow-red-500/50',
    glow: 'shadow-red-500/70',
    content: '🍒'
  },
  'lemon': {
    color: 'from-yellow-400 via-yellow-300 to-yellow-500',
    shadow: 'drop-shadow-lg shadow-yellow-500/50',
    glow: 'shadow-yellow-500/70',
    content: '🍋'
  },
  'orange': {
    color: 'from-orange-400 via-orange-300 to-orange-500',
    shadow: 'drop-shadow-lg shadow-orange-500/50',
    glow: 'shadow-orange-500/70',
    content: '🍊'
  },
  'grape': {
    color: 'from-purple-500 via-purple-400 to-purple-600',
    shadow: 'drop-shadow-lg shadow-purple-500/50',
    glow: 'shadow-purple-500/70',
    content: '🍇'
  },
  'star': {
    color: 'from-yellow-300 via-yellow-200 to-yellow-400',
    shadow: 'drop-shadow-lg shadow-yellow-400/70',
    glow: 'shadow-yellow-400/90',
    content: '⭐'
  },
  'diamond': {
    color: 'from-cyan-300 via-blue-200 to-cyan-400',
    shadow: 'drop-shadow-lg shadow-cyan-400/70',
    glow: 'shadow-cyan-400/90',
    content: '💎'
  },
  'seven': {
    color: 'from-red-600 via-red-500 to-red-700',
    shadow: 'drop-shadow-lg shadow-red-600/70',
    glow: 'shadow-red-600/90',
    content: '7',
    isNumber: true
  },
  'bar': {
    color: 'from-gray-400 via-gray-300 to-gray-500',
    shadow: 'drop-shadow-lg shadow-gray-500/50',
    glow: 'shadow-gray-500/70',
    content: 'BAR',
    isText: true
  },
  'jackpot': {
    color: 'from-yellow-400 via-yellow-300 to-orange-400',
    shadow: 'drop-shadow-lg shadow-yellow-400/90',
    glow: 'shadow-yellow-400/100',
    content: '👑',
    isSpecial: true
  },
  'wild': {
    color: 'from-green-400 via-green-300 to-emerald-400',
    shadow: 'drop-shadow-lg shadow-green-400/70',
    glow: 'shadow-green-400/90',
    content: 'WILD',
    isText: true,
    isSpecial: true
  }
}

export default function SlotSymbol({ symbol, size = 'medium', isWinning = false, className = '' }: SlotSymbolProps) {
  const symbolInfo = symbolData[symbol as keyof typeof symbolData] || symbolData['cherry']

  const sizeClasses = {
    small: 'w-12 h-12 text-lg',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-20 h-20 text-3xl'
  }

  const baseClasses = `
    ${sizeClasses[size]}
    relative
    flex items-center justify-center
    rounded-xl
    border-2
    font-bold
    transition-all
    duration-300
    ${isWinning ? 'border-yellow-400 scale-110' : 'border-white/30'}
    ${className}
  `

  return (
    <motion.div
      className={baseClasses}
      style={{
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        backgroundImage: `linear-gradient(135deg, ${symbolInfo.color.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`
      }}
      animate={isWinning ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        boxShadow: [
          '0 0 0px rgba(255, 255, 255, 0)',
          '0 0 20px rgba(255, 255, 255, 0.8)',
          '0 0 0px rgba(255, 255, 255, 0)'
        ]
      } : {}}
      transition={{
        duration: 0.6,
        repeat: isWinning ? Infinity : 0,
        repeatType: 'reverse'
      }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Glow effect for winning symbols */}
      {isWinning && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-75"
          style={{
            background: `linear-gradient(135deg, ${symbolInfo.color.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`,
            filter: 'blur(8px)'
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      )}

      {/* Symbol content */}
      <div className="relative z-10 flex items-center justify-center">
        {symbolInfo.isNumber ? (
          <span
            className="font-black text-white text-shadow-lg"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(255,255,255,0.3)'
            }}
          >
            {symbolInfo.content}
          </span>
        ) : symbolInfo.isText ? (
          <span
            className={`font-black text-white text-shadow-lg ${size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base'}`}
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(255,255,255,0.3)'
            }}
          >
            {symbolInfo.content}
          </span>
        ) : (
          <span
            className="drop-shadow-lg"
            style={{
              filter: isWinning ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
            }}
          >
            {symbolInfo.content}
          </span>
        )}
      </div>

      {/* Special effects for jackpot/wild symbols */}
      {symbolInfo.isSpecial && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-yellow-400/50"
          animate={{
            borderColor: ['rgba(251, 191, 36, 0.5)', 'rgba(251, 191, 36, 1)', 'rgba(251, 191, 36, 0.5)']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      )}
    </motion.div>
  )
}

// Enhanced symbol mapping for better variety
export const ENHANCED_SYMBOLS = [
  'cherry', 'lemon', 'orange', 'grape', 'star', 'diamond', 'seven', 'bar', 'wild', 'jackpot'
]

// Professional casino color schemes
export const CASINO_THEMES = {
  classic: {
    primary: 'from-red-900 via-black to-yellow-900',
    accent: 'from-yellow-500 to-orange-500',
    text: 'text-yellow-400'
  },
  luxury: {
    primary: 'from-purple-900 via-black to-blue-900',
    accent: 'from-purple-500 to-pink-500',
    text: 'text-purple-400'
  },
  vegas: {
    primary: 'from-amber-900 via-black to-red-900',
    accent: 'from-amber-500 to-red-500',
    text: 'text-amber-400'
  }
}