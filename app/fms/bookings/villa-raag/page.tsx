"use client"

import { useState, useRef, useEffect } from "react"
import { useActiveVillaBookings } from "@/hooks/use-active-bookings";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BackButton } from "@/components/back-button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  Upload,
  XCircle,
  Home,
  Sparkles,
  CalendarDays,
  BarChart3,
  Building2,
  Globe,
  PauseCircle,
} from "lucide-react"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Booking {
  id: string
  bookingId: string
  guestName: string
  checkIn: string
  checkOut: string
  villaType: string
  villaNumber: string
  roomName: string // Added room name field
  plan: string // Added plan field (EP, CP, MAP)
  amount: number
  receivedAmount: number
  approvedTillDate: string
  status: "confirmed" | "pending" | "cancelled" | "payment_pending" | "auto_release"
  assignedTo: string
  team: "sales" | "accounts"
  createdDate: string
  lastUpdated: string
  source: string
  paymentStatus: string
  salesTeamStatus: "pending" | "in_progress" | "completed" | "on_hold"
  accountsVerifyStatus: "payment_verified" | "approval_verified" | "booking_cancelled" | "pending" | "under_review"
  frontOfficeStatus: "pms_verified_done" | "booking_cancelled" | "pending" | "processing"
  paymentSettlementStatus: "full_payment_received" | "booking_cancelled" | "partial_payment" | "pending"
  mobile?: string
  email?: string
  receivedPercentage?: number
  salesperson?: string
  contactNumber?: string
  totalAmount?: string
  paidAmount?: string
}
/* sample data for testing
const sampleBookings: Booking[] = [
  {
    id: "1",
    bookingId: "VR2024001",
    guestName: "MR. RAJESH KUMAR",
    checkIn: "2024-02-15",
    checkOut: "2024-02-20",
    villaType: "Premium Villa",
    villaNumber: "PV-201",
    roomName: "Serenity Suite",
    plan: "MAP",
    amount: 185000,
    receivedAmount: 185000,
    approvedTillDate: "2024-02-14",
    status: "confirmed",
    assignedTo: "Pawan Kamra",
    team: "sales",
    createdDate: "2024-02-10",
    lastUpdated: "2024-02-12",
    source: "Website Booking",
    paymentStatus: "paid",
    salesTeamStatus: "completed",
    accountsVerifyStatus: "payment_verified",
    frontOfficeStatus: "pms_verified_done",
    paymentSettlementStatus: "full_payment_received",
    mobile: "9876543210",
    email: "rajesh@example.com",
    receivedPercentage: 100,
    salesperson: "Pawan Kamra",
    contactNumber: "9876543210",
    totalAmount: "185000",
    paidAmount: "185000",
  },
  {
    id: "2",
    bookingId: "VR2024002",
    guestName: "MS. PRIYA SHARMA",
    checkIn: "2024-02-18",
    checkOut: "2024-02-23",
    villaType: "Luxury Villa",
    villaNumber: "LV-105",
    roomName: "Harmony Haven",
    plan: "CP",
    amount: 225000,
    receivedAmount: 112500,
    approvedTillDate: "2024-02-17",
    status: "payment_pending",
    assignedTo: "Puneet Endlay",
    team: "sales",
    createdDate: "2024-02-12",
    lastUpdated: "2024-02-14",
    source: "Direct Booking",
    paymentStatus: "partial",
    salesTeamStatus: "in_progress",
    accountsVerifyStatus: "under_review",
    frontOfficeStatus: "processing",
    paymentSettlementStatus: "partial_payment",
    mobile: "9123456789",
    email: "priya@example.com",
    receivedPercentage: 50,
    salesperson: "Puneet Endlay",
    contactNumber: "9123456789",
    totalAmount: "225000",
    paidAmount: "112500",
  },
  {
    id: "3",
    bookingId: "VR2024003",
    guestName: "MR. AMIT PATEL",
    checkIn: "2024-02-20",
    checkOut: "2024-02-25",
    villaType: "Deluxe Villa",
    villaNumber: "DV-301",
    roomName: "Serenity Suite",
    plan: "EP",
    amount: 165000,
    receivedAmount: 165000,
    approvedTillDate: "2024-02-19",
    status: "confirmed",
    assignedTo: "Sadik Rehman",
    team: "sales",
    createdDate: "2024-02-15",
    lastUpdated: "2024-02-17",
    source: "Travel Agent",
    paymentStatus: "paid",
    salesTeamStatus: "completed",
    accountsVerifyStatus: "payment_verified",
    frontOfficeStatus: "pms_verified_done",
    paymentSettlementStatus: "full_payment_received",
    mobile: "9988776655",
    email: "amit@example.com",
    receivedPercentage: 100,
    salesperson: "Sadik Rehman",
    contactNumber: "9988776655",
    totalAmount: "165000",
    paidAmount: "165000",
  },
]
*/

