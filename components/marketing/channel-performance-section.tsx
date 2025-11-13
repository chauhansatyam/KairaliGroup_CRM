"use client"

import { useState, useEffect } from "react"
import { ChannelCard } from "./channel-card"
import { ChannelDrawer } from "./channel-drawer"
import { ErrorBoundary } from "./error-boundary"
import { LoadingSkeleton } from "./loading-skeleton"

interface ChannelMetrics {
  leads: { plan: number; actual: number; deltaPct: number }
  converted: { plan: number; actual: number; deltaPct: number }
  conversionRate: { plan: number; actual: number; deltaPct: number }
  revenueINR: { plan: number; actual: number; deltaPct: number }
  roiPct: { plan: number; actual: number; deltaPct: number }
}

interface ChannelData {
  id: string
  label: string
  metrics: ChannelMetrics
  trend12mo: number[]
}

export function ChannelPerformanceSection() {
  const [channelsData, setChannelsData] = useState<ChannelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<ChannelData | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchChannelsData = async () => {
      try {
        setError(null)
        const response = await fetch("/api/marketing/channels")

        if (!response.ok) {
          throw new Error(`Failed to fetch channels data: ${response.status}`)
        }

        const data = await response.json()
        setChannelsData(data)
      } catch (error) {
        console.error("Failed to fetch channels data:", error)
        setError(error instanceof Error ? error.message : "Failed to load channels data")
      } finally {
        setLoading(false)
      }
    }

    fetchChannelsData()
  }, [])

  const handleChannelClick = (channel: ChannelData) => {
    setSelectedChannel(channel)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setSelectedChannel(null)
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#1f2a2e]">Channel Performance Analysis</h2>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <LoadingSkeleton type="channel" count={12} />
      </div>
    )
  }

  if (error || channelsData.length === 0) {
    return (
      <ErrorBoundary
        fallback={
          <div className="text-center py-8">
            <p className="text-[#475569] mb-4">{error || "No channel data available"}</p>
            <button onClick={() => window.location.reload()} className="text-[#2f6b4f] hover:underline">
              Try again
            </button>
          </div>
        }
      >
        <div />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#1f2a2e]">Channel Performance Analysis</h2>
          <div className="text-xs sm:text-sm text-[#475569]">Click any channel for detailed 12-month view</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {channelsData.map((channel) => (
            <ChannelCard
              key={channel.id}
              id={channel.id}
              label={channel.label}
              metrics={channel.metrics}
              trend12mo={channel.trend12mo}
              onClick={() => handleChannelClick(channel)}
            />
          ))}
        </div>

        <ChannelDrawer isOpen={drawerOpen} onClose={handleDrawerClose} channelData={selectedChannel} />
      </div>
    </ErrorBoundary>
  )
}
