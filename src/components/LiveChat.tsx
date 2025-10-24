'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Clock,
  User,
  Bot,
  HelpCircle,
  AlertCircle,
  Coins,
  Settings,
  Star
} from 'lucide-react'

interface LiveChatProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent' | 'bot'
  timestamp: Date
  type?: 'text' | 'quick-reply' | 'system'
  agentName?: string
}

interface QuickReply {
  id: string
  text: string
  response: string
}

const QUICK_REPLIES: QuickReply[] = [
  { id: '1', text: 'Account Issues', response: 'I need help with my account' },
  { id: '2', text: 'Payment Problems', response: 'I have a payment or coin issue' },
  { id: '3', text: 'Game Questions', response: 'I have questions about games' },
  { id: '4', text: 'VIP Support', response: 'I need VIP customer support' },
  { id: '5', text: 'Bug Report', response: 'I want to report a bug' },
  { id: '6', text: 'General Help', response: 'I need general assistance' }
]

const BOT_RESPONSES = {
  'account': [
    "I can help you with account-related issues! Are you having trouble with:",
    "• Login problems",
    "• Profile settings",
    "• Account verification",
    "• Password reset",
    "",
    "Please describe your specific issue, or I can connect you with a live agent."
  ].join('\n'),
  'payment': [
    "I understand you're having payment or coin issues. Common solutions:",
    "• Check your transaction history in your profile",
    "• Verify your payment method is valid",
    "• Try refreshing the page",
    "• Clear your browser cache",
    "",
    "If the issue persists, I'll connect you with our billing specialist."
  ].join('\n'),
  'games': [
    "I'm here to help with game questions! I can assist with:",
    "• Game rules and payouts",
    "• Bonus rounds and features",
    "• Progressive jackpots",
    "• Technical game issues",
    "",
    "What specific game or feature would you like help with?"
  ].join('\n'),
  'vip': [
    "Welcome, valued VIP member! 🌟",
    "Our VIP support team provides:",
    "• Priority customer service",
    "• Exclusive bonuses and promotions",
    "• Personal account manager",
    "• Faster withdrawals",
    "",
    "Connecting you with our VIP specialist now..."
  ].join('\n'),
  'bug': [
    "Thank you for reporting a bug! This helps us improve the experience.",
    "Please provide:",
    "• Description of the issue",
    "• What you were doing when it occurred",
    "• Your device/browser information",
    "• Screenshots if possible",
    "",
    "Our technical team will investigate promptly."
  ].join('\n'),
  'general': [
    "I'm here to help! Common questions I can answer:",
    "• How to play our games",
    "• Understanding bonuses and promotions",
    "• Account management",
    "• VIP program benefits",
    "",
    "What would you like assistance with today?"
  ].join('\n')
}

export default function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [agentName, setAgentName] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize chat with welcome message
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: `Welcome to Wreckless Racks Casino Support, ${user?.firstName || 'Player'}! 🎰\n\nI'm your AI assistant. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, user, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text: string, isQuickReply = false) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setShowQuickReplies(false)
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      let botResponse = ''

      if (text.toLowerCase().includes('account')) {
        botResponse = BOT_RESPONSES.account
      } else if (text.toLowerCase().includes('payment') || text.toLowerCase().includes('coin')) {
        botResponse = BOT_RESPONSES.payment
      } else if (text.toLowerCase().includes('game')) {
        botResponse = BOT_RESPONSES.games
      } else if (text.toLowerCase().includes('vip')) {
        botResponse = BOT_RESPONSES.vip
      } else if (text.toLowerCase().includes('bug')) {
        botResponse = BOT_RESPONSES.bug
      } else if (text.toLowerCase().includes('help')) {
        botResponse = BOT_RESPONSES.general
      } else {
        botResponse = "I understand you need assistance. Let me connect you with one of our support specialists who can help you better. Please hold on for a moment..."

        // Simulate agent connection
        setTimeout(() => {
          setIsConnected(true)
          setAgentName('Sarah M.')
          const agentMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `Hi ${user?.firstName || 'there'}! I'm Sarah, your customer support specialist. I've reviewed your inquiry and I'm here to help. How can I assist you today? 😊`,
            sender: 'agent',
            agentName: 'Sarah M.',
            timestamp: new Date(),
            type: 'text'
          }
          setMessages(prev => [...prev, agentMessage])
        }, 3000)
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.response, true)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            height: isMinimized ? 'auto' : '600px'
          }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col w-80 max-h-[600px] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} />
              <div>
                <h3 className="font-bold text-sm">Live Support</h3>
                <div className="flex items-center gap-1 text-xs">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  {isConnected ? `Agent: ${agentName}` : 'AI Assistant'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 p-1 rounded"
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-lg rounded-br-sm'
                        : 'bg-white border rounded-lg rounded-bl-sm'
                    } p-3 shadow-sm`}>
                      {message.sender !== 'user' && (
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'bot' ? (
                            <Bot size={14} className="text-purple-600" />
                          ) : (
                            <User size={14} className="text-blue-600" />
                          )}
                          <span className="text-xs font-semibold text-gray-600">
                            {message.sender === 'bot' ? 'AI Assistant' : message.agentName}
                          </span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg rounded-bl-sm p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Bot size={14} className="text-purple-600" />
                        <span className="text-xs font-semibold text-gray-600">
                          {isConnected ? agentName : 'AI Assistant'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {showQuickReplies && (
                <div className="p-3 bg-white border-t">
                  <p className="text-xs text-gray-600 mb-2">Quick Help Topics:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs p-2 bg-gray-100 hover:bg-purple-100 border rounded-lg transition-colors text-left"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => sendMessage(inputText)}
                    disabled={!inputText.trim()}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Typical response time: {isConnected ? 'Under 1 minute' : 'Instant'}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}