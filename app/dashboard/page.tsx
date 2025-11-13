"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/back-button"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [loginTime, setLoginTime] = useState<Date | null>(null)
  const [sessionDuration, setSessionDuration] = useState<string>("")
  const [lastLoginTime, setLastLoginTime] = useState<Date | null>(null)
  const [liveUpdates, setLiveUpdates] = useState<
    Array<{
      id: string
      message: string
      timestamp: Date
      type: "info" | "success" | "warning" | "error"
    }>
  >([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && !loginTime) {
      const storedLoginTime = localStorage.getItem("loginTime")
      const storedLastLoginTime = localStorage.getItem("lastLoginTime")

      if (storedLoginTime) {
        setLoginTime(new Date(storedLoginTime))
      } else {
        const currentTime = new Date()
        setLoginTime(currentTime)
        localStorage.setItem("loginTime", currentTime.toISOString())
      }

      if (storedLastLoginTime) {
        setLastLoginTime(new Date(storedLastLoginTime))
      }

      localStorage.setItem("lastLoginTime", new Date().toISOString())
    }
  }, [user, loginTime])

  useEffect(() => {
    if (loginTime) {
      const updateDuration = () => {
        const now = new Date()
        const diff = now.getTime() - loginTime.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        if (hours > 0) {
          setSessionDuration(`${hours}h ${minutes}m ${seconds}s`)
        } else if (minutes > 0) {
          setSessionDuration(`${minutes}m ${seconds}s`)
        } else {
          setSessionDuration(`${seconds}s`)
        }
      }

      updateDuration()
      const interval = setInterval(updateDuration, 1000)
      return () => clearInterval(interval)
    }
  }, [loginTime])

  useEffect(() => {
    const generateLiveUpdate = () => {
      const updates = [
        { message: "New lead #L2024-001 assigned to Sales Team", type: "info" as const },
        { message: "FMS Stage 2 completed for Client Booking #B2024-456", type: "success" as const },
        { message: "Doctor consultation scheduled for Patient #P789", type: "info" as const },
        { message: "Complaint #C567 requires immediate attention - SLA breach", type: "warning" as const },
        { message: "Marketing campaign ROI report generated successfully", type: "success" as const },
        { message: "Employee performance review completed for Q4", type: "success" as const },
        { message: "System backup completed at 02:00 AM", type: "success" as const },
        { message: "Payment gateway integration test failed", type: "error" as const },
        { message: "New user registration: John Doe (Sales Executive)", type: "info" as const },
        { message: "Database optimization completed - 15% performance improvement", type: "success" as const },
      ]

      const randomUpdate = updates[Math.floor(Math.random() * updates.length)]
      const newUpdate = {
        id: Date.now().toString(),
        ...randomUpdate,
        timestamp: new Date(),
      }

      setLiveUpdates((prev) => [newUpdate, ...prev.slice(0, 9)])
    }

    generateLiveUpdate()
    generateLiveUpdate()
    generateLiveUpdate()
    generateLiveUpdate()

    const interval = setInterval(generateLiveUpdate, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const quickActions = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
      color: "from-indigo-500 to-indigo-600",
      description: "Overview and analytics",
    },
    {
      name: "User Management",
      href: "/users",
      icon: "👥",
      color: "from-orange-500 to-orange-600",
      description: "Manage employees and roles",
      permission: "users.view",
    },
    {
      name: "Lead Management",
      href: "/leads",
      icon: "🎯",
      color: "from-blue-500 to-blue-600",
      description: "Track and manage leads",
      permission: "leads.view",
    },
    {
      name: "Calling Panel",
      href: "/calls",
      icon: "📞",
      color: "from-green-500 to-green-600",
      description: "Make calls and add remarks",
      permission: "calls.make",
    },
    {
      name: "Sales Conversion Report",
      href: "/reports/sales-conversion",
      icon: "📈",
      color: "from-orange-500 to-orange-600",
      description: "Advanced sales analytics and conversion tracking",
      permission: "dashboard.view",
    },
    {
      name: "FMS Systems",
      href: "/fms",
      icon: "📋",
      color: "from-purple-500 to-purple-600",
      description: "Flow Management System",
      permission: "fms.view",
    },
    {
      name: "Employee Tools",
      href: "/employee/lead-search",
      icon: "🔧",
      color: "from-emerald-500 to-emerald-600",
      description: "Employee utilities and tools",
      permission: "employee.tools",
    },
    {
      name: "Marketing Reports",
      href: "/marketing-funnel",
      icon: "📈",
      color: "from-pink-500 to-pink-600",
      description: "Marketing analytics and reports",
      permission: "marketing.view",
    },
    {
      name: "Performance",
      href: "/performance",
      icon: "📊",
      color: "from-red-500 to-red-600",
      description: "View performance metrics",
      permission: "performance.view",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "📋",
      color: "from-teal-500 to-teal-600",
      description: "Generate and view reports",
      permission: "reports.view",
    },
    {
      name: "Help Desk",
      href: "/helpdesk",
      icon: "🎧",
      color: "from-gray-500 to-gray-600",
      description: "Support and tickets",
      permission: "helpdesk.view",
    },
    {
      name: "Doctor Consultation",
      href: "/doctor-consultation",
      icon: "🩺",
      color: "from-cyan-500 to-cyan-600",
      description: "Medical consultations",
      permission: "doctor.consultation.view",
    },
  ]

  const filteredQuickActions = quickActions.filter(
    (action) =>
      !action.permission || user?.permissions.includes("all") || user?.permissions.includes(action.permission),
  )

  return (
    <div className="flex gap-8">
      <div className="flex-1 space-y-8">
        <div className="flex items-center gap-4">
          <BackButton />
        </div>

        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 lg:p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-balance">
                Welcome back, {user.name}!
              </h1>
              <div className="text-slate-200 text-sm mb-4 space-y-1">
                <div className="break-words text-xs sm:text-sm">{user.company}</div>
                <div className="break-words text-xs sm:text-sm">{user.department}</div>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span className="break-words text-xs sm:text-sm">Login: {loginTime?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span className="text-xs sm:text-sm">Session: {sessionDuration}</span>
                  </div>
                </div>
                {lastLoginTime && (
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="break-words text-xs sm:text-sm">Last Login: {lastLoginTime.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
                {user.role.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">Employee ID</CardTitle>
              <span className="text-xl sm:text-2xl">👤</span>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-slate-900 break-words">{user.employeeId}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">Company</CardTitle>
              <span className="text-xl sm:text-2xl">🏢</span>
            </CardHeader>
            <CardContent>
              <div className="text-sm sm:text-lg font-bold text-slate-900 break-words">{user.company}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">Department</CardTitle>
              <span className="text-xl sm:text-2xl">🏛️</span>
            </CardHeader>
            <CardContent>
              <div className="text-sm sm:text-lg font-bold text-slate-900 break-words">{user.department}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">Access Level</CardTitle>
              <span className="text-xl sm:text-2xl">🔐</span>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-slate-900">{user.permissions.length} Modules</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
            <CardTitle className="text-xl text-slate-800">Quick Actions</CardTitle>
            <CardDescription className="text-slate-600">
              Access your main system modules quickly - click any box to navigate to that section
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredQuickActions.map((action) => (
                <Link key={action.name} href={action.href} className="group">
                  <div
                    className={`p-4 lg:p-6 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-slate-200`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl lg:text-3xl">{action.icon}</span>
                      <div className="w-2 h-2 bg-slate-400 rounded-full group-hover:bg-slate-600 transition-colors"></div>
                    </div>
                    <h3 className="font-semibold text-base lg:text-lg mb-2 text-balance">{action.name}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 leading-relaxed text-pretty">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden xl:block w-80">
        <Card className="border-0 shadow-lg sticky top-24">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Updates
            </CardTitle>
            <CardDescription className="text-slate-600">Real-time system activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {liveUpdates.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">No recent updates</div>
              ) : (
                liveUpdates.slice(0, 4).map((update) => (
                  <div
                    key={update.id}
                    className={`p-3 border-l-4 hover:bg-gray-50 transition-colors ${
                      update.type === "success"
                        ? "border-green-500 bg-green-50/50"
                        : update.type === "warning"
                          ? "border-yellow-500 bg-yellow-50/50"
                          : update.type === "error"
                            ? "border-red-500 bg-red-50/50"
                            : "border-blue-500 bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm">
                        {update.type === "success"
                          ? "✅"
                          : update.type === "warning"
                            ? "⚠️"
                            : update.type === "error"
                              ? "❌"
                              : "ℹ️"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 break-words">{update.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{update.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
