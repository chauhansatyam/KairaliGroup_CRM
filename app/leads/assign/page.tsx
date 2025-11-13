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
  Line, // Import Line from recharts
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

  const [dateFilter, setDateFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCallHistoryDialogOpen, setIsCallHistoryDialogOpen] = useState(false)
  const [isSqvDialogOpen, setIsSqvDialogOpen] = useState(false) // Added state for SQV dialog

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
    // Mock SQV data - in production, this would come from your API
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

  const sampleLeads: Lead[] = [
    {
      id: "lead-001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91-9876543210",
      subject: "Ayurvedic Treatment Inquiry",
      notes: "Interested in Panchakarma treatment for 14 days",
      source: "Facebook",
      priority: "high",
      status: "new",
      company: "KTAHV",
      createdAt: new Date().toISOString(),
      ivrUrl: "https://ivr.example.com/recording/001",
      websiteName: "Kairali AHV",
      timestampTranscription: "2025-01-15 10:30 AM",
      userName: "Sadik Rehman",
      userPhone: "+91-9876543211",
      userEmail: "sadik@kairali.com",
      country: "India",
      contactTime: "Morning (9 AM - 12 PM)",
      conversationSummary: "Customer looking for detox and rejuvenation package",
      leadOutcome: "Pending",
      leadCategory: "Treatment",
      preferredContact: "WhatsApp",
      tatBreached: false,
      assignedTo: "Sent Data - Squard Voice - API",
      lastCallDate: "2025-01-15 10:30 AM",
      lastDisposition: "Interested",
      lastRemarks: "Customer wants more information about pricing",
      callRecordingUrl: "https://recordings.example.com/lead-001-latest.mp3",
    },
    {
      id: "lead-002",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91-9876543220",
      subject: "Wellness Retreat Booking",
      notes: "Looking for 7-day wellness retreat with spouse",
      source: "Google",
      priority: "medium",
      status: "new",
      company: "KAPPL",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      ivrUrl: "https://ivr.example.com/recording/002",
      websiteName: "Kairali APPL",
      timestampTranscription: "2025-01-14 02:15 PM",
      userName: "Pawan Kamra",
      userPhone: "+91-9876543212",
      userEmail: "pawan@kairali.com",
      country: "USA",
      contactTime: "Afternoon (12 PM - 5 PM)",
      conversationSummary: "Couple interested in wellness and yoga retreat",
      leadOutcome: "Pending",
      leadCategory: "Wellness",
      preferredContact: "Email",
      tatBreached: false,
      assignedTo: "CommonRedirect",
      lastCallDate: "2025-01-14 02:15 PM",
      lastDisposition: "Call Back",
      lastRemarks: "Requested callback tomorrow morning",
      callRecordingUrl: null,
    },
    {
      id: "lead-003",
      name: "Mohammed Ali",
      email: "mohammed.ali@example.com",
      phone: "+971-501234567",
      subject: "Abhyangam Treatment",
      notes: "Wants to know about traditional Abhyangam massage",
      source: "PriyaSharma AI-WhatsApp",
      priority: "high",
      status: "new",
      company: "VILLARAAG",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      ivrUrl: null,
      websiteName: "Villa Raag",
      timestampTranscription: "2025-01-13 11:45 AM",
      userName: "Pushpanshu Kumar",
      userPhone: "+91-9876543213",
      userEmail: "pushpanshu@kairali.com",
      country: "UAE",
      contactTime: "Evening (5 PM - 8 PM)",
      conversationSummary: "Interested in traditional massage therapy",
      leadOutcome: "Pending",
      leadCategory: "Treatment",
      preferredContact: "Phone",
      tatBreached: true,
      assignedTo: "Sadik Rehman",
      lastCallDate: "2025-01-13 11:45 AM",
      lastDisposition: "Not Interested",
      lastRemarks: "Needs to discuss with family first",
      callRecordingUrl: null,
    },
    {
      id: "lead-004",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+44-7700900123",
      subject: "Yoga and Meditation Retreat",
      notes: "First-time visitor, interested in yoga programs",
      source: "Website",
      priority: "medium",
      status: "new",
      company: "KTAHV",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      ivrUrl: null,
      websiteName: "Kairali AHV",
      timestampTranscription: "2025-01-12 09:20 AM",
      userName: "Harpal Singh",
      userPhone: "+91-9876543214",
      userEmail: "harpal@kairali.com",
      country: "UK",
      contactTime: "Morning (9 AM - 12 PM)",
      conversationSummary: "Looking for beginner-friendly yoga retreat",
      leadOutcome: "Pending",
      leadCategory: "Wellness",
      preferredContact: "Email",
      tatBreached: false,
      assignedTo: "Sadik Rehman",
      lastCallDate: "2025-01-12 09:20 AM",
      lastDisposition: "Interested",
      lastRemarks: "Customer wants more information about pricing",
      callRecordingUrl: "https://recordings.example.com/lead-004-latest.mp3",
    },
    {
      id: "lead-005",
      name: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "+91-9876543230",
      subject: "Ayurvedic Products Purchase",
      notes: "Interested in buying Vasarishtam and Yograj Guggulu",
      source: "PriyaSharma AI-Instagram",
      priority: "low",
      status: "new",
      company: "KAPPL",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      ivrUrl: null,
      websiteName: "Kairali Products",
      timestampTranscription: "2025-01-11 03:30 PM",
      userName: "Puneet Endlay",
      userPhone: "+91-9876543215",
      userEmail: "puneet@kairali.com",
      country: "India",
      contactTime: "Afternoon (12 PM - 5 PM)",
      conversationSummary: "Customer wants to purchase ayurvedic medicines",
      leadOutcome: "Pending",
      leadCategory: "Product",
      preferredContact: "WhatsApp",
      tatBreached: false,
      assignedTo: "Sadik Rehman",
      lastCallDate: "2025-01-11 03:30 PM",
      lastDisposition: "Busy",
      lastRemarks: "Not available, will call back later",
      callRecordingUrl: null,
    },
    {
      id: "lead-006",
      name: "Lisa Chen",
      email: "lisa.chen@example.com",
      phone: "+65-91234567",
      subject: "Detoxification Program",
      notes: "Looking for 21-day detox program with diet consultation",
      source: "Referral",
      priority: "high",
      status: "new",
      company: "VILLARAAG",
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      ivrUrl: "https://ivr.example.com/recording/006",
      websiteName: "Villa Raag",
      timestampTranscription: "2025-01-10 01:15 PM",
      userName: "Sana Albi",
      userPhone: "+91-9876543216",
      userEmail: "sana@kairali.com",
      country: "Singapore",
      contactTime: "Morning (9 AM - 12 PM)",
      conversationSummary: "Referred by previous client, wants comprehensive detox",
      leadOutcome: "Pending",
      leadCategory: "Treatment",
      preferredContact: "Email",
      tatBreached: false,
      assignedTo: "Sent Data - Squard Voice - API",
      lastCallDate: "2025-01-10 01:15 PM",
      lastDisposition: "Interested",
      lastRemarks: "Customer wants more information about pricing",
      callRecordingUrl: "https://recordings.example.com/lead-006-latest.mp3",
    },
    {
      id: "lead-007",
      name: "David Miller",
      email: "david.m@example.com",
      phone: "+1-555-0123",
      subject: "Corporate Wellness Program",
      notes: "Inquiring about group wellness packages for 20 employees",
      source: "IVR",
      priority: "high",
      status: "new",
      company: "KTAHV",
      createdAt: new Date(Date.now() - 518400000).toISOString(),
      ivrUrl: "https://ivr.example.com/recording/007",
      websiteName: "Kairali AHV",
      timestampTranscription: "2025-01-09 10:00 AM",
      userName: "Vidisha Bahukhandi",
      userPhone: "+91-9876543217",
      userEmail: "vidisha@kairali.com",
      country: "USA",
      contactTime: "Evening (5 PM - 8 PM)",
      conversationSummary: "Corporate client looking for team wellness retreat",
      leadOutcome: "Pending",
      leadCategory: "Corporate",
      preferredContact: "Phone",
      tatBreached: true,
      assignedTo: "Sadik Rehman",
      lastCallDate: "2025-01-09 10:00 AM",
      lastDisposition: "No Answer",
      lastRemarks: "Not available, will call back later",
      callRecordingUrl: null,
    },
    {
      id: "lead-008",
      name: "Ananya Reddy",
      email: "ananya.reddy@example.com",
      phone: "+91-9876543240",
      subject: "Spa and Beauty Treatments",
      notes: "Interested in herbal spa treatments and beauty packages",
      source: "PriyaSharma AI-Facebook",
      priority: "medium",
      status: "new",
      company: "KAPPL",
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      ivrUrl: null,
      websiteName: "Kairali APPL",
      timestampTranscription: "2025-01-08 04:45 PM",
      userName: "Zaki Ahmed",
      userPhone: "+91-9876543218",
      userEmail: "zaki@kairali.com",
      country: "India",
      contactTime: "Afternoon (12 PM - 5 PM)",
      conversationSummary: "Looking for spa day package with beauty treatments",
      leadOutcome: "Pending",
      leadCategory: "Spa",
      preferredContact: "WhatsApp",
      tatBreached: false,
      assignedTo: "AHV",
      lastCallDate: "2025-01-08 04:45 PM",
      lastDisposition: "Interested",
      lastRemarks: "Customer wants more information about pricing",
      callRecordingUrl: null,
    },
    {
      id: "lead-009",
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+61-412345678",
      subject: "Ayurvedic Consultation",
      notes: "Wants online consultation for chronic back pain",
      source: "Online Booking Engine",
      priority: "medium",
      status: "new",
      company: "VILLARAAG",
      createdAt: new Date(Date.now() - 691200000).toISOString(),
      ivrUrl: null,
      websiteName: "Villa Raag",
      timestampTranscription: "2025-01-07 11:30 AM",
      userName: "Sadik Rehman",
      userPhone: "+91-9876543211",
      userEmail: "sadik@kairali.com",
      country: "Australia",
      contactTime: "Morning (9 AM - 12 PM)",
      conversationSummary: "Patient seeking ayurvedic treatment for back pain",
      leadOutcome: "Pending",
      leadCategory: "Consultation",
      preferredContact: "Video Call",
      tatBreached: false,
      assignedTo: "Sent Data - Squard Voice - API",
      lastCallDate: "2025-01-07 11:30 AM",
      lastDisposition: "Call Back",
      lastRemarks: "Requested callback tomorrow morning",
      callRecordingUrl: null,
    },
    {
      id: "lead-010",
      name: "Meera Nair",
      email: "meera.nair@example.com",
      phone: "+91-9876543250",
      subject: "Monsoon Wellness Package",
      notes: "Interested in Neo Monsoon Offer for family of 4",
      source: "Site Exit Pop-Up Reference",
      priority: "low",
      status: "new",
      company: "KTAHV",
      createdAt: new Date(Date.now() - 777600000).toISOString(),
      ivrUrl: null,
      websiteName: "Kairali AHV",
      timestampTranscription: "2025-01-06 02:00 PM",
      userName: "Pawan Kamra",
      userPhone: "+91-9876543212",
      userEmail: "pawan@kairali.com",
      country: "India",
      contactTime: "Afternoon (12 PM - 5 PM)",
      conversationSummary: "Family looking for monsoon special package",
      leadOutcome: "Pending",
      leadCategory: "Package",
      preferredContact: "Phone",
      tatBreached: false,
      assignedTo: "Sent Data - Squard Voice - API",
      lastCallDate: "2025-01-06 02:00 PM",
      lastDisposition: "Interested",
      lastRemarks: "Customer wants more information about pricing",
      callRecordingUrl: null,
    },
  ]

  useEffect(() => {
    if (user && !selectedCompany) {
      setSelectedCompany(user.company || "KTAHV")
    }
  }, [user, selectedCompany])

  useEffect(() => {
    if (!isLoading && (!user || !hasPermission("leads.assign"))) {
      router.push("/dashboard")
    }
  }, [user, isLoading, hasPermission, router])

  useEffect(() => {
    if (!selectedCompany) return

    const allLeads = [...leads, ...sampleLeads]

    const filtered = allLeads.filter((lead) => lead.company === selectedCompany)
    setUnassignedLeads(filtered)
  }, [leads, selectedCompany])

  useEffect(() => {
    let filtered = unassignedLeads
    console.log("[v0] Starting with unassigned leads:", filtered.length)

    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.createdAt)

        switch (dateFilter) {
          case "today":
            return leadDate >= today
          case "yesterday":
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            return leadDate >= yesterday && leadDate < today
          case "this_week":
            const weekStart = new Date(today)
            weekStart.setDate(weekStart.getDate() - weekStart.getDay())
            return leadDate >= weekStart
          case "this_month":
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            return leadDate >= monthStart
          case "custom":
            if (customDateRange.start && customDateRange.end) {
              const start = new Date(customDateRange.start)
              const end = new Date(customDateRange.end)
              return leadDate >= start && leadDate <= end
            }
            return true
          default:
            return true
        }
      })
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm) ||
          lead.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((lead) => lead.priority === priorityFilter)
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.source === sourceFilter)
    }

    // Urgency filter
    if (urgencyFilter !== "all") {
      filtered = filtered.filter((lead) => {
        const isUrgent = lead.priority === "high" || lead.tatBreached
        return urgencyFilter === "yes" ? isUrgent : !isUrgent
      })
    }

    if (assignToFilter !== "all") {
      filtered = filtered.filter((lead) => lead.assignedTo === assignToFilter)
    }

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField as keyof Lead]
        let bValue = b[sortField as keyof Lead]

        if (typeof aValue === "string") aValue = aValue.toLowerCase()
        if (typeof bValue === "string") bValue = bValue.toLowerCase()

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    console.log("[v0] Final filtered leads for table:", filtered.length)
    setFilteredLeads(filtered)
  }, [
    unassignedLeads,
    searchTerm,
    priorityFilter,
    sourceFilter,
    urgencyFilter,
    assignToFilter,
    sortField,
    sortDirection,
    dateFilter,
    customDateRange,
  ])

  const salesAgents = getAllUsers().filter(
    (u) =>
      (u.role === "sales_agent" || u.role === "sales_manager") &&
      u.isActive &&
      (user?.permissions.includes("all") || u.company === user?.company),
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

  const dataSourceBreakdown = [
    "Facebook",
    "Google",
    "PriyaSharma AI-Web",
    "PriyaSharma AI-WhatsApp",
    "Website",
    "Site Exit Pop-Up Reference",
    "Others",
    "PriyaSharma AI-Instagram",
    "PriyaSharma AI Chat",
    "Referral",
    "Zopim",
    "IVR",
    "Magento Failure Order",
    "OTA",
    "Online Booking Engine",
    "Management",
    "PriyaSharma AI-Facebook",
  ].map((source) => {
    const sourceLeads = leads.filter(
      (lead) =>
        (lead.source === source || lead.source.toLowerCase() === source.toLowerCase()) &&
        lead.company === selectedCompany,
    )
    const totalLeads = sourceLeads.length
    const nbdLeads = Math.floor(totalLeads * 0.6) // Mock NBD data
    const crrLeads = totalLeads - nbdLeads // Mock CRR data
    const growth = (Math.random() * 30 - 10).toFixed(1) // Mock growth percentage

    const convertedCount = Math.floor(totalLeads * (0.15 + Math.random() * 0.25)) // 15-40% conversion rate
    const conversionAmount = convertedCount * (50000 + Math.random() * 150000) // Random amount per conversion
    const conversionPercentage = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(2) : "0.00"
    const adSpend = totalLeads * (500 + Math.random() * 1500) // Mock ad spend per lead
    const roas = adSpend > 0 ? (conversionAmount / adSpend).toFixed(2) : "0.00"

    return {
      dataSource: source,
      totalLeads,
      nbd: nbdLeads,
      crrLeads,
      growth: Number.parseFloat(growth),
      convertedCount,
      conversionAmount,
      conversionPercentage: Number.parseFloat(conversionPercentage),
      spendAmount: adSpend,
      roas: Number.parseFloat(roas),
    }
  })

  const sortedDataSourceBreakdown = [...dataSourceBreakdown].sort((a, b) => {
    if (!dataSourceSortField) return 0

    let aValue = a[dataSourceSortField as keyof typeof a]
    let bValue = b[dataSourceSortField as keyof typeof b]

    if (typeof aValue === "string") aValue = aValue.toLowerCase()
    if (typeof bValue === "string") bValue = bValue.toLowerCase()

    if (aValue < bValue) return dataSourceSortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return dataSourceSortDirection === "asc" ? 1 : -1
    return 0
  })

  const grandTotal = {
    totalLeads: sortedDataSourceBreakdown.reduce((sum, item) => sum + item.totalLeads, 0),
    nbd: sortedDataSourceBreakdown.reduce((sum, item) => sum + item.nbd, 0),
    crrLeads: sortedDataSourceBreakdown.reduce((sum, item) => sum + item.crrLeads, 0),
    avgGrowth: (
      sortedDataSourceBreakdown.reduce((sum, item) => sum + item.growth, 0) / sortedDataSourceBreakdown.length
    ).toFixed(1),
    convertedCount: sortedDataSourceBreakdown.reduce((sum, item) => sum + item.convertedCount, 0),
    conversionAmount: sortedDataSourceBreakdown.reduce((sum, item) => sum + item.conversionAmount, 0),
    avgConversionPercentage: (
      sortedDataSourceBreakdown.reduce((sum, item) => sum + item.conversionPercentage, 0) /
      sortedDataSourceBreakdown.length
    ).toFixed(2),
    spendAmount: sortedDataSourceBreakdown.reduce((sum, item) => sum + item.spendAmount, 0),
    avgRoas: (
      sortedDataSourceBreakdown.reduce((sum, item) => sum + item.roas, 0) / sortedDataSourceBreakdown.length
    ).toFixed(2),
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || !hasPermission("leads.assign")) {
    return null
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

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
                  className={`flex-1 font-semibold text-base py-6 ${
                    selectedCompany === company
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {company}
                </Button>
              ))}
            </div>

            {/* Date Filter and Search */}
            <div className="grid gap-4 md:grid-cols-6 mb-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Filter
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateFilter === "custom" && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Date</label>
                    <Input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className={dateFilter === "custom" ? "md:col-span-2" : "md:col-span-4"}>
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
            <div className="grid gap-4 md:grid-cols-5">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
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
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
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
                  <SelectItem value="all">All Agents</SelectItem>
                  {salesAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setPriorityFilter("all")
                  setSourceFilter("all")
                  setUrgencyFilter("all")
                  setAssignToFilter("all")
                  setDateFilter("all")
                  setCustomDateRange({ start: "", end: "" })
                  setSortField("")
                  setSortDirection("asc")
                }}
                className="w-full"
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
          {/* First Line - 6 boxes */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Unique Lead Received</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+12%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {leads.filter((l) => l.company === selectedCompany).length}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-medium">NBD: 45 (+8%)</span>
                <span className="text-red-600 font-medium">CRR: 23 (-3%)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfer to Dialer</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+8%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-medium">NBD: 134 (+15%)</span>
                <span className="text-green-600 font-medium">CRR: 100 (+5%)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Transfer to SQV</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+12%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">156</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-medium">NBD: 92 (+18%)</span>
                <span className="text-green-600 font-medium">CRR: 64 (+8%)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfer to Appsheet</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">+15%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-medium">NBD: 52 (+10%)</span>
                <span className="text-red-600 font-medium">CRR: 37 (-2%)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfer to Delete Sheet</CardTitle>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-500">-3%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-600 font-medium">NBD: 28 (-5%)</span>
                <span className="text-red-600 font-medium">CRR: 17 (-8%)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Unassign (Pending To Transfer)</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{filteredLeads.length}</div>
            </CardContent>
          </Card>
        </div>

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
                {Math.floor(leads.filter((l) => l.company === selectedCompany).length * 0.25)}
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
                ₹
                {(Math.floor(leads.filter((l) => l.company === selectedCompany).length * 0.25) * 85000).toLocaleString(
                  "en-IN",
                )}
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
                {(
                  (Math.floor(leads.filter((l) => l.company === selectedCompany).length * 0.25) /
                    leads.filter((l) => l.company === selectedCompany).length) *
                  100
                ).toFixed(1)}
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
                ₹
                {(Math.floor(leads.filter((l) => l.company === selectedCompany).length * 0.25) * 2500).toLocaleString(
                  "en-IN",
                )}
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
                {(
                  (Math.floor(leads.filter((l) => l.company === selectedCompany).length * 0.25) * 85000) /
                  (Math.floor(leads.filter((l) => l.company === selectedCompany).length * 0.25) * 2500)
                ).toFixed(2)}
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Data Source Breakdown - Total Unique Lead Received ({selectedCompany})</CardTitle>
              <CardDescription>Analyze lead performance across different data sources</CardDescription>
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
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("crrLeads")}>
                        <div className="flex items-center gap-2">
                          CRR
                          {renderDataSourceSortIcon("crrLeads")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("growth")}>
                        <div className="flex items-center gap-2">
                          Growth
                          {renderDataSourceSortIcon("growth")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("convertedCount")}>
                        <div className="flex items-center gap-2">
                          Converted Count
                          {renderDataSourceSortIcon("convertedCount")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("conversionAmount")}>
                        <div className="flex items-center gap-2">
                          Conversion Amount
                          {renderDataSourceSortIcon("conversionAmount")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleDataSourceSort("conversionPercentage")}
                      >
                        <div className="flex items-center gap-2">
                          Conversion %{renderDataSourceSortIcon("conversionPercentage")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("spendAmount")}>
                        <div className="flex items-center gap-2">
                          Spend Amount
                          {renderDataSourceSortIcon("spendAmount")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleDataSourceSort("roas")}>
                        <div className="flex items-center gap-2">
                          ROAS
                          {renderDataSourceSortIcon("roas")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDataSourceBreakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.dataSource}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-semibold">
                            {item.totalLeads}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600 font-medium">{item.nbd}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-orange-600 font-medium">{item.crrLeads}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {item.growth >= 0 ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 font-medium">+{item.growth}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4 text-red-500" />
                                <span className="text-red-600 font-medium">{item.growth}%</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800 font-semibold">
                            {item.convertedCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-purple-600 font-semibold">
                            ₹{item.conversionAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.conversionPercentage >= 30
                                ? "border-green-500 text-green-700 bg-green-50"
                                : item.conversionPercentage >= 20
                                  ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                  : "border-red-500 text-red-700 bg-red-50"
                            }
                          >
                            {item.conversionPercentage}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-indigo-600 font-semibold">
                            ₹{item.spendAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span
                              className={`font-bold ${item.roas >= 3 ? "text-green-600" : item.roas >= 2 ? "text-yellow-600" : "text-red-600"}`}
                            >
                              {item.roas}x
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <TableCell className="font-bold text-slate-900">Grand Total</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold bg-slate-200 text-slate-900">
                          {grandTotal.totalLeads}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-700 font-bold">{grandTotal.nbd}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-orange-700 font-bold">{grandTotal.crrLeads}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Number.parseFloat(grandTotal.avgGrowth) >= 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-green-700 font-bold">+{grandTotal.avgGrowth}%</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              <span className="text-red-700 font-bold">{grandTotal.avgGrowth}%</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-200 text-green-900 font-bold">
                          {grandTotal.convertedCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-purple-700 font-bold">
                          ₹{grandTotal.conversionAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-400 text-slate-900 bg-slate-50 font-bold">
                          {grandTotal.avgConversionPercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-indigo-700 font-bold">
                          ₹{grandTotal.spendAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-900 font-bold">{grandTotal.avgRoas}x</span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs defaultValue="leads" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
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
                      value="conversion"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all px-4 py-3"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-medium">Conversion</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="revenue"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all px-4 py-3"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs font-medium">Revenue</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="spend"
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all px-4 py-3"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span className="text-xs font-medium">Spend & ROAS</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="comparison"
                      className="data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all px-4 py-3"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <LineChart className="h-4 w-4" />
                        <span className="text-xs font-medium">Comparison</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="leads" className="h-[600px] mt-6">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {/* Main Chart */}
                      <div className="col-span-2 h-[280px] border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
                        <h3 className="text-sm font-semibold mb-3 text-blue-900">Lead Distribution Overview</h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={sortedDataSourceBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={100} fontSize={11} />
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
                            <Bar dataKey="nbd" fill="#10b981" name="NBD" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="crrLeads" fill="#f59e0b" name="CRR" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Converted Count Chart */}
                      <div className="h-[280px] border rounded-lg p-4 bg-gradient-to-br from-green-50 to-white">
                        <h3 className="text-sm font-semibold mb-3 text-green-900">Converted Leads</h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={sortedDataSourceBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={100} fontSize={10} />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="convertedCount" fill="#22c55e" name="Converted" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Conversion Percentage Chart */}
                      <div className="h-[280px] border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white">
                        <h3 className="text-sm font-semibold mb-3 text-purple-900">Conversion Rate</h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sortedDataSourceBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={100} fontSize={10} />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                              }}
                              formatter={(value: number) => `${value}%`}
                            />
                            <Line
                              type="monotone"
                              dataKey="conversionPercentage"
                              stroke="#a855f7"
                              strokeWidth={3}
                              name="Conv %"
                              dot={{ fill: "#a855f7", r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="conversion" className="h-[600px] mt-6">
                    <div className="border rounded-lg p-4 h-full bg-gradient-to-br from-green-50 to-white">
                      <h3 className="text-sm font-semibold mb-3 text-green-900">Conversion Metrics Analysis</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={sortedDataSourceBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={120} fontSize={12} />
                          <YAxis yAxisId="left" stroke="#22c55e" />
                          <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="convertedCount"
                            fill="#22c55e"
                            name="Converted Count"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="conversionPercentage"
                            fill="#8b5cf6"
                            name="Conversion %"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="revenue" className="h-[600px] mt-6">
                    <div className="border rounded-lg p-4 h-full bg-gradient-to-br from-purple-50 to-white">
                      <h3 className="text-sm font-semibold mb-3 text-purple-900">Revenue Analysis</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={sortedDataSourceBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={120} fontSize={12} />
                          <YAxis stroke="#a855f7" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value: number) =>
                              `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                            }
                          />
                          <Legend />
                          <Bar
                            dataKey="conversionAmount"
                            fill="#a855f7"
                            name="Conversion Amount (₹)"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="spend" className="h-[600px] mt-6">
                    <div className="border rounded-lg p-4 h-full bg-gradient-to-br from-indigo-50 to-white">
                      <h3 className="text-sm font-semibold mb-3 text-indigo-900">Spend & ROAS Performance</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={sortedDataSourceBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={120} fontSize={12} />
                          <YAxis yAxisId="left" stroke="#6366f1" />
                          <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value: number, name: string) => {
                              if (name === "Spend Amount (₹)") {
                                return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                              }
                              return `${value}x`
                            }}
                          />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="spendAmount"
                            stroke="#6366f1"
                            name="Spend Amount (₹)"
                            strokeWidth={3}
                            dot={{ fill: "#6366f1", r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="roas"
                            stroke="#f59e0b"
                            name="ROAS"
                            strokeWidth={3}
                            dot={{ fill: "#f59e0b", r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="comparison" className="h-[600px] mt-6">
                    <div className="border rounded-lg p-4 h-full bg-gradient-to-br from-amber-50 to-white">
                      <h3 className="text-sm font-semibold mb-3 text-amber-900">Multi-Metric Comparison</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={sortedDataSourceBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="dataSource" angle={-45} textAnchor="end" height={120} fontSize={12} />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="totalLeads"
                            stroke="#3b82f6"
                            name="Total Leads"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="convertedCount"
                            stroke="#22c55e"
                            name="Converted"
                            strokeWidth={3}
                            dot={{ fill: "#22c55e", r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="growth"
                            stroke="#ef4444"
                            name="Growth %"
                            strokeWidth={3}
                            dot={{ fill: "#ef4444", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>

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
                          key={lead.id}
                          className={`${lead.tatBreached ? "bg-red-50 hover:bg-red-100" : index % 2 === 0 ? "bg-white hover:bg-slate-50" : "bg-slate-50/50 hover:bg-slate-100"} transition-colors`}
                        >
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(lead.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs font-semibold text-blue-600">
                            {lead.id.slice(-8)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{lead.name}</div>
                            {lead.tatBreached && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                TAT Breach
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-medium">{lead.phone}</TableCell>
                          <TableCell className="whitespace-nowrap">{lead.email}</TableCell>
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.subject || "N/A"}>
                              {lead.subject || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.notes || "N/A"}>
                              {lead.notes || "N/A"}
                            </div>
                          </TableCell>
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
                          <TableCell className="whitespace-nowrap">{lead.websiteName || "N/A"}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="secondary" className="capitalize text-xs font-medium">
                              {lead.source.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            {lead.timestampTranscription || "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="outline" className="text-xs font-semibold">
                              {lead.company}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{lead.userName || "N/A"}</TableCell>
                          <TableCell className="whitespace-nowrap">{lead.userPhone || "N/A"}</TableCell>
                          <TableCell className="whitespace-nowrap">{lead.userEmail || "N/A"}</TableCell>
                          <TableCell className="whitespace-nowrap font-medium">{lead.country || "N/A"}</TableCell>
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
                              {lead.priority.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              variant={lead.priority === "high" || lead.tatBreached ? "destructive" : "secondary"}
                              className="font-semibold"
                            >
                              {lead.priority === "high" || lead.tatBreached ? "YES" : "NO"}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{lead.contactTime || "N/A"}</TableCell>
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.conversationSummary || "N/A"}>
                              {lead.conversationSummary || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{lead.leadOutcome || "N/A"}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="outline" className="font-medium">
                              {lead.leadCategory || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{lead.preferredContact || "N/A"}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="secondary" className="font-medium">
                              {lead.assignedTo || "Unassigned"}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">{lead.lastCallDate || "N/A"}</TableCell>
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
                          <TableCell className="max-w-40">
                            <div className="truncate" title={lead.lastRemarks || "N/A"}>
                              {lead.lastRemarks || "N/A"}
                            </div>
                          </TableCell>
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

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
                    <div className="text-sm text-muted-foreground">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeads.length)} of{" "}
                      {filteredLeads.length} leads
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
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
              <DialogDescription>Squad Voice Quality verification information for the selected lead</DialogDescription>
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
                      <p className="text-sm font-mono font-bold text-blue-600">{getSqvData(selectedLead.id).sqvId}</p>
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
                      <p className="text-sm font-semibold text-slate-900">{getSqvData(selectedLead.id).agentName}</p>
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
      </div>
    </DashboardLayout>
  )
}