export default function VillaRaagBookingPage() {
  //const [bookings, setBookings] = useState<Booking[]>(sampleBookings)
   const tableRef = useRef<HTMLDivElement | null>(null)
  const { bookings, loading, error } = useActiveVillaBookings();
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [teamFilter, setTeamFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
  const [sortField, setSortField] = useState<keyof Booking>("createdDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string>("")
  const [cancelReason, setCancelReason] = useState<string>("")
  const [cancelRemarks, setCancelRemarks] = useState<string>("")

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null)
  const [paymentData, setPaymentData] = useState({
    receivedAmount: "",
    currency: "INR",
    paymentMode: "",
    receivedDate: "",
    receiptNumber: "",
    screenshot: null as File | null,
    paymentLocation: "",
    paymentCollectedBy: "",
  })

  const [viewMode, setViewMode] = useState<"table" | "chart">("table")

  // Pagination for Active Villa Bookings
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  // Debounce searchTerm to avoid re-filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 300)
    return () => clearTimeout(t)
  }, [searchTerm])

  const filterByDate = (booking: Booking) => {
    if (dateFilter === "all") return true

    // Use checkIn date for date-based filters (more relevant for bookings)
    const bookingDate = booking.checkIn ? new Date(booking.checkIn) : new Date(booking.createdDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (dateFilter) {
      case "today":
        return bookingDate.toDateString() === today.toDateString()
      case "yesterday":
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return bookingDate.toDateString() === yesterday.toDateString()
      case "custom":
        if (!customDateRange.start || !customDateRange.end) return true
        const start = new Date(customDateRange.start)
        const end = new Date(customDateRange.end)
        return bookingDate >= start && bookingDate <= end
      default:
        return true
    }
  }

  // Filter and sort logic
  const filteredBookings = bookings
    .filter((booking) => {
      const q = (debouncedSearchTerm ?? "").toLowerCase()
      const guest = (booking.guestName ?? "").toLowerCase()
      const bid = (booking.bookingId ?? "").toLowerCase()
      const assigned = (booking.assignedTo ?? "").toLowerCase()

      const matchesSearch = q === "" || guest.includes(q) || bid.includes(q) || assigned.includes(q)
      const matchesStatus = statusFilter === "all" || (booking.status ?? "").toString() === statusFilter
      const matchesTeam = teamFilter === "all" || (booking.team ?? "").toString() === teamFilter
      const matchesDate = filterByDate(booking)
      const matchesSource = sourceFilter === "all" || (booking.source ?? "").toString() === sourceFilter
      return matchesSearch && matchesStatus && matchesTeam && matchesDate && matchesSource
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  // Total Bookings = Online Bookings + OTA Bookings + Travel Agents
  const onlineBookingEngine = filteredBookings.filter((b) => b.source === "Online Booking Engine").length
  const otaBookings = filteredBookings.filter((b) => b.source === "OTA").length
  const travelAgents = filteredBookings.filter((b) => b.source === "Travel Agent").length

  // Show total bookings across all records regardless of status or current filters
  const totalBookings = bookings.length

  // Total Bookings = Confirmed + Hold + Cancelled
  // Confirmed is a straightforward status match
  const confirmedBookings = filteredBookings.filter((b) => (b.status ?? "").toString().toLowerCase() === "confirmed").length

  // Hold: some records may use variations like 'on_hold', 'hold' or other conventions
  const holdBookings = filteredBookings.filter((b) => {
    const s = (b.salesTeamStatus ?? "").toString().toLowerCase()
    return s === "on_hold" || s === "hold" || s.includes("hold")
  }).length

  // Cancelled: bookings may be marked cancelled in different fields (status, accountsVerifyStatus, frontOfficeStatus, paymentSettlementStatus)
  const cancelledBookings = filteredBookings.filter((b) => {
    const status = (b.status ?? "").toString().toLowerCase()
    const accounts = (b.accountsVerifyStatus ?? "").toString().toLowerCase()
    const front = (b.frontOfficeStatus ?? "").toString().toLowerCase()
    const payment = (b.paymentSettlementStatus ?? "").toString().toLowerCase()

    return (
      status === "cancelled" ||
      accounts.includes("cancel") ||
      front.includes("cancel") ||
      payment.includes("cancel")
    )
  }).length

  const pendingBookings = filteredBookings.filter((b) => b.status === "pending").length
  const totalAmount = filteredBookings.reduce((sum, booking) => sum + booking.amount, 0)
  const totalReceived = filteredBookings.reduce((sum, booking) => sum + booking.receivedAmount, 0)
  
  // Calculate cancelled bookings amount - from filtered bookings
  const cancelledAmount = filteredBookings.reduce((sum, booking) => {
    const status = (booking.status ?? "").toString().toLowerCase()
    const accounts = (booking.accountsVerifyStatus ?? "").toString().toLowerCase()
    const front = (booking.frontOfficeStatus ?? "").toString().toLowerCase()
    const payment = (booking.paymentSettlementStatus ?? "").toString().toLowerCase()

    const isCancelled = (
      status === "canceled" ||
      status === "cancelled" ||
      accounts.includes("cancel") ||
      front.includes("cancel") ||
      payment.includes("cancel")
    )
    
    return isCancelled ? sum + booking.amount : sum
  }, 0)

  // Debug log to verify cancelled amount calculation
  if (cancelledAmount > 0) {
    console.log("Cancelled bookings found - Total cancelled amount: ₹" + cancelledAmount.toLocaleString())
    console.log("Cancelled bookings count:", cancelledBookings)
  }

  const chartData = [
    { name: "Total", value: totalBookings, color: "#1e40af" },
    { name: "Confirmed", value: confirmedBookings, color: "#059669" },
    { name: "Hold", value: holdBookings, color: "#d97706" },
    { name: "Cancelled", value: cancelledBookings, color: "#dc2626" },
    { name: "Online", value: onlineBookingEngine, color: "#0891b2" },
    { name: "OTA", value: otaBookings, color: "#7c3aed" },
    { name: "Travel Agent", value: travelAgents, color: "#ea580c" },
  ]

  const revenueChartData = [
    { name: "Total Revenue", amount: totalAmount, color: "#1e40af" },
    { name: "Amount Received", amount: totalReceived, color: "#059669" },
    { name: "Pending Amount", amount: totalAmount - totalReceived, color: "#d97706" },
  ]

  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setStatusFilter("all")
    setTeamFilter("all")
    setDateFilter("all")
    setSourceFilter("all")
    setCustomDateRange({ start: "", end: "" })
    setCurrentPage(1)
  }

  const SortIcon = ({ field }: { field: keyof Booking }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-gray-400" />
    return sortDirection === "asc" ? (
      <TrendingUp className="h-3 w-3 text-purple-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-purple-600" />
    )
  }

  const handleAction = (action: string, bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    switch (action) {
      case "cancel":
        setSelectedBookingId(bookingId)
        setShowCancelModal(true)
        break
      case "payment_upload":
        setSelectedBookingForPayment(booking)
        setShowPaymentModal(true)
        break
      default:
        console.log(`Action ${action} for booking ${bookingId}`)
    }
  }

  const handleCancelBooking = () => {
    if (!cancelReason.trim()) return

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === selectedBookingId
          ? { ...booking, status: "cancelled" as const, lastUpdated: new Date().toISOString() }
          : booking,
      ),
    )

    setShowCancelModal(false)
    setCancelReason("")
    setCancelRemarks("")
    setSelectedBookingId("")
  }

  const handlePaymentSubmit = () => {
    if (
      !paymentData.receivedAmount ||
      !paymentData.paymentMode ||
      !paymentData.receivedDate ||
      !paymentData.receiptNumber
    ) {
      return
    }

    if (selectedBookingForPayment) {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBookingForPayment.id
            ? {
                ...booking,
                receivedAmount: booking.receivedAmount + Number.parseFloat(paymentData.receivedAmount),
                paymentStatus: "paid",
                lastUpdated: new Date().toISOString(),
              }
            : booking,
        ),
      )
    }

    setShowPaymentModal(false)
    setSelectedBookingForPayment(null)
    setPaymentData({
      receivedAmount: "",
      currency: "INR",
      paymentMode: "",
      receivedDate: "",
      receiptNumber: "",
      screenshot: null,
      paymentLocation: "",
      paymentCollectedBy: "",
    })
  }

  const getReceivedPercentage = (received: number, total: number) => {
    return Math.round((received / total) * 100)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "payment_pending":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const renderStatusBadge = (status: string, type: string) => {
    const getStatusColor = (status: string, type: string) => {
      switch (type) {
        case "sales":
          switch (status) {
            case "completed":
              return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "in_progress":
              return "bg-purple-100 text-purple-800 border-purple-200"
            case "on_hold":
              return "bg-amber-100 text-amber-800 border-amber-200"
            default:
              return "bg-slate-100 text-slate-800 border-slate-200"
          }
        case "accounts":
          switch (status) {
            case "payment_verified":
              return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "approval_verified":
              return "bg-teal-100 text-teal-800 border-teal-200"
            case "booking_cancelled":
              return "bg-red-100 text-red-800 border-red-200"
            case "under_review":
              return "bg-purple-100 text-purple-800 border-purple-200"
            default:
              return "bg-slate-100 text-slate-800 border-slate-200"
          }
        case "frontoffice":
          switch (status) {
            case "pms_verified_done":
              return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "booking_cancelled":
              return "bg-red-100 text-red-800 border-red-200"
            case "processing":
              return "bg-purple-100 text-purple-800 border-purple-200"
            default:
              return "bg-slate-100 text-slate-800 border-slate-200"
          }
        case "payment":
          switch (status) {
            case "full_payment_received":
              return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "partial_payment":
              return "bg-amber-100 text-amber-800 border-amber-200"
            case "booking_cancelled":
              return "bg-red-100 text-red-800 border-red-200"
            default:
              return "bg-slate-100 text-slate-800 border-slate-200"
          }
        default:
          return "bg-slate-100 text-slate-800 border-slate-200"
      }
    }

    const formatStatus = (status: string) => {
      if (!status) return "Unknown"
      return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status, type)}`}
      >
        {formatStatus(status)}
      </span>
    )
  }

  const activeBookings = filteredBookings.filter(
    (booking) => booking.status !== "cancelled" && booking.salesTeamStatus !== "on_hold",
  )

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, teamFilter, dateFilter, filteredBookings.length])

  // Paginate active bookings
  const totalPages = Math.max(1, Math.ceil(activeBookings.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedBookings = activeBookings.slice(startIndex, startIndex + itemsPerPage)

  // When the user searches or applies filters, if there are results scroll the Active Bookings section into view.
  // Watch search term and filters; debounce the scroll by 300ms to avoid jumping while typing.
  useEffect(() => {
    const hasActiveFilter =
      (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") || statusFilter !== "all" || teamFilter !== "all" || dateFilter !== "all"

    if (!hasActiveFilter) return

    if (filteredBookings.length === 0) return

    const t = setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 300)

    return () => clearTimeout(t)
  }, [debouncedSearchTerm, statusFilter, teamFilter, dateFilter, filteredBookings.length])

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-blue-600 font-semibold text-lg">Loading Villa Raag Bookings...</p>
            <p className="text-slate-500 text-sm">Fetching booking data from server</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if data fetch failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-red-200">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Bookings</h2>
            <p className="text-slate-600 mb-4">{error || "Failed to load villa bookings. Please try again."}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 border-b border-blue-400 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BackButton className="mb-4" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                  <Home className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                    Villa Raag Booking FMS
                    <Sparkles className="h-9 w-9 text-yellow-300 animate-pulse" />
                  </h1>
                  <p className="text-lg text-blue-50 mt-2 font-medium">
                    Premium Villa Management • Real-time Analytics
                  </p>
                </div>
              </div>

 
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-sm text-blue-100 font-medium">Last Updated</p>
                <p className="text-sm font-bold text-white">{new Date().toLocaleString()}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/40 hover:bg-white/20 bg-white/10 text-white backdrop-blur-sm font-semibold shadow-lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Removed FMSSidebar and its container */}
        <div className="space-y-8">
          <div>
            <Card className="bg-white/90 backdrop-blur-sm border-blue-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-100 via-white to-indigo-100 border-b border-blue-200">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <div className="p-2.5 bg-white rounded-lg shadow-md border border-blue-200">
                  <Filter className="h-5 w-5 text-blue-700" />
                </div>
                Filters & Search
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters} className="border-slate-200">
                    Clear Filters
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-700" />
                    Search Bookings
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                    <Input
                      placeholder="Search by guest name, booking ID, salesperson..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-700" />
                    Date Filter
                  </Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-white shadow-sm">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-700" />
                    Status Filter
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-white shadow-sm">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">✓ Confirmed</SelectItem>
                      <SelectItem value="pending">⏳ Pending</SelectItem>
                      <SelectItem value="hold">⏸ Hold</SelectItem>
                      <SelectItem value="canceled">✕ Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-700" />
                    Team Filter
                  </Label>
                  <Select value={teamFilter} onValueChange={setTeamFilter}>
                    <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-white shadow-sm">
                      <SelectValue placeholder="Filter by team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teams</SelectItem>
                      <SelectItem value="sales">Sales Team</SelectItem>
                      <SelectItem value="accounts">Accounts Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-700" />
                    Booking Source
                  </Label>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-white shadow-sm">
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Total Bookings</SelectItem>
                      <SelectItem value="Direct Booking">Offline Booking</SelectItem>
                      <SelectItem value="Online Booking Engine">Online Booking</SelectItem>
                      <SelectItem value="OTA">OTA Booking</SelectItem>
                      <SelectItem value="Travel Agent">Travel Agents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {dateFilter === "custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-900">Start Date</Label>
                    <Input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-900">End Date</Label>
                    <Input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-white shadow-sm"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            </Card>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-slate-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-100 via-white to-blue-100 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                  <div className="p-2.5 bg-white rounded-lg shadow-md border border-slate-200">
                    <BarChart3 className="h-5 w-5 text-blue-700" />
                  </div>
                  Key Performance Indicators
                </CardTitle>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "chart")} className="w-auto">
                  <TabsList className="bg-white border border-slate-300 shadow-sm">
                    <TabsTrigger
                      value="table"
                      className="data-[state=active]:bg-blue-700 data-[state=active]:text-white font-semibold"
                    >
                      Table View
                    </TabsTrigger>
                    <TabsTrigger
                      value="chart"
                      className="data-[state=active]:bg-blue-700 data-[state=active]:text-white font-semibold"
                    >
                      Chart View
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {viewMode === "table" ? (
                <div className="space-y-6">
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Booking Sources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      <Card className="bg-white border-blue-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                Total Bookings
                              </p>
                              <p className="text-2xl font-bold text-slate-900">{totalBookings}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded-full">
                                  <TrendingUp className="h-3 w-3 text-blue-700" />
                                  <span className="text-xs font-semibold text-blue-700">+12%</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
                              <Calendar className="h-6 w-6 text-blue-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-slate-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                                Offline Booking
                              </p>
                              <p className="text-2xl font-bold text-slate-900">
                                {filteredBookings.filter((b) => b.source === "Direct Booking").length}
                              </p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full">
                                  <Building2 className="h-3 w-3 text-slate-700" />
                                  <span className="text-xs font-semibold text-slate-700">Direct</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0 ml-2">
                              <Building2 className="h-6 w-6 text-slate-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-cyan-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                                Online Engine
                              </p>
                              <p className="text-2xl font-bold text-slate-900">{onlineBookingEngine}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-cyan-100 rounded-full">
                                  <Globe className="h-3 w-3 text-cyan-700" />
                                  <span className="text-xs font-semibold text-cyan-700">Web</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-cyan-100 rounded-lg flex-shrink-0 ml-2">
                              <Globe className="h-6 w-6 text-cyan-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-purple-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                                OTA Bookings
                              </p>
                              <p className="text-2xl font-bold text-slate-900">{otaBookings}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded-full">
                                  <Building2 className="h-3 w-3 text-purple-700" />
                                  <span className="text-xs font-semibold text-purple-700">Platform</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0 ml-2">
                              <Building2 className="h-6 w-6 text-purple-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-orange-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                                Travel Agents
                              </p>
                              <p className="text-2xl font-bold text-slate-900">{travelAgents}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 rounded-full">
                                  <Building2 className="h-3 w-3 text-orange-700" />
                                  <span className="text-xs font-semibold text-orange-700">Partner</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0 ml-2">
                              <Building2 className="h-6 w-6 text-orange-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Booking Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-white border-blue-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                Total Bookings
                              </p>
                              <p className="text-2xl font-bold text-slate-900">{totalBookings}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded-full">
                                  <TrendingUp className="h-3 w-3 text-blue-700" />
                                  <span className="text-xs font-semibold text-blue-700">+12%</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
                              <Calendar className="h-6 w-6 text-blue-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-emerald-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                Confirmed
                              </p>
                              <p className="text-2xl font-bold text-slate-900">{confirmedBookings}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full">
                                  <CheckCircle className="h-3 w-3 text-emerald-700" />
                                  <span className="text-xs font-semibold text-emerald-700">Active</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0 ml-2">
                              <CheckCircle className="h-6 w-6 text-emerald-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-amber-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Hold</p>
                              <p className="text-2xl font-bold text-slate-900">{holdBookings}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 rounded-full">
                                  <PauseCircle className="h-3 w-3 text-amber-700" />
                                  <span className="text-xs font-semibold text-amber-700">On Hold</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0 ml-2">
                              <PauseCircle className="h-6 w-6 text-amber-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-red-300 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Cancelled</p>
                              <p className="text-2xl font-bold text-slate-900">{cancelledBookings}</p>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 rounded-full">
                                  <TrendingDown className="h-3 w-3 text-red-700" />
                                  <span className="text-xs font-semibold text-red-700">-5%</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-red-100 rounded-lg flex-shrink-0 ml-2">
                              <XCircle className="h-6 w-6 text-red-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-200 shadow-md">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-700" />
                        Bookings Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" stroke="#1e40af" />
                          <YAxis stroke="#1e40af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-200 shadow-md">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-700" />
                        Revenue Analysis
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" stroke="#059669" />
                          <YAxis stroke="#059669" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => `₹${value.toLocaleString()}`}
                          />
                          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                            {revenueChartData.map((entry, index) => (
                              <Bar key={`bar-${index}`} dataKey="amount" fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-md">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-700" />
                      Performance Trends
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#1e40af" />
                        <YAxis stroke="#1e40af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#1e40af"
                          strokeWidth={3}
                          dot={{ fill: "#1e40af", r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="bg-gradient-to-br from-indigo-700 to-indigo-800 text-white border-indigo-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium uppercase tracking-wide truncate opacity-90">
                      Total Revenue
                    </p>
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-white/20 rounded-full">
                        <TrendingUp className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                        <span className="text-xs font-semibold">+10%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 bg-white/20 rounded-xl flex-shrink-0 ml-2">
                    <DollarSign className="h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-700 to-emerald-800 text-white border-emerald-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium uppercase tracking-wide truncate opacity-90">
                      Amount Received
                    </p>
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold">₹{totalReceived.toLocaleString()}</p>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-white/20 rounded-full">
                        <TrendingUp className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                        <span className="text-xs font-semibold">+5%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 bg-white/20 rounded-xl flex-shrink-0 ml-2">
                    <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-700 to-amber-800 text-white border-amber-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium uppercase tracking-wide truncate opacity-90">
                      Pending Amount
                    </p>
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold">
                      ₹{(totalAmount - totalReceived - cancelledAmount).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-white/20 rounded-full">
                        <Clock className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                        <span className="text-xs font-semibold">Due</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 bg-white/20 rounded-xl flex-shrink-0 ml-2">
                    <Clock className="h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-700 to-red-800 text-white border-red-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium uppercase tracking-wide truncate opacity-90">
                      Cancelled Amount
                    </p>
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold">₹{cancelledAmount.toLocaleString()}</p>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-white/20 rounded-full">
                        <TrendingDown className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                        <span className="text-xs font-semibold">-Lost</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 bg-white/20 rounded-xl flex-shrink-0 ml-2">
                    <XCircle className="h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div ref={tableRef}>
            <Card className="bg-white/90 backdrop-blur-sm border-blue-300 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-100 via-white to-indigo-100 border-b border-blue-300">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <div className="p-2.5 bg-white rounded-lg shadow-md border border-blue-200">
                  <CheckCircle className="h-5 w-5 text-blue-700" />
                </div>
                Active Villa Bookings
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-200 text-blue-900 font-semibold border border-blue-300"
                >
                  {activeBookings.length} Records
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-blue-100 to-indigo-100">
                    <TableRow className="border-blue-300">
                      <TableHead
                        className="cursor-pointer font-bold text-slate-900 hover:text-blue-700 transition-colors"
                        onClick={() => handleSort("createdDate")}
                      >
                        <div className="flex items-center gap-2">
                          Booking Date
                          <SortIcon field="createdDate" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer font-bold text-slate-900 hover:text-blue-700 transition-colors"
                        onClick={() => handleSort("bookingId")}
                      >
                        <div className="flex items-center gap-2">
                          Booking ID
                          <SortIcon field="bookingId" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer font-bold text-slate-900 hover:text-blue-700 transition-colors"
                        onClick={() => handleSort("guestName")}
                      >
                        <div className="flex items-center gap-2">
                          Guest Name
                          <SortIcon field="guestName" />
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-900">Villa Details</TableHead>
                      <TableHead className="font-bold text-slate-900">Booking Room Name</TableHead>
                      <TableHead className="font-bold text-slate-900">Plan</TableHead>
                      <TableHead
                        className="cursor-pointer font-bold text-slate-900 hover:text-blue-700 transition-colors"
                        onClick={() => handleSort("checkIn")}
                      >
                        <div className="flex items-center gap-2">
                          Check In/Out
                          <SortIcon field="checkIn" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer font-bold text-slate-900 hover:text-blue-700 transition-colors"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center gap-2">
                          Amount
                          <SortIcon field="amount" />
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-900">Payment Progress</TableHead>
                      <TableHead className="font-bold text-slate-900">Status</TableHead>
                      <TableHead className="font-bold text-slate-900">Booking Source</TableHead>
                      <TableHead className="font-bold text-slate-900">Salesperson</TableHead>
                      <TableHead className="font-bold text-slate-900 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedBookings.map((booking, index) => (
                      <TableRow
                        key={booking.id}
                        className={`border-blue-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-blue-25"}`}
                      >
                        <TableCell className="font-medium text-slate-700">
                          {new Date(booking.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold text-blue-700">{booking.bookingId}</TableCell>
                        <TableCell className="font-medium text-slate-900">{booking.guestName}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-blue-900">{booking.villaNumber}</div>
                            <div className="text-sm text-slate-600">{booking.villaType}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300 font-semibold">
                            {booking.roomName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-pink-100 text-pink-800 border-pink-300 font-semibold">
                            {booking.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 font-medium">In:</span>
                              <span className="text-slate-700">{new Date(booking.checkIn).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-pink-600 font-medium">Out:</span>
                              <span className="text-slate-700">{new Date(booking.checkOut).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">₹{booking.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-700">
                                {getReceivedPercentage(booking.receivedAmount, booking.amount)}%
                              </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getReceivedPercentage(booking.receivedAmount, booking.amount)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadge(booking.status)} font-semibold`}>
                            {booking.status ? booking.status.replace("_", " ").toUpperCase() : "UNKNOWN"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-800 border-purple-300 font-semibold">
                            {booking.source || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                              {(booking.assignedTo ?? "")
                                .trim()
                                .split(/\s+/)
                                .map((n: string) => (n ? n.charAt(0).toUpperCase() : ""))
                                .join("")}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{booking.assignedTo}</div>
                              <div className="text-xs text-slate-500">Sales Executive</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 bg-white border border-blue-200 shadow-lg rounded-lg"
                            >
                              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer">
                                <Edit className="h-4 w-4 text-blue-600" />
                                <span className="text-slate-700">Edit Booking</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer">
                                <Eye className="h-4 w-4 text-pink-600" />
                                <span className="text-slate-700">View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1 border-blue-200" />
                              <DropdownMenuItem asChild>
                                <button
                                  onClick={() => handleAction("payment_upload", booking.id)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer w-full text-left"
                                >
                                  <Upload className="h-4 w-4 text-indigo-600" />
                                  <span className="text-slate-700">Upload Payment</span>
                                </button>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <button
                                  onClick={() => handleAction("cancel", booking.id)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer w-full text-left text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Cancel Booking</span>
                                </button>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination controls for Active Villa Bookings */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-100">
                <div className="text-sm text-slate-600">
                  Showing {(activeBookings.length === 0) ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, activeBookings.length)} of {activeBookings.length} bookings
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-2 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>

          {/* Cancel Booking Modal */}
          <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Cancel Booking
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cancel-reason">Reason of Cancellation *</Label>
                  <Select value={cancelReason} onValueChange={setCancelReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cancellation reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest_request">Guest Request</SelectItem>
                      <SelectItem value="payment_failure">Payment Failure</SelectItem>
                      <SelectItem value="villa_unavailable">Villa Unavailable</SelectItem>
                      <SelectItem value="medical_emergency">Medical Emergency</SelectItem>
                      <SelectItem value="weather_conditions">Weather Conditions</SelectItem>
                      <SelectItem value="travel_restrictions">Travel Restrictions</SelectItem>
                      <SelectItem value="duplicate_booking">Duplicate Booking</SelectItem>
                      <SelectItem value="policy_violation">Policy Violation</SelectItem>
                      <SelectItem value="system_error">System Error</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancel-remarks">Remarks</Label>
                  <Textarea
                    id="cancel-remarks"
                    placeholder="Enter additional remarks or details about the cancellation..."
                    value={cancelRemarks}
                    onChange={(e) => setCancelRemarks(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason("")
                    setCancelRemarks("")
                  }}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleCancelBooking} disabled={!cancelReason.trim()}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Payment Upload Modal */}
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-blue-600">
                  <Upload className="h-5 w-5" />
                  Payment Collection Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {selectedBookingForPayment && (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      <h3 className="font-semibold text-blue-900">Client Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-blue-700">Client Name:</Label>
                          <p className="font-medium">{selectedBookingForPayment.guestName}</p>
                        </div>
                        <div>
                          <Label className="text-blue-700">Mobile No.:</Label>
                          <p className="font-medium">{selectedBookingForPayment.mobile || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-blue-700">Booking Amount:</Label>
                          <p className="font-medium">₹ {selectedBookingForPayment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-blue-700">Pending Amount:</Label>
                          <p className="font-medium">
                            ₹{" "}
                            {(
                              selectedBookingForPayment.amount - selectedBookingForPayment.receivedAmount
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-blue-900">Payment Collection Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="received-amount">Received Amount *</Label>
                          <Input
                            id="received-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={paymentData.receivedAmount}
                            onChange={(e) => setPaymentData({ ...paymentData, receivedAmount: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-mode">Payment Mode *</Label>
                          <Select
                            value={paymentData.paymentMode}
                            onValueChange={(value) => setPaymentData({ ...paymentData, paymentMode: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="received-date">Received Date *</Label>
                          <Input
                            id="received-date"
                            type="date"
                            value={paymentData.receivedDate}
                            onChange={(e) => setPaymentData({ ...paymentData, receivedDate: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="receipt-number">Receipt Number *</Label>
                          <Input
                            id="receipt-number"
                            placeholder="Enter receipt number"
                            value={paymentData.receiptNumber}
                            onChange={(e) => setPaymentData({ ...paymentData, receiptNumber: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentModal(false)
                    setSelectedBookingForPayment(null)
                    setPaymentData({
                      receivedAmount: "",
                      currency: "INR",
                      paymentMode: "",
                      receivedDate: "",
                      receiptNumber: "",
                      screenshot: null,
                      paymentLocation: "",
                      paymentCollectedBy: "",
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={
                    !paymentData.receivedAmount ||
                    !paymentData.paymentMode ||
                    !paymentData.receivedDate ||
                    !paymentData.receiptNumber
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
