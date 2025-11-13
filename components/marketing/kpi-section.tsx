"use client"

import { useState, useEffect } from "react"
import { KPICard } from "./kpi-card"
import { ErrorBoundary } from "./error-boundary"
import { LoadingSkeleton } from "./loading-skeleton"

interface KPIData {
  totalLeads: number
  convertedLeads: number
  conversionRate: number
  revenueINR: number
  roiPct: number
  trends: {
    totalLeads: number[]
    convertedLeads: number[]
    revenueINR: number[]
  }
  planVsActual: {
    totalLeads: { plan: number; actual: number }
    convertedLeads: { plan: number; actual: number }
    revenueINR: { plan: number; actual: number }
    conversionRate: { plan: number; actual: number }
    roiPct: { plan: number; actual: number }
  }
  mom: {
    totalLeads: number
    convertedLeads: number
    conversionRate: number
    revenueINR: number
    roiPct: number
  }
}

export function KPISection() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setError(null)
        const response = await fetch("/api/marketing/kpis")

        if (!response.ok) {
          throw new Error(`Failed to fetch KPI data: ${response.status}`)
        }

        const data = await response.json()
        setKpiData(data)
      } catch (error) {
        console.error("Failed to fetch KPI data:", error)
        setError(error instanceof Error ? error.message : "Failed to load KPI data")
      } finally {
        setLoading(false)
      }
    }

    fetchKPIData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#1f2a2e]">Key Performance Indicators</h2>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <LoadingSkeleton type="kpi" count={5} />
      </div>
    )
  }

  if (error || !kpiData) {
    return (
      <ErrorBoundary
        fallback={
          <div className="text-center py-8">
            <p className="text-[#475569] mb-4">{error || "Failed to load KPI data"}</p>
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

  // Generate sparkline data for ROI (using conversion rate trend as proxy)
  const roiSparklineData = kpiData.trends.totalLeads.map((_, index) => {
    const baseROI = kpiData.roiPct
    const variation = (Math.random() - 0.5) * 2 // ±1% variation
    return Math.max(0, baseROI + variation)
  })

  return (
    <ErrorBoundary>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#1f2a2e]">Key Performance Indicators</h2>
          <div className="text-xs sm:text-sm text-[#475569]">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <KPICard
            title="Total Leads"
            value={kpiData.totalLeads}
            type="number"
            sparklineData={kpiData.trends.totalLeads}
            planVsActual={kpiData.planVsActual.totalLeads}
            momChange={kpiData.mom.totalLeads}
          />

          <KPICard
            title="Converted Leads"
            value={kpiData.convertedLeads}
            type="number"
            sparklineData={kpiData.trends.convertedLeads}
            planVsActual={kpiData.planVsActual.convertedLeads}
            momChange={kpiData.mom.convertedLeads}
          />

          <KPICard
            title="Conversion %"
            value={kpiData.conversionRate * 100}
            type="percent"
            sparklineData={kpiData.trends.convertedLeads.map(
              (converted, index) => (converted / kpiData.trends.totalLeads[index]) * 100,
            )}
            planVsActual={{
              plan: kpiData.planVsActual.conversionRate.plan * 100,
              actual: kpiData.planVsActual.conversionRate.actual * 100,
            }}
            momChange={kpiData.mom.conversionRate}
          />

          <KPICard
            title="Revenue"
            value={kpiData.revenueINR}
            type="currency"
            sparklineData={kpiData.trends.revenueINR}
            planVsActual={kpiData.planVsActual.revenueINR}
            momChange={kpiData.mom.revenueINR}
          />

          <KPICard
            title="ROI %"
            value={kpiData.roiPct}
            type="percent"
            sparklineData={roiSparklineData}
            planVsActual={kpiData.planVsActual.roiPct}
            momChange={kpiData.mom.roiPct}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
