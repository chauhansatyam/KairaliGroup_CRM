"use client"

import { useAuth } from "@/hooks/use-auth"
import { useLeads } from "@/hooks/use-leads"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  History,
  CheckCircle,
  TableIcon,
  BarChart3,
  DollarSign,
  Target,
  LineChart,
  EyeOff,
} from "lucide-react"
import { BackButton } from "@/components/back-button"
import type { Lead } from "@/types/lead"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CallHistory {
  id: string
  callDate: string
  disposition: string
  remarks: string
  recordingUrl: string | null
  duration: string
}

export default function LeadAssignmentPage() {
  const { user, isLoading, hasPermission, getAllUsers } = useAuth()
  const { leads, assignLead } = useLeads()
  const router = useRouter()
  const [unassignedLeads, setUnassignedLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [assignToFilter, setAssignToFilter] = useState("all")
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [dataSourceSortField, setDataSourceSortField] = useState<string>("")
  const [dataSourceSortDirection, setDataSourceSortDirection] = useState<"asc" | "desc">("asc")
  const [dataSourceTableVisible, setDataSourceTableVisible] = useState(true)
  const [isDataLoading, setIsDataLoading] = useState(true)
  useEffect(() => {
  // Only stop loading when:
  // 1. Auth is loaded (!isLoading)
  // 2. Leads data exists (leads is defined and not null)
  // 3. User has permission or is redirecting
  if (!isLoading && leads !== undefined && leads !== null) {
    // Small delay for smooth transition
    const timer = setTimeout(() => {
      setIsDataLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }
}, [isLoading, leads])

  const [selectedCompany, setSelectedCompany] = useState<string>("")

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [startDate, setStartDate] = useState(() => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  return firstDay.toISOString().split('T')[0]
})

const [endDate, setEndDate] = useState(() => {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return lastDay.toISOString().split('T')[0]
})
  const [dateError, setDateError] = useState("")

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCallHistoryDialogOpen, setIsCallHistoryDialogOpen] = useState(false)
  const [isSqvDialogOpen, setIsSqvDialogOpen] = useState(false)

  const [dataSourceView, setDataSourceView] = useState<"table" | "chart">("table")

  const getCallHistory = (leadId: string): CallHistory[] => {
    const callCount = Math.floor(Math.random() * 5) + 1
    return Array.from({ length: callCount }, (_, i) => ({
      id: `call-${leadId}-${i + 1}`,
      callDate: new Date(Date.now() - i * 86400000 * 2).toLocaleString(),
      disposition: ["Interested", "Not Interested", "Call Back", "No Answer", "Busy"][Math.floor(Math.random() * 5)],
      remarks: [
        "Customer wants more information about pricing",
        "Requested callback tomorrow morning",
        "Not available, will call back later",
        "Very interested in Panchakarma treatment",
        "Needs to discuss with family first",
      ][Math.floor(Math.random() * 5)],
      recordingUrl: Math.random() > 0.5 ? `https://recordings.example.com/${leadId}-${i + 1}.mp3` : null,
      duration: `${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    }))
  }

  const getSqvData = (leadId: string) => {
    return {
      verifiedStatus: "Yes",
      sqvId: "1UI8LWPA2",
      outcomeStatus: "Prevention_Rejuvenation",
      recordingUrl: "https://squadiq-call-recs.s3.amazonaws.com/1UI8LWPA2.mp3",
      agentDisposition: "Prevention_Rejuvenation",
      agentRemarks: "Na",
      agentName: "Himani",
      priority: "High",
    }
  }

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLeads = filteredLeads.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, priorityFilter, sourceFilter, urgencyFilter, assignToFilter])

  const [filteredByDateLeads, setFilteredByDateLeads] = useState<Lead[]>(leads)

  useEffect(() => {
    if (user && !selectedCompany) {
      setSelectedCompany(user.company || "KTAHV")
    }
  }, [user, selectedCompany])

  // Date filtering logic (from old code)
  useEffect(() => {
    console.log('Total Leads:', leads.length, leads);
    var filtered = leads.filter((lead) => lead.Company === selectedCompany)
    filtered = filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    if (startDate && !endDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.updatedAt).setHours(0, 0, 0, 0)
        const filterStartDate = new Date(startDate).setHours(0, 0, 0, 0)
        return leadDate >= filterStartDate
      })
    }

    if (endDate && !startDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.updatedAt).setHours(0, 0, 0, 0)
        const filterEndDate = new Date(endDate).setHours(23, 59, 59, 999)
        return leadDate <= filterEndDate
      })
    }

    if (startDate && endDate) {
      if (endDate < startDate) {
        setDateError("End date cannot be earlier than start date")
      } else {
        setDateError("")
      }
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.updatedAt).setHours(0, 0, 0, 0)
        const filterStartDate = new Date(startDate).setHours(0, 0, 0, 0)
        const filterEndDate = new Date(endDate).setHours(23, 59, 59, 999)
        return leadDate >= filterStartDate && leadDate <= filterEndDate
      })
    } else {
      setDateError("")
    }

    setFilteredByDateLeads(filtered)
  }, [leads, startDate, endDate, selectedCompany])

  useEffect(() => {
    if (!isLoading && (!user || !hasPermission("leads.assign"))) {
      router.push("/dashboard")
    }
  }, [user, isLoading, hasPermission, router])

  useEffect(() => {
    const filtered = filteredLeads.filter(
      (lead) =>
        (!lead.assignedTo || lead.tatBreached || !lead.sentStatus) &&
        (user?.permissions.includes("all") || lead.company === user?.company)
    )
    setUnassignedLeads(filtered)
  }, [leads, user, filteredLeads])

  useEffect(() => {
    let filtered = filteredByDateLeads

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.toString().includes(searchTerm) ||
          lead.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Priority filter
    if (priorityFilter !== "all") {
      console.log('Applying priority filter:', priorityFilter);
      filtered = filtered.filter((lead) => lead.priority === priorityFilter)
    }

    // Source filter (using vSrc)
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.vSrc === sourceFilter)
    }

    // Urgency filter
    if (urgencyFilter !== "all") {
      console.log('Applying urgency filter:', urgencyFilter);
      filtered = filtered.filter((lead) => {
        const isUrgent = lead.priority == "high" || lead.tatBreached
        return urgencyFilter == "yes" ? isUrgent : !isUrgent
      })
    }

    // Assign To filter
    if (assignToFilter !== "all") {
      if (assignToFilter === "unassigned") {
        filtered = filtered.filter((lead) => lead.sentStatus === "")
      } else {
        filtered = filtered.filter((lead) => lead.sentStatus !== "")
      }
    }

    // Sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValueN = a[sortField as keyof typeof a]
        let bValueN = b[sortField as keyof typeof b]

        if (typeof aValueN === "string") aValueN = aValueN.toLowerCase()
        if (typeof bValueN === "string") bValueN = bValueN.toLowerCase()

        if (aValueN < bValueN) return sortDirection === "asc" ? -1 : 1
        if (aValueN > bValueN) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    setFilteredLeads(filtered)
  }, [
    filteredByDateLeads,
    searchTerm,
    priorityFilter,
    sourceFilter,
    urgencyFilter,
    assignToFilter,
    sortField,
    sortDirection,
  ])

  const salesAgents = getAllUsers().filter(
    (u) =>
      (u.role === "sales_agent" || u.role === "sales_manager") &&
      u.isActive &&
      (user?.permissions.includes("all") || u.company === user?.company)
  )

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDataSourceSort = (field: string) => {
    if (dataSourceSortField === field) {
      setDataSourceSortDirection(dataSourceSortDirection === "asc" ? "desc" : "asc")
    } else {
      setDataSourceSortField(field)
      setDataSourceSortDirection("asc")
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const renderDataSourceSortIcon = (field: string) => {
    if (dataSourceSortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return dataSourceSortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  // Show loader if auth is loading OR data is loading OR leads is not yet loaded
if (isLoading || isDataLoading || !leads) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          {/* Spinner */}
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Inner pulse */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse opacity-20"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Dashboard</h3>
          <p className="text-sm text-slate-500 animate-pulse">
            {!leads ? "Fetching leads data..." : `Loading data for ${selectedCompany}...`}
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-2 mt-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </DashboardLayout>
  )
}

  if (!user || !hasPermission("leads.assign")) {
    return null
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Calculate statistics (from old code)
  var totalNBDCount = 0
  var totalCRRCount = 0
  var totalSentSQVNBDCount = 0
  var totalSentSQVCRRCount = 0
  var totalSentDialerNBDCount = 0
  var totalSentDialerCRRCount = 0
  var totalSentAppsheetNBDCount = 0
  var totalSentAppsheetCRRCount = 0
  var totalSentDeleteNBDCount = 0
  var totalSentDeleteCRRCount = 0
  var sourceWiseMap = new Map<string, { totalLeads: number; nbd: number; crr: number }>()

  filteredByDateLeads.forEach((lead) => {
    if (lead["NBD/CRR"] === "CRR") totalCRRCount++
    else totalNBDCount++

    if (lead.sentStatus) {
      if (lead.assignedTo.includes("Squard Voice")) {
        if (lead["NBD/CRR"] === "CRR") totalSentSQVCRRCount++
        else totalSentSQVNBDCount++
      } else if (
        ["AHV", "KAPPL", "CRR", "ColdCalling", "all", "KTAHV COLD CALLING", "KTAHV CRR SALES"].indexOf(
          lead.assignedTo
        ) > -1
      ) {
        if (lead["NBD/CRR"] === "CRR") totalSentDialerCRRCount++
        else totalSentDialerNBDCount++
      } else if (lead.assignedTo.includes("Delete")) {
        if (lead["NBD/CRR"] === "CRR") totalSentDeleteCRRCount++
        else totalSentDeleteNBDCount++
      } else {
        if (lead["NBD/CRR"] === "CRR") totalSentAppsheetCRRCount++
        else totalSentAppsheetNBDCount++
      }
    }

    var src = lead.vSrc || "Others"
    if (sourceWiseMap.has(src)) {
      var entry = sourceWiseMap.get(src)
      entry!.totalLeads += 1
      if (lead["NBD/CRR"] === "CRR") entry!.crr += 1
      else entry!.nbd += 1
      sourceWiseMap.set(src, entry!)
    } else {
      if (lead["NBD/CRR"] === "CRR") sourceWiseMap.set(src, { totalLeads: 1, nbd: 0, crr: 1 })
      else sourceWiseMap.set(src, { totalLeads: 1, nbd: 1, crr: 0 })
    }
  })

  var srcData = Array.from(sourceWiseMap, ([dataSource, values]) => ({ dataSource, ...values }))
  if (dataSourceSortField) {
    srcData.sort((a, b) => {
      let aValue = a[dataSourceSortField as keyof typeof a]
      let bValue = b[dataSourceSortField as keyof typeof b]

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (aValue < bValue) return dataSourceSortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return dataSourceSortDirection === "asc" ? 1 : -1
      return 0
    })
  }

  // Data for charts
  const chartData = srcData.map((item) => ({
    ...item,
    growth: (Math.random() * 30 - 10).toFixed(1),
    convertedCount: Math.floor(item.totalLeads * (0.15 + Math.random() * 0.25)),
    conversionAmount: Math.floor(item.totalLeads * (0.15 + Math.random() * 0.25)) * (50000 + Math.random() * 150000),
    conversionPercentage: item.totalLeads > 0 ? ((Math.floor(item.totalLeads * 0.25) / item.totalLeads) * 100).toFixed(2) : "0.00",
    spendAmount: item.totalLeads * (500 + Math.random() * 1500),
    roas: item.totalLeads > 0 ? ((Math.floor(item.totalLeads * 0.25) * 85000) / (item.totalLeads * 1000)).toFixed(2) : "0.00",
  }))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BackButton />

        <Card className="border-2 border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            {/* Company Tabs */}
            <div className="flex gap-2 mb-6 border-b pb-4">
              {["KTAHV", "KAPPL", "VILLARAAG"].map((company) => (
                <Button
                  key={company}
                  variant={selectedCompany === company ? "default" : "outline"}
                  onClick={() => setSelectedCompany(company)}
                  className={`flex-1 font-semibold text-base py-6 ${selectedCompany === company
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    : "hover:bg-slate-100"
                    }`}
                >
                  {company}
                </Button>
              ))}
            </div>

            {/* Date Filter */}
            <div className="grid gap-4 md:grid-cols-6 mb-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full ${dateError ? "border-red-500 focus:border-red-500" : ""}`}
                  max={endDate}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full ${dateError ? "border-red-500 focus:border-red-500" : ""}`}
                  min={startDate}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Leads
                </label>
                <Input
                  placeholder="Search by name, email, phone, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid gap-4 md:grid-cols-6">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {srcData.map((srcX) => (
                    <SelectItem key={srcX.dataSource} value={srcX.dataSource}>
                      {srcX.dataSource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Urgent</SelectItem>
                  <SelectItem value="no">Not Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assignToFilter} onValueChange={setAssignToFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate("")
                  setEndDate("")
                  setSearchTerm("")
                  setPriorityFilter("all")
                  setSourceFilter("all")
                  setUrgencyFilter("all")
                  setAssignToFilter("all")
                  setSortField("")
                  setSortDirection("asc")
                }}
                className="md:col-span-2"
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <h1 className="text-3xl font-bold">Lead Assignment - {selectedCompany}</h1>
          <p className="text-muted-foreground">Assign unassigned and TAT breached leads to sales agents</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* Statistics Cards with Real Data */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Unique Lead Received</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">0%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{filteredByDateLeads.length}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-medium">
                  NBD: {totalNBDCount} ({filteredByDateLeads.length > 0 ? ((totalNBDCount / filteredByDateLeads.length) * 100).toFixed(2) : 0}%)
                </span>
                <span className="text-red-600 font-medium">
                  CRR: {totalCRRCount} ({filteredByDateLeads.length > 0 ? ((totalCRRCount / filteredByDateLeads.length) * 100).toFixed(2) : 0}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfer to Dialer</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">0%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSentDialerNBDCount + totalSentDialerCRRCount}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-medium">
                  NBD: {totalSentDialerNBDCount} ({totalSentDialerNBDCount + totalSentDialerCRRCount > 0 ? ((totalSentDialerNBDCount / (totalSentDialerNBDCount + totalSentDialerCRRCount)) * 100).toFixed(2) : 0}%)
                </span>
                <span className="text-green-600 font-medium">
                  CRR: {totalSentDialerCRRCount} ({totalSentDialerNBDCount + totalSentDialerCRRCount > 0 ? ((totalSentDialerCRRCount / (totalSentDialerNBDCount + totalSentDialerCRRCount)) * 100).toFixed(2) : 0}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Transfer to SQV</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-500">0%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{totalSentSQVNBDCount + totalSentSQVCRRCount}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-medium">
                  NBD: {totalSentSQVNBDCount} ({totalSentSQVNBDCount + totalSentSQVCRRCount > 0 ? ((totalSentSQVNBDCount / (totalSentSQVNBDCount + totalSentSQVCRRCount)) * 100).toFixed(2) : 0}%)
                </span>
                <span className="text-red-600 font-medium">
                  CRR: {totalSentSQVCRRCount} ({totalSentSQVNBDCount + totalSentSQVCRRCount > 0 ? ((totalSentSQVCRRCount / (totalSentSQVNBDCount + totalSentSQVCRRCount)) * 100).toFixed(2) : 0}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfer to Appsheet</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">0%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSentAppsheetNBDCount + totalSentAppsheetCRRCount}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-medium">
                  NBD: {totalSentAppsheetNBDCount} ({totalSentAppsheetNBDCount + totalSentAppsheetCRRCount > 0 ? ((totalSentAppsheetNBDCount / (totalSentAppsheetNBDCount + totalSentAppsheetCRRCount)) * 100).toFixed(2) : 0}%)
                </span>
                <span className="text-red-600 font-medium">
                  CRR: {totalSentAppsheetCRRCount} ({totalSentAppsheetNBDCount + totalSentAppsheetCRRCount > 0 ? ((totalSentAppsheetCRRCount / (totalSentAppsheetNBDCount + totalSentAppsheetCRRCount)) * 100).toFixed(2) : 0}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfer to Delete Sheet</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-500">0%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSentDeleteNBDCount + totalSentDeleteCRRCount}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-600 font-medium">
                  NBD: {totalSentDeleteNBDCount} ({totalSentDeleteNBDCount + totalSentDeleteCRRCount > 0 ? ((totalSentDeleteNBDCount / (totalSentDeleteNBDCount + totalSentDeleteCRRCount)) * 100).toFixed(2) : 0}%)
                </span>
                <span className="text-red-600 font-medium">
                  CRR: {totalSentDeleteCRRCount} ({totalSentDeleteNBDCount + totalSentDeleteCRRCount > 0 ? ((totalSentDeleteCRRCount / (totalSentDeleteNBDCount + totalSentDeleteCRRCount)) * 100).toFixed(2) : 0}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Unassign (Pending To Transfer)</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{unassignedLeads.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Second row of statistics cards - keeping the new UI but with mock data for now */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Conversion Count</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+18%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {Math.floor(filteredByDateLeads.length * 0.25)}
              </div>
              <div className="flex flex-col gap-1 text-xs mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">NBD Planned: 15</span>
                  <span className="text-blue-600 font-medium flex items-center gap-1">
                    Actual: 12 <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700 font-medium">CRR Planned: 8</span>
                  <span className="text-orange-600 font-medium flex items-center gap-1">
                    Actual: 5 <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Conversion Amount</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+22%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                ₹{(Math.floor(filteredByDateLeads.length * 0.25) * 85000).toLocaleString("en-IN")}
              </div>
              <div className="flex flex-col gap-1 text-xs mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">NBD Planned: ₹12L</span>
                  <span className="text-blue-600 font-medium flex items-center gap-1">
                    Actual: ₹10L <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700 font-medium">CRR Planned: ₹7L</span>
                  <span className="text-orange-600 font-medium flex items-center gap-1">
                    Actual: ₹5L <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-teal-50 border-teal-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-800">Conversion %</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+5%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {filteredByDateLeads.length > 0
                  ? ((Math.floor(filteredByDateLeads.length * 0.25) / filteredByDateLeads.length) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <div className="flex flex-col gap-1 text-xs mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">NBD Planned: 28%</span>
                  <span className="text-blue-600 font-medium flex items-center gap-1">
                    Actual: 24% <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700 font-medium">CRR Planned: 22%</span>
                  <span className="text-orange-600 font-medium flex items-center gap-1">
                    Actual: 18% <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50 border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-800">Spend Amount</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+10%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">
                ₹{(Math.floor(filteredByDateLeads.length * 0.25) * 2500).toLocaleString("en-IN")}
              </div>
              <div className="flex flex-col gap-1 text-xs mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">NBD Planned: ₹8L</span>
                  <span className="text-blue-600 font-medium flex items-center gap-1">
                    Actual: ₹6.5L <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700 font-medium">CRR Planned: ₹5L</span>
                  <span className="text-orange-600 font-medium flex items-center gap-1">
                    Actual: ₹3.8L <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">ROAS</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+15%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">
                {filteredByDateLeads.length > 0
                  ? (
                    (Math.floor(filteredByDateLeads.length * 0.25) * 85000) /
                    (Math.floor(filteredByDateLeads.length * 0.25) * 2500)
                  ).toFixed(2)
                  : 0}
                x
              </div>
              <div className="flex flex-col gap-1 text-xs mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">NBD Planned: 3.5x</span>
                  <span className="text-blue-600 font-medium flex items-center gap-1">
                    Actual: 3.2x <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700 font-medium">CRR Planned: 3.0x</span>
                  <span className="text-orange-600 font-medium flex items-center gap-1">
                    Actual: 2.7x <ArrowDown className="h-3 w-3 text-red-500" />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Source Breakdown Table with Real Data */}
        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Source Breakdown - Total Unique Lead Received ({selectedCompany})</CardTitle>
                <CardDescription>Analyze lead performance across different data sources</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={dataSourceView === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDataSourceView("table")}
                  className={dataSourceView === "table" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Table
                </Button>
                <Button
                  variant={dataSourceView === "chart" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDataSourceView("chart")}
                  className={dataSourceView === "chart" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chart
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dataSourceView === "table" ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("dataSource")}>
                        <div className="flex items-center gap-2">
                          Data Source
                          {renderDataSourceSortIcon("dataSource")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("totalLeads")}>
                        <div className="flex items-center gap-2">
                          Total Leads
                          {renderDataSourceSortIcon("totalLeads")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("nbd")}>
                        <div className="flex items-center gap-2">
                          NBD
                          {renderDataSourceSortIcon("nbd")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("crr")}>
                        <div className="flex items-center gap-2">
                          CRR
                          {renderDataSourceSortIcon("crr")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("growth")}>
                        <div className="flex items-center gap-2">
                          Growth
                          {renderDataSourceSortIcon("growth")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {srcData.map((src) => (
                      <TableRow key={src.dataSource}>
                        <TableCell className="font-medium">{src.dataSource}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-semibold">
                            {src.totalLeads}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600 font-medium">
                            {src.nbd} ({((src.nbd / src.totalLeads) * 100).toFixed(2)}%)
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-orange-600 font-medium">
                            {src.crr} ({((src.crr / src.totalLeads) * 100).toFixed(2)}%)
                          </span>
                        </TableCell>
                        <TableCell>
                          {src.totalLeads > 0 ? (
                            src.nbd > src.crr ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <ArrowUp className="h-4 w-4" />
                                <span>{(((src.nbd - src.crr) / src.totalLeads) * 100).toFixed(2)}%</span>
                              </div>
                            ) : src.crr > src.nbd ? (
                              <div className="flex items-center gap-1 text-red-600">
                                <ArrowDown className="h-4 w-4" />
                                <span>{(((src.crr - src.nbd) / src.totalLeads) * 100).toFixed(2)}%</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-600">
                                <span>0%</span>
                              </div>
                            )
                          ) : (
                            <div className="flex items-center gap-1 text-gray-600">
                              <span>N/A</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs defaultValue="leads" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
                    <TabsTrigger
                      value="leads"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all px-4 py-3"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-xs font-medium">Total Leads</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="breakdown"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all px-4 py-3"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-medium">NBD vs CRR</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="leads" className="h-[600px] mt-6">
                    <div className="border rounded-lg p-4 h-full bg-gradient-to-br from-blue-50 to-white">
                      <h3 className="text-sm font-semibold mb-3 text-blue-900">Lead Distribution by Source</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={srcData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={120} fontSize={11} />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Legend wrapperStyle={{ paddingTop: "10px" }} />
                          <Bar dataKey="totalLeads" fill="#3b82f6" name="Total Leads" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="breakdown" className="h-[600px] mt-6">
                    <div className="border rounded-lg p-4 h-full bg-gradient-to-br from-green-50 to-white">
                      <h3 className="text-sm font-semibold mb-3 text-green-900">NBD vs CRR Distribution</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={srcData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={120} fontSize={11} />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Bar dataKey="nbd" fill="#10b981" name="NBD" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="crr" fill="#f59e0b" name="CRR" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Data Source Breakdown Table with Real Data */}
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Data Source Breakdown - Total Unique Lead Received ({selectedCompany})</CardTitle>
        <CardDescription>Analyze lead performance across different data sources</CardDescription>
      </div>
      <div className="flex gap-2">
        <Button
          variant={dataSourceView === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDataSourceView("table")}
          className={dataSourceView === "table" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          <TableIcon className="h-4 w-4 mr-2" />
          Table
        </Button>
        <Button
          variant={dataSourceView === "chart" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDataSourceView("chart")}
          className={dataSourceView === "chart" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Chart
        </Button>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {dataSourceView === "table" ? (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="cursor-pointer font-semibold" onClick={() => handleDataSourceSort("dataSource")}>
                <div className="flex items-center gap-2">
                  Data Source
                  {renderDataSourceSortIcon("dataSource")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("totalLeads")}>
                <div className="flex items-center justify-center gap-2">
                  Total Leads
                  {renderDataSourceSortIcon("totalLeads")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("nbd")}>
                <div className="flex items-center justify-center gap-2">
                  NBD
                  {renderDataSourceSortIcon("nbd")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("crr")}>
                <div className="flex items-center justify-center gap-2">
                  CRR
                  {renderDataSourceSortIcon("crr")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("growth")}>
                <div className="flex items-center justify-center gap-2">
                  Growth
                  {renderDataSourceSortIcon("growth")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("convertedCount")}>
                <div className="flex items-center justify-center gap-2">
                  Converted Count
                  {renderDataSourceSortIcon("convertedCount")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("conversionAmount")}>
                <div className="flex items-center justify-center gap-2">
                  Conversion Amount
                  {renderDataSourceSortIcon("conversionAmount")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("conversionPercentage")}>
                <div className="flex items-center justify-center gap-2">
                  Conversion %
                  {renderDataSourceSortIcon("conversionPercentage")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("spendAmount")}>
                <div className="flex items-center justify-center gap-2">
                  Spend Amount
                  {renderDataSourceSortIcon("spendAmount")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-semibold text-center" onClick={() => handleDataSourceSort("roas")}>
                <div className="flex items-center justify-center gap-2">
                  ROAS
                  {renderDataSourceSortIcon("roas")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chartData.map((item, index) => {
              const growthValue = parseFloat(item.growth)
              const conversionPct = parseFloat(item.conversionPercentage)
              
              return (
                <TableRow key={item.dataSource} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <TableCell className="font-medium">{item.dataSource}</TableCell>
                  
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-semibold">
                      {item.totalLeads}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-blue-600 font-medium">
                      {item.nbd}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-orange-600 font-medium">
                      {item.crr}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className={`flex items-center justify-center gap-1 font-medium ${
                      growthValue > 0 ? "text-green-600" : growthValue < 0 ? "text-red-600" : "text-gray-600"
                    }`}>
                      {growthValue > 0 ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : growthValue < 0 ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : null}
                      <span>{growthValue > 0 ? '+' : ''}{item.growth}%</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-semibold bg-green-50 text-green-700 border-green-300">
                      {item.convertedCount}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-center font-medium">
                    ₹{Math.floor(item.conversionAmount).toLocaleString("en-IN")}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <div className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        conversionPct === 0 
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-green-100 text-green-800 border border-green-300"
                      }`}>
                        {item.conversionPercentage}%
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center font-medium text-blue-600">
                    ₹{Math.floor(item.spendAmount).toLocaleString("en-IN")}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className={`font-semibold ${
                      parseFloat(item.roas) === 0 ? "text-red-600" : "text-green-600"
                    }`}>
                      {parseFloat(item.roas) === 0 ? "0x" : `${item.roas}x`}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    ) : (
      <div className="space-y-4">
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
            <TabsTrigger
              value="leads"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all px-4 py-3"
            >
              <div className="flex flex-col items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-medium">Total Leads</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="breakdown"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all px-4 py-3"
            >
              <div className="flex flex-col items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">NBD vs CRR</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="h-[600px] mt-6">
            <div className="border rounded-lg p-4 h-full bg-gradient-to-br from-blue-50 to-white">
              <h3 className="text-sm font-semibold mb-3 text-blue-900">Lead Distribution by Source</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={120} fontSize={11} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar dataKey="totalLeads" fill="#3b82f6" name="Total Leads" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="h-[600px] mt-6">
            <div className="border rounded-lg p-4 h-full bg-gradient-to-br from-green-50 to-white">
              <h3 className="text-sm font-semibold mb-3 text-green-900">NBD vs CRR Distribution</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={120} fontSize={11} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="nbd" fill="#10b981" name="NBD" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="crr" fill="#f59e0b" name="CRR" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )}
  </CardContent>
</Card>

        {/* Leads Table with Real Data */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-xl font-bold text-blue-900">
              Leads Requiring Assignment ({filteredLeads.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">No leads requiring assignment at this time.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="cursor-pointer font-semibold" onClick={() => handleSort("createdAt")}>
                          <div className="flex items-center gap-2">
                            Date & Time
                            {renderSortIcon("createdAt")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer font-semibold" onClick={() => handleSort("id")}>
                          <div className="flex items-center gap-2">
                            ID
                            {renderSortIcon("id")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer font-semibold" onClick={() => handleSort("name")}>
                          <div className="flex items-center gap-2">
                            Name of Client
                            {renderSortIcon("name")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer font-semibold" onClick={() => handleSort("phone")}>
                          <div className="flex items-center gap-2">
                            Mobile
                            {renderSortIcon("phone")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer font-semibold" onClick={() => handleSort("email")}>
                          <div className="flex items-center gap-2">
                            Email Id
                            {renderSortIcon("email")}
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Subject</TableHead>
                        <TableHead className="font-semibold">Notes</TableHead>
                        <TableHead className="font-semibold">IVR URL</TableHead>
                        <TableHead className="font-semibold">Website Name</TableHead>
                        <TableHead className="cursor-pointer font-semibold" onClick={() => handleSort("source")}>
                          <div className="flex items-center gap-2">
                            Data Source
                            {renderSortIcon("source")}
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Timestamp Transcription</TableHead>
                        <TableHead className="cursor-pointer font-semibold" onClick={() => handleSort("company")}>
                          <div className="flex items-center gap-2">
                            Lead Company
                            {renderSortIcon("company")}
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">User Name</TableHead>
                        <TableHead className="font-semibold">User Phone</TableHead>
                        <TableHead className="font-semibold">User Email</TableHead>
                        <TableHead className="font-semibold">Country</TableHead>
                        <TableHead className="cursor-pointer font-semibold" onClick={() => handleSort("priority")}>
                          <div className="flex items-center gap-2">
                            Priority
                            {renderSortIcon("priority")}
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Urgency</TableHead>
                        <TableHead className="font-semibold">Contact Time</TableHead>
                        <TableHead className="font-semibold">Conversation Summary</TableHead>
                        <TableHead className="font-semibold">Lead Outcome</TableHead>
                        <TableHead className="font-semibold">Lead Category</TableHead>
                        <TableHead className="font-semibold">Preferred Contact</TableHead>
                        <TableHead className="font-semibold">Assign To</TableHead>
                        <TableHead className="font-semibold">Last Call Done Date</TableHead>
                        <TableHead className="font-semibold">Last Disposition</TableHead>
                        <TableHead className="font-semibold">Last Remarks</TableHead>
                        <TableHead className="font-semibold">Call Recording URL</TableHead>
                        <TableHead className="font-semibold">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {currentLeads.map((lead, index) => (
                        <TableRow
                          key={lead.id === "-" ? "-" + index : lead.id}
                          className={`${lead.tatBreached
                            ? "bg-red-50 hover:bg-red-100"
                            : index % 2 === 0
                              ? "bg-white hover:bg-slate-50"
                              : "bg-slate-50/50 hover:bg-slate-100"
                            } transition-colors`}
                        >
                          {/* Date & Time */}
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-medium">
                                {new Date(lead.updatedAt).toLocaleDateString("en-GB")}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(lead.updatedAt).toLocaleTimeString("en-GB", { hour12: false })}
                              </div>
                            </div>
                          </TableCell>

                          {/* ID */}
                          <TableCell className="font-mono text-xs font-semibold text-blue-600">
                            {lead.id?.toString() || "N/A"}
                          </TableCell>

                          {/* Name */}
                          <TableCell className="whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{lead.name || "N/A"}</div>
                            {lead.tatBreached && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                TAT Breach
                              </Badge>
                            )}
                          </TableCell>

                          {/* Phone */}
                          <TableCell className="whitespace-nowrap font-medium">{lead.phone || "N/A"}</TableCell>

                          {/* Email */}
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.email || "N/A"}>
                              {lead.email || "N/A"}
                            </div>
                          </TableCell>

                          {/* Subject */}
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.subject || "N/A"}>
                              {lead.subject || "N/A"}
                            </div>
                          </TableCell>

                          {/* Notes */}
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.notes || "N/A"}>
                              {lead.notes || "N/A"}
                            </div>
                          </TableCell>

                          {/* IVR URL */}
                          <TableCell className="whitespace-nowrap">
                            {lead.ivrUrl ? (
                              <a
                                href={lead.ivrUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                View Recording
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>

                          {/* Website Name */}
                          <TableCell className="max-w-32">
                            <div className="truncate" title={lead.websiteName || "N/A"}>
                              {lead.websiteName || "N/A"}
                            </div>
                          </TableCell>

                          {/* Data Source */}
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="secondary" className="capitalize text-xs font-medium">
                              {lead.source?.replace("_", " ") || "N/A"}
                            </Badge>
                          </TableCell>

                          {/* Timestamp Transcription */}
                          <TableCell className="max-w-40">
                            <div className="truncate text-sm" title={lead.timestampTranscription || "N/A"}>
                              {lead.timestampTranscription || "N/A"}
                            </div>
                          </TableCell>

                          {/* Lead Company */}
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="outline" className="text-xs font-semibold">
                              {lead.Company || "N/A"}
                            </Badge>
                          </TableCell>

                          {/* User Name */}
                          <TableCell className="max-w-32">
                            <div className="truncate" title={lead.userName || "N/A"}>
                              {lead.userName || "N/A"}
                            </div>
                          </TableCell>

                          {/* User Phone */}
                          <TableCell className="whitespace-nowrap">{lead.userPhone || "N/A"}</TableCell>

                          {/* User Email */}
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.userEmail || "N/A"}>
                              {lead.userEmail || "N/A"}
                            </div>
                          </TableCell>

                          {/* Country */}
                          <TableCell className="whitespace-nowrap font-medium">{lead.country || "N/A"}</TableCell>

                          {/* Priority */}
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              className={
                                lead.priority === "high"
                                  ? "bg-red-100 text-red-800 font-semibold"
                                  : lead.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800 font-semibold"
                                    : "bg-green-100 text-green-800 font-semibold"
                              }
                            >
                              {lead.priority?.toUpperCase() || "N/A"}
                            </Badge>
                          </TableCell>

                          {/* Urgency */}
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              variant={lead.urgency === "high" || lead.tatBreached ? "destructive" : "secondary"}
                              className="font-semibold"
                            >
                              {lead.urgency === "high" || lead.tatBreached ? "YES" : "NO"}
                            </Badge>
                          </TableCell>

                          {/* Contact Time */}
                          <TableCell className="max-w-32">
                            <div className="truncate" title={lead.contactTime || "N/A"}>
                              {lead.contactTime || "N/A"}
                            </div>
                          </TableCell>

                          {/* Conversation Summary */}
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.conversationSummary || "N/A"}>
                              {lead.conversationSummary || "N/A"}
                            </div>
                          </TableCell>

                          {/* Lead Outcome */}
                          <TableCell className="max-w-32">
                            <div className="truncate" title={lead.leadOutcome || "N/A"}>
                              {lead.leadOutcome || "N/A"}
                            </div>
                          </TableCell>

                          {/* Lead Category */}
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="outline" className="font-medium">
                              {lead.leadCategory || "N/A"}
                            </Badge>
                          </TableCell>

                          {/* Preferred Contact */}
                          <TableCell className="max-w-32">
                            <div className="truncate" title={lead.preferredContact || "N/A"}>
                              {lead.preferredContact || "N/A"}
                            </div>
                          </TableCell>

                          {/* Assign To */}
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="secondary" className="font-medium">
                              {lead.assignedTo || "Unassigned"}
                            </Badge>
                          </TableCell>

                          {/* Last Call Done Date */}
                          <TableCell className="whitespace-nowrap text-sm">{lead.lastCallDate || "N/A"}</TableCell>

                          {/* Last Disposition */}
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={
                                lead.lastDisposition === "Interested"
                                  ? "border-green-500 text-green-700 bg-green-50"
                                  : lead.lastDisposition === "Not Interested"
                                    ? "border-red-500 text-red-700 bg-red-50"
                                    : "border-yellow-500 text-yellow-700 bg-yellow-50"
                              }
                            >
                              {lead.lastDisposition || "N/A"}
                            </Badge>
                          </TableCell>

                          {/* Last Remarks */}
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.lastRemarks || "N/A"}>
                              {lead.lastRemarks || "N/A"}
                            </div>
                          </TableCell>

                          {/* Call Recording URL */}
                          <TableCell className="whitespace-nowrap">
                            {lead.callRecordingUrl ? (
                              <a
                                href={lead.callRecordingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-xs"
                              >
                                Play Recording
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>

                          {/* Action */}
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 bg-transparent"
                                onClick={() => {
                                  setSelectedLead(lead)
                                  setIsViewDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 bg-transparent"
                                onClick={() => {
                                  setSelectedLead(lead)
                                  setIsCallHistoryDialogOpen(true)
                                }}
                              >
                                <History className="h-4 w-4 mr-1" />
                                Call History
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 bg-green-50 border-green-200 hover:bg-green-100"
                                onClick={() => {
                                  setSelectedLead(lead)
                                  setIsSqvDialogOpen(true)
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                SQV VERIFIED
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} leads
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 ${currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <span key={page} className="px-1">
                                ...
                              </span>
                            )
                          }
                          return null
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>


        {/* Dialogs - keeping all the new dialog UI */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-900">Lead Details</DialogTitle>
              <DialogDescription>Complete information about the selected lead</DialogDescription>
            </DialogHeader>
            {selectedLead && (
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Lead ID</label>
                    <p className="text-sm font-mono bg-slate-100 p-2 rounded">{selectedLead.id}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Created At</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">
                      {new Date(selectedLead.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Name</label>
                    <p className="text-sm bg-slate-100 p-2 rounded font-medium">{selectedLead.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">
                      <Badge variant="outline">{selectedLead.company}</Badge>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">{selectedLead.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone</label>
                    <p className="text-sm bg-slate-100 p-2 rounded font-medium">{selectedLead.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Country</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">{selectedLead.country || "N/A"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Priority</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">
                      <Badge
                        className={
                          selectedLead.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : selectedLead.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {selectedLead.priority.toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject</label>
                  <p className="text-sm bg-slate-100 p-2 rounded">{selectedLead.subject || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Notes</label>
                  <p className="text-sm bg-slate-100 p-3 rounded">{selectedLead.notes || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Data Source</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">
                      <Badge variant="secondary">{selectedLead.source}</Badge>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Lead Category</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">{selectedLead.leadCategory || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Contact Time</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">{selectedLead.contactTime || "N/A"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Preferred Contact</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">{selectedLead.preferredContact || "N/A"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Conversation Summary</label>
                  <p className="text-sm bg-slate-100 p-3 rounded">{selectedLead.conversationSummary || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Call Date</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">{selectedLead.lastCallDate || "N/A"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Disposition</label>
                    <p className="text-sm bg-slate-100 p-2 rounded">
                      <Badge variant="outline">{selectedLead.lastDisposition || "N/A"}</Badge>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Last Remarks</label>
                  <p className="text-sm bg-slate-100 p-3 rounded">{selectedLead.lastRemarks || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Assigned To</label>
                  <p className="text-sm bg-slate-100 p-2 rounded">
                    <Badge variant="secondary">{selectedLead.assignedTo || "Unassigned"}</Badge>
                  </p>
                </div>

                {selectedLead.callRecordingUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Call Recording</label>
                    <a
                      href={selectedLead.callRecordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block bg-slate-100 p-2 rounded"
                    >
                      Play Latest Recording
                    </a>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isCallHistoryDialogOpen} onOpenChange={setIsCallHistoryDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-900">Call History</DialogTitle>
              <DialogDescription>
                Complete call history for {selectedLead?.name} ({selectedLead?.phone})
              </DialogDescription>
            </DialogHeader>
            {selectedLead && (
              <div className="py-4">
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900">
                    Total Calls: {getCallHistory(selectedLead.id).length}
                  </p>
                </div>
                <div className="space-y-4">
                  {getCallHistory(selectedLead.id).map((call, index) => (
                    <Card key={call.id} className="border-2">
                      <CardHeader className="pb-3 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-semibold text-slate-900">
                            Call #{getCallHistory(selectedLead.id).length - index}
                          </CardTitle>
                          <Badge variant="outline" className="font-mono text-xs">
                            {call.duration}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Call Date & Time</label>
                            <p className="text-sm bg-slate-100 p-2 rounded">{call.callDate}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Disposition</label>
                            <p className="text-sm bg-slate-100 p-2 rounded">
                              <Badge
                                variant="outline"
                                className={
                                  call.disposition === "Interested"
                                    ? "border-green-500 text-green-700 bg-green-50"
                                    : call.disposition === "Not Interested"
                                      ? "border-red-500 text-red-700 bg-red-50"
                                      : "border-yellow-500 text-yellow-700 bg-yellow-50"
                                }
                              >
                                {call.disposition}
                              </Badge>
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <label className="text-xs font-semibold text-slate-600">Remarks</label>
                          <p className="text-sm bg-slate-100 p-3 rounded">{call.remarks}</p>
                        </div>
                        {call.recordingUrl && (
                          <div className="mt-4 space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Recording</label>
                            <a
                              href={call.recordingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm block bg-slate-100 p-2 rounded"
                            >
                              Play Recording
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isSqvDialogOpen} onOpenChange={setIsSqvDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                SQV Verification Details
              </DialogTitle>
              <DialogDescription>
                Squad Voice Quality verification information for the selected lead
              </DialogDescription>
            </DialogHeader>

            {selectedLead && (
              <div className="grid gap-6 py-4">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-green-900">Lead: {selectedLead.name}</p>
                      <p className="text-xs text-green-700">{selectedLead.phone}</p>
                    </div>
                    <Badge className="bg-green-600 text-white font-semibold">
                      {getSqvData(selectedLead.id).verifiedStatus}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      SQV VERIFIED STATUS
                    </label>
                    <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200">
                      <Badge
                        className={
                          getSqvData(selectedLead.id).verifiedStatus === "Yes"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }
                      >
                        {getSqvData(selectedLead.id).verifiedStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">SQV ID</label>
                    <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200">
                      <p className="text-sm font-mono font-bold text-blue-600">
                        {getSqvData(selectedLead.id).sqvId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">SQV OUTCOME STATUS</label>
                  <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200">
                    <Badge variant="outline" className="font-semibold text-base">
                      {getSqvData(selectedLead.id).outcomeStatus}
                    </Badge>
                  </div>
                </div>

                {/* ✅ Fixed Section */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">SQV RECORDING URL</label>
                  <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200">
                    <a
                      href={getSqvData(selectedLead.id).recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-2"
                    >
                      <span className="truncate">{getSqvData(selectedLead.id).recordingUrl}</span>
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded">Play</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">SQV AGENT's DISPOSITION</label>
                    <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200">
                      <Badge variant="secondary" className="font-semibold">
                        {getSqvData(selectedLead.id).agentDisposition}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">SQV AGENT NAME</label>
                    <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200">
                      <p className="text-sm font-semibold text-slate-900">
                        {getSqvData(selectedLead.id).agentName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">SQV AGENT REMARKS</label>
                  <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200">
                    <p className="text-sm text-slate-700">{getSqvData(selectedLead.id).agentRemarks}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">SQV PRIORITY</label>
                  <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200">
                    <Badge
                      className={
                        getSqvData(selectedLead.id).priority === "High"
                          ? "bg-red-600 text-white font-semibold"
                          : getSqvData(selectedLead.id).priority === "Medium"
                            ? "bg-yellow-600 text-white font-semibold"
                            : "bg-green-600 text-white font-semibold"
                      }
                    >
                      {getSqvData(selectedLead.id).priority}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={() => setIsSqvDialogOpen(false)} className="w-full bg-green-600 hover:bg-green-700">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div >
    </DashboardLayout >
  )
}
