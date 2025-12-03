import type { Socket } from 'socket.io-client'
import type { RealtimeMessage } from '../types'

class MockRealtimeSocket {
  private listeners = new Set<(message: RealtimeMessage) => void>()
  private intervalId?: ReturnType<typeof setInterval>
  // Placeholder for when a real socket connection is wired up
  private _socket: Socket | null = null

  subscribe(listener: (message: RealtimeMessage) => void): () => void {
    this.listeners.add(listener)
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.emitRandomMessage(), 7000)
    }

    if (!this._socket) {
      // In production this would become: this._socket = io(import.meta.env.VITE_SOCKET_URL)
      this._socket = null
    }

    return () => {
      this.listeners.delete(listener)
      if (this.listeners.size === 0 && this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = undefined
      }
    }
  }

  private emitRandomMessage() {
    if (this.listeners.size === 0) {
      return
    }

    const channels: RealtimeMessage['channel'][] = ['pronote', 'google', 'ai']
    const channel = channels[Math.floor(Math.random() * channels.length)]

    const payload: RealtimeMessage =
      channel === 'pronote'
        ? {
            channel,
            payload: {
              taskId: `t${Math.ceil(Math.random() * 5)}`,
              status: Math.random() > 0.5 ? 'in_progress' : 'done'
            }
          }
        : channel === 'google'
          ? {
              channel,
              payload: {
                docId: 'gdoc-123',
                content: `Auto-update ${new Date().toLocaleTimeString()}`
              }
            }
          : {
              channel,
              payload: {
                insight: {
                  id: crypto.randomUUID(),
                  title: 'New AI Recommendation',
                  summary: 'AI spotted a knowledge gap in Chemistry workbook.',
                  source: 'ai',
                  sentiment: 'neutral',
                  tags: ['chemistry', 'ai']
                }
              }
            }

    this.listeners.forEach(listener => listener(payload))
  }
}

export const mockSocket = new MockRealtimeSocket()
