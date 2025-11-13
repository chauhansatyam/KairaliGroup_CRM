"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Phone,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserCog,
  UserCheck,
  Activity,
  ChevronDown,
  ChevronRight,
  Calendar,
  AlertTriangle,
  Stethoscope,
  User,
  Database,
  TrendingUp,
  Facebook,
  Search,
  Globe,
  Instagram,
  MessageCircle,
  Mail,
  CalendarDays,
  Target,
  LineChart,
  PieChart,
  MousePointer,
  Eye,
  Share2,
  Filter,
  ShapesIcon as SalesIcon,
  Home,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, hasPermission } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fmsExpanded, setFmsExpanded] = useState(false)
  const [employeeExpanded, setEmployeeExpanded] = useState(false)
  const [marketingExpanded, setMarketingExpanded] = useState(false)
  const [doctorConsultationExpanded, setDoctorConsultationExpanded] = useState(false)
  const [salesExpanded, setSalesExpanded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh/sync operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    window.location.reload()
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
    { name: "User Management", href: "/users", icon: UserCog, permission: "users.view" },
    { name: "Lead Management", href: "/leads", icon: Users, permission: "leads.view" },
    { name: "Lead Assignment", href: "/leads/assign", icon: UserCheck, permission: "leads.view" },
    { name: "Marketing Funnel", href: "/marketing-funnel", icon: Filter, permission: "marketing.view" },
    {
      name: "Sales Conversion Report",
      href: "/reports/sales-conversion",
      icon: TrendingUp,
      permission: "reports.view",
    },
    { name: "Calling Panel", href: "/calls", icon: Phone, permission: "calls.make" },
    { name: "Performance", href: "/performance", icon: Activity, permission: "performance.view" },
    { name: "Reports", href: "/reports", icon: BarChart3, permission: "reports.view" },
    { name: "Help Desk", href: "/helpdesk", icon: Settings, permission: "helpdesk.view" },
  ]

  const fmsSubMenu = [
    { name: "FMS Overview", href: "/fms", icon: FileText },
    { name: "Client Bookings", href: "/fms/bookings", icon: Calendar },
    { name: "New Booking Sales Update", href: "/fms/bookings/team", icon: Users },
    { name: "Villa Raag Booking FMS", href: "/fms/bookings/villa-raag", icon: Home }, // Added Villa Raag Booking FMS submenu item
    { name: "Complaints (CAPA)", href: "/fms/complaints", icon: AlertTriangle },
    { name: "Doctor Consultation", href: "/fms/doctor-consultation", icon: Stethoscope },
    { name: "Riya Sharma", href: "/fms/riya-sharma", icon: User },
    { name: "V3 System", href: "/fms/v3", icon: Database },
  ]

  const employeeSubMenu = [
    { name: "Lead Search", href: "/employee/lead-search", icon: Users },
    { name: "Order Tracking", href: "/employee/order-tracking", icon: Activity },
    { name: "Booking Status Check", href: "/employee/booking-status", icon: Calendar },
    { name: "Employee Help", href: "/employee/help", icon: Settings },
  ]

  const marketingSubMenu = [
    { name: "Facebook Reports", href: "/marketing/facebook", icon: Facebook },
    { name: "Google PPC Reports", href: "/marketing/google-ppc", icon: Search },
    { name: "Bing PPC Reports", href: "/marketing/bing-ppc", icon: Globe },
    { name: "Google Webmaster Report", href: "/marketing/webmaster", icon: Eye },
    { name: "Google Analytics Report", href: "/marketing/analytics", icon: LineChart },
    { name: "Instagram Reports", href: "/marketing/instagram", icon: Instagram },
    { name: "WhatsApp Reports", href: "/marketing/whatsapp", icon: MessageCircle },
    { name: "Email Campaign Reports", href: "/marketing/email", icon: Mail },
    { name: "Event Management Report", href: "/marketing/events", icon: CalendarDays },
    { name: "SEO Performance", href: "/marketing/seo", icon: TrendingUp },
    { name: "Social Media Analytics", href: "/marketing/social", icon: Share2 },
    { name: "Conversion Tracking", href: "/marketing/conversions", icon: Target },
    { name: "ROI Analysis", href: "/marketing/roi", icon: PieChart },
    { name: "Click Analytics", href: "/marketing/clicks", icon: MousePointer },
  ]

  const doctorConsultationSubMenu = [
    { name: "Overview", href: "/doctor-consultation", icon: LayoutDashboard },
    { name: "Calendar", href: "/doctor-consultation/calendar", icon: Calendar },
    { name: "History", href: "/doctor-consultation/history", icon: Activity },
    { name: "New Prescription", href: "/doctor-consultation/prescription/new", icon: FileText },
  ]

  const salesSubMenu = [
    { name: "Sales Analytics", href: "/sales/analytics", icon: LineChart },
    { name: "Revenue Tracking", href: "/sales/revenue", icon: PieChart },
    { name: "Sales Pipeline", href: "/sales/pipeline", icon: Target },
    { name: "Performance Metrics", href: "/sales/metrics", icon: BarChart3 },
  ]

  const filteredNavigation = navigation.filter(
    (item) => user?.permissions.includes("all") || hasPermission(item.permission),
  )

  const renderNavigationItem = (item: any, isMobile = false) => {
    if (item.name === "FMS Systems") {
      return (
        <div key={item.name}>
          <button
            onClick={() => setFmsExpanded(!fmsExpanded)}
            className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              pathname.startsWith("/fms")
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className={`mr-3 h-5 w-5 ${pathname.startsWith("/fms") ? "text-white" : "text-blue-500"}`} />
            {item.name}
            {fmsExpanded ? (
              <ChevronDown
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/fms") ? "text-white" : "text-gray-500"}`}
              />
            ) : (
              <ChevronRight
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/fms") ? "text-white" : "text-gray-500"}`}
              />
            )}
          </button>
          {fmsExpanded && (
            <div className="ml-6 mt-2 space-y-1">
              {fmsSubMenu.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === subItem.href
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <subItem.icon
                    className={`mr-3 h-4 w-4 ${pathname === subItem.href ? "text-blue-600" : "text-gray-500"}`}
                  />
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (item.name === "Employee Tools") {
      return (
        <div key={item.name}>
          <button
            onClick={() => setEmployeeExpanded(!employeeExpanded)}
            className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              pathname.startsWith("/employee")
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${pathname.startsWith("/employee") ? "text-white" : "text-green-500"}`}
            />
            {item.name}
            {employeeExpanded ? (
              <ChevronDown
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/employee") ? "text-white" : "text-gray-500"}`}
              />
            ) : (
              <ChevronRight
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/employee") ? "text-white" : "text-gray-500"}`}
              />
            )}
          </button>
          {employeeExpanded && (
            <div className="ml-6 mt-2 space-y-1">
              {employeeSubMenu.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === subItem.href
                      ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-l-4 border-green-500 shadow-sm"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <subItem.icon
                    className={`mr-3 h-4 w-4 ${pathname === subItem.href ? "text-green-600" : "text-gray-500"}`}
                  />
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (item.name === "Marketing Reports") {
      return (
        <div key={item.name}>
          <button
            onClick={() => setMarketingExpanded(!marketingExpanded)}
            className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              pathname.startsWith("/marketing")
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${pathname.startsWith("/marketing") ? "text-white" : "text-purple-500"}`}
            />
            {item.name}
            {marketingExpanded ? (
              <ChevronDown
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/marketing") ? "text-white" : "text-gray-500"}`}
              />
            ) : (
              <ChevronRight
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/marketing") ? "text-white" : "text-gray-500"}`}
              />
            )}
          </button>
          {marketingExpanded && (
            <div className="ml-6 mt-2 space-y-1">
              {marketingSubMenu.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === subItem.href
                      ? "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-l-4 border-purple-500 shadow-sm"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <subItem.icon
                    className={`mr-3 h-4 w-4 ${pathname === subItem.href ? "text-purple-600" : "text-gray-500"}`}
                  />
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (item.name === "Doctor Consultation") {
      return (
        <div key={item.name}>
          <button
            onClick={() => setDoctorConsultationExpanded(!doctorConsultationExpanded)}
            className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              pathname.startsWith("/doctor-consultation")
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${pathname.startsWith("/doctor-consultation") ? "text-white" : "text-teal-500"}`}
            />
            {item.name}
            {doctorConsultationExpanded ? (
              <ChevronDown
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/doctor-consultation") ? "text-white" : "text-gray-500"}`}
              />
            ) : (
              <ChevronRight
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/doctor-consultation") ? "text-white" : "text-gray-500"}`}
              />
            )}
          </button>
          {doctorConsultationExpanded && (
            <div className="ml-6 mt-2 space-y-1">
              {doctorConsultationSubMenu.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === subItem.href
                      ? "bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border-l-4 border-teal-500 shadow-sm"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <subItem.icon
                    className={`mr-3 h-4 w-4 ${pathname === subItem.href ? "text-teal-600" : "text-gray-500"}`}
                  />
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (item.name === "Sales Management") {
      return (
        <div key={item.name}>
          <button
            onClick={() => setSalesExpanded(!salesExpanded)}
            className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              pathname.startsWith("/sales")
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className={`mr-3 h-5 w-5 ${pathname.startsWith("/sales") ? "text-white" : "text-orange-500"}`} />
            {item.name}
            {salesExpanded ? (
              <ChevronDown
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/sales") ? "text-white" : "text-gray-500"}`}
              />
            ) : (
              <ChevronRight
                className={`ml-auto h-4 w-4 ${pathname.startsWith("/sales") ? "text-white" : "text-gray-500"}`}
              />
            )}
          </button>
          {salesExpanded && (
            <div className="ml-6 mt-2 space-y-1">
              {salesSubMenu.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === subItem.href
                      ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-l-4 border-orange-500 shadow-sm"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <subItem.icon
                    className={`mr-3 h-4 w-4 ${pathname === subItem.href ? "text-orange-600" : "text-gray-500"}`}
                  />
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          pathname === item.href
            ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
        }`}
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <item.icon className={`mr-3 h-5 w-5 ${pathname === item.href ? "text-white" : getIconColor(item.name)}`} />
        {item.name}
      </Link>
    )
  }

  const getIconColor = (itemName: string) => {
    const colorMap: { [key: string]: string } = {
      Dashboard: "text-indigo-500",
      "User Management": "text-orange-500",
      "Lead Management": "text-blue-500",
      "Lead Assignment": "text-green-500",
      "Marketing Funnel": "text-purple-500",
      "Sales Conversion Report": "text-orange-500",
      "Calling Panel": "text-green-500",
      Performance: "text-red-500",
      Reports: "text-purple-500",
      "Help Desk": "text-gray-500",
      "Sales Management": "text-orange-500",
    }
    return colorMap[itemName] || "text-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
            <h1 className="text-xl font-bold text-white">Kairali Group</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
            {filteredNavigation.map((item) => renderNavigationItem(item, true))}
            {hasPermission("fms.view") && renderNavigationItem({ name: "FMS Systems", icon: FileText }, true)}
            {hasPermission("employee.tools") && renderNavigationItem({ name: "Employee Tools", icon: UserCheck }, true)}
            {hasPermission("marketing.view") &&
              renderNavigationItem({ name: "Marketing Reports", icon: TrendingUp }, true)}
            {hasPermission("doctor.consultation.view") &&
              renderNavigationItem({ name: "Doctor Consultation", icon: Stethoscope }, true)}
            {hasPermission("dashboard.view") &&
              renderNavigationItem({ name: "Sales Management", icon: SalesIcon }, true)}
          </nav>
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.replace("_", " ")}</p>
                <p className="text-xs text-gray-400">{user?.employeeId}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-red-50 hover:text-red-600">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64">
        <div className="flex h-full flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg">
          <div className="flex h-16 items-center px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Kairali Group</h1>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
            {filteredNavigation.map((item) => renderNavigationItem(item))}
            {hasPermission("fms.view") && renderNavigationItem({ name: "FMS Systems", icon: FileText })}
            {hasPermission("employee.tools") && renderNavigationItem({ name: "Employee Tools", icon: UserCheck })}
            {hasPermission("marketing.view") && renderNavigationItem({ name: "Marketing Reports", icon: TrendingUp })}
            {hasPermission("doctor.consultation.view") &&
              renderNavigationItem({ name: "Doctor Consultation", icon: Stethoscope })}
            {hasPermission("dashboard.view") && renderNavigationItem({ name: "Sales Management", icon: SalesIcon })}
          </nav>
          <div className="p-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.replace("_", " ")}</p>
                <p className="text-xs text-gray-400">{user?.employeeId}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-red-50 hover:text-red-600">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">{user?.company} Management System</h2>
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search modules, reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 bg-transparent"
              >
                <div className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}>🔄</div>
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user ? getUserInitials(user.name) : "U"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role.replace("_", " ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
