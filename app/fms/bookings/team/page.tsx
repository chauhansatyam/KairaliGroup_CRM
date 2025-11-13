"use client"

import { useState } from "react"
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
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  Building,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  RefreshCw,
  Upload,
  ExternalLink,
  Shield,
  XCircle,
} from "lucide-react"

interface Booking {
  id: string
  bookingId: string
  guestName: string
  checkIn: string
  checkOut: string
  roomType: string
  roomNumber: string
  programmeName: string
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

// Sample data with enhanced booking information
const sampleBookings: Booking[] = [
  {
    id: "1",
    bookingId: "KRL2024001",
    guestName: "MRS. YAMUNA BOLLINENI",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    roomType: "Deluxe Villa",
    roomNumber: "DV-101",
    programmeName: "Panchakarma Therapy",
    amount: 155650,
    receivedAmount: 155650,
    approvedTillDate: "2024-01-14",
    status: "confirmed",
    assignedTo: "Pushpanshu Kumar",
    team: "sales",
    createdDate: "2024-01-10",
    lastUpdated: "2024-01-12",
    source: "Direct Booking",
    paymentStatus: "paid",
    salesTeamStatus: "completed",
    accountsVerifyStatus: "payment_verified",
    frontOfficeStatus: "pms_verified_done",
    paymentSettlementStatus: "full_payment_received",
    mobile: "9849996851",
    email: "yamuna@example.com",
    receivedPercentage: 100,
    salesperson: "Pushpanshu Kumar",
    contactNumber: "9849996851",
    totalAmount: "155650",
    paidAmount: "155650",
  },
  {
    id: "2",
    bookingId: "KRL2024002",
    guestName: "MR. RAJESH SHARMA",
    checkIn: "2024-01-20",
    checkOut: "2024-01-25",
    roomType: "Premium Suite",
    roomNumber: "PS-205",
    programmeName: "Rejuvenation Package",
    amount: 89500,
    receivedAmount: 45000,
    approvedTillDate: "2024-01-19",
    status: "payment_pending",
    assignedTo: "Harpal Singh",
    team: "accounts",
    createdDate: "2024-01-12",
    lastUpdated: "2024-01-15",
    source: "Online Portal",
    paymentStatus: "partial",
    salesTeamStatus: "in_progress",
    accountsVerifyStatus: "under_review",
    frontOfficeStatus: "processing",
    paymentSettlementStatus: "partial_payment",
    mobile: "9849996851",
    email: "rajesh@example.com",
    receivedPercentage: 50,
    salesperson: "Harpal Singh",
    contactNumber: "9849996851",
    totalAmount: "89500",
    paidAmount: "45000",
  },
  {
    id: "3",
    bookingId: "KRL2024003",
    guestName: "MS. PRIYA PATEL",
    checkIn: "2024-02-01",
    checkOut: "2024-02-05",
    roomType: "Standard Room",
    roomNumber: "SR-302",
    programmeName: "Wellness Retreat",
    amount: 67800,
    receivedAmount: 0,
    approvedTillDate: "2024-01-31",
    status: "cancelled",
    assignedTo: "Pawan Kamra",
    team: "sales",
    createdDate: "2024-01-18",
    lastUpdated: "2024-01-20",
    source: "Travel Agent",
    paymentStatus: "cancelled",
    salesTeamStatus: "on_hold",
    accountsVerifyStatus: "booking_cancelled",
    frontOfficeStatus: "booking_cancelled",
    paymentSettlementStatus: "booking_cancelled",
    mobile: "9849996851",
    email: "priya@example.com",
    receivedPercentage: 0,
    salesperson: "Pawan Kamra",
    contactNumber: "9849996851",
    totalAmount: "67800",
    paidAmount: "0",
  },
  {
    id: "4",
    bookingId: "KRL2024004",
    guestName: "DR. AMIT KUMAR",
    checkIn: "2024-02-10",
    checkOut: "2024-02-14",
    roomType: "Executive Suite",
    roomNumber: "ES-401",
    programmeName: "Detox Program",
    amount: 125000,
    receivedAmount: 62500,
    approvedTillDate: "2024-02-09",
    status: "confirmed",
    assignedTo: "Sadik Rehman",
    team: "accounts",
    createdDate: "2024-01-25",
    lastUpdated: "2024-01-28",
    source: "Corporate Booking",
    paymentStatus: "partial",
    salesTeamStatus: "completed",
    accountsVerifyStatus: "approval_verified",
    frontOfficeStatus: "pms_verified_done",
    paymentSettlementStatus: "partial_payment",
    mobile: "9849996851",
    email: "amit@example.com",
    receivedPercentage: 50,
    salesperson: "Sadik Rehman",
    contactNumber: "9849996851",
    totalAmount: "125000",
    paidAmount: "62500",
  },
  {
    id: "15",
    bookingId: "KTAHV-PMS-6715",
    guestName: "Rajesh Kumar",
    checkIn: "2024-01-20",
    checkOut: "2024-01-27",
    roomType: "Deluxe Room",
    roomNumber: "205",
    programmeName: "Panchakarma Treatment",
    amount: 45000,
    receivedAmount: 15000,
    approvedTillDate: "2024-01-18",
    status: "auto_release",
    assignedTo: "Priya Sharma",
    team: "sales",
    createdDate: "2024-01-15",
    lastUpdated: "2024-01-18",
    source: "Website",
    paymentStatus: "partial",
    salesTeamStatus: "completed",
    accountsVerifyStatus: "pending",
    frontOfficeStatus: "pending",
    paymentSettlementStatus: "partial_payment",
    mobile: "+91 9876543210",
    email: "rajesh.kumar@email.com",
    receivedPercentage: 33,
    salesperson: "Priya Sharma",
    contactNumber: "+91 9876543210",
    totalAmount: "45000",
    paidAmount: "15000",
  },
  {
    id: "16",
    bookingId: "KTAHV-PMS-6716",
    guestName: "Meera Nair",
    checkIn: "2024-01-22",
    checkOut: "2024-01-29",
    roomType: "Premium Suite",
    roomNumber: "301",
    programmeName: "Rejuvenation Package",
    amount: 65000,
    receivedAmount: 20000,
    approvedTillDate: "2024-01-20",
    status: "auto_release",
    assignedTo: "Amit Singh",
    team: "accounts",
    createdDate: "2024-01-17",
    lastUpdated: "2024-01-20",
    source: "Facebook",
    paymentStatus: "partial",
    salesTeamStatus: "in_progress",
    accountsVerifyStatus: "under_review",
    frontOfficeStatus: "pending",
    paymentSettlementStatus: "partial_payment",
    mobile: "+91 8765432109",
    email: "meera.nair@email.com",
    receivedPercentage: 31,
    salesperson: "Amit Singh",
    contactNumber: "+91 8765432109",
    totalAmount: "65000",
    paidAmount: "20000",
  },
  {
    id: "17",
    bookingId: "KTAHV-PMS-6717",
    guestName: "Vikram Patel",
    checkIn: "2024-01-25",
    checkOut: "2024-02-01",
    roomType: "Standard Room",
    roomNumber: "102",
    programmeName: "Stress Relief Program",
    amount: 35000,
    receivedAmount: 10000,
    approvedTillDate: "2024-01-23",
    status: "auto_release",
    assignedTo: "Neha Gupta",
    team: "sales",
    createdDate: "2024-01-20",
    lastUpdated: "2024-01-23",
    source: "PPC",
    paymentStatus: "partial",
    salesTeamStatus: "on_hold",
    accountsVerifyStatus: "pending",
    frontOfficeStatus: "pending",
    paymentSettlementStatus: "partial_payment",
    mobile: "+91 7654321098",
    email: "vikram.patel@email.com",
    receivedPercentage: 29,
    salesperson: "Neha Gupta",
    contactNumber: "+91 7654321098",
    totalAmount: "35000",
    paidAmount: "10000",
  },
]

export default function SalesAccountsTeamPage() {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [teamFilter, setTeamFilter] = useState<string>("all")
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

  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [selectedBookingForApproval, setSelectedBookingForApproval] = useState<Booking | null>(null)
  const [approvalData, setApprovalData] = useState({
    approvedBy: "",
    approveTillDate: "",
    screenshot: null as File | null,
    remarks: "",
    uploadedBy: "",
  })

  const [showViewModal, setShowViewModal] = useState(false)
  const [viewBookingData, setViewBookingData] = useState<any>(null)

  const [showAccountsVerifyModal, setShowAccountsVerifyModal] = useState(false)
  const [selectedBookingForAccounts, setSelectedBookingForAccounts] = useState<Booking | null>(null)
  const [accountsVerifyData, setAccountsVerifyData] = useState({
    paymentReceivedStatus: "",
    actualReceivedAmount: "",
    remarks: "",
  })

  const [showFOPMSVerifyModal, setFOPMSVerifyModal] = useState(false)
  const [selectedBookingForFOPMS, setSelectedBookingForFOPMS] = useState<Booking | null>(null)
  const [foPMSVerifyData, setFoPMSVerifyData] = useState({
    releasePassActionStatus: "",
    pmsBlockStatus: "",
    informedToBookingPerson: "",
    remarks: "",
  })

  const [showCheckoutVerifyModal, setShowCheckoutVerifyModal] = useState(false)
  const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState<Booking | null>(null)
  const [checkoutVerifyData, setCheckoutVerifyData] = useState({
    paymentReceivedStatus: "",
    remarks: "",
  })

  const employeeList = [
    "Abhilash Sir",
    "Abishek Sir",
    "Ajay",
    "Ambuj",
    "Anuj Kumar Singh",
    "Arham",
    "Arul",
    "Balakrishna",
    "Dr Gokul",
    "Gaurav PPC",
    "Hariharan",
    "Himanshu",
    "KAC Order Taker",
    "Kavita",
    "Krithika",
    "Mahesh",
    "Manonmani",
    "Nagendran",
    "Pawan Kamra",
    "Puneet Endlay",
    "Pushpanshu Kumar",
    "Rajendra Kumar",
    "Rajesh Arora",
    "RAVINDRAN B",
    "Ritu Chawla",
    "Sadik Rehman",
    "SAILESH KUMAR VERMA",
    "Sakthivel S",
    "Sanjay Yadav",
    "SATISH CHANDRA GANGWAR",
    "Sini Nair",
    "Smita Ghai",
    "Sony Cherian",
    "Sunaj Sahoo",
    "S K THAKUR",
    "Thangarasu",
    "Vikash",
    "VINAYAK PANDURANGA AMBI",
    "Yuvaraj",
    "Rima Sarkar",
    "Shristi Sharma",
    "Sandeep Uniyal",
    "Mamta Kandhari",
    "Samsher Alam",
    "Gaurav Saraswat",
    "Vikesh Kumar",
    "Ravinder Kaur",
    "Bhawna Pokhriya",
    "Priyanka Yadav",
    "Geethanjali",
    "Bhuvaneshwari",
    "Vigneshkumar",
    "Krithika(Direct Task Score)",
    "Hariharan(Direct Task Score)",
    "Suriya Prakash",
    "Abhinav Sood",
    "Mathi Sekar",
    "Gita Mam",
    "KV Ramesh Sir",
    "Suresh Kumar c",
    "Karan Pahuja",
    "Yogendra",
    "Ajay Bobby Mathew",
    "Dr.Shari K",
    "Anil Faridabad Centre",
    "Gopesh",
    "Biju Rajakumaran",
    "Saba Khanam",
    "Dr. Jinky Krishnan",
    "Shibu Varghees",
    "Sunaina Bali",
    "Sajeevan K",
    "kiran Raj",
    "Manoj Kumar",
    "Biju.R",
    "Prakasan M",
    "Janardhanan M",
    "Gopi S",
    "Renuka K",
    "Sindhu V A",
    "Usha Kumari R",
    "Anilkumar C B",
    "Abilash A",
    "Sujith S",
    "Sivadas S",
    "Rohit Bafana",
    "Dr Deepu John",
    "Anoop Vijayaraj",
    "Arvind Maurya",
    "Hemant Gaur",
    "NANDHAKUMAR",
    "Abid Hussain",
    "Sheeba Dieudonne",
    "Muthukumara Raja",
    "Rajitha V",
    "N. Santhosh",
    "Jobin Abraham",
    "Manikandan K",
    "Girish Chaturvedi",
    "Ashok Sharma",
    "Sreehari R",
    "Sameer Anand",
    "Vijay Kumar",
    "Neelam",
    "Umesh Kumar",
    "Yukti Arora",
    "Deepak Arya",
    "Manoj Nair FOM",
    "Vibin S",
    "Nisha G",
    "Vikram Sain",
    "Anil K",
    "Silpa Sasi",
    "Vidisha Bahukhandi",
    "Dhaneshwar Chaturvedi",
    "Varun Chauhan",
    "Anju S",
    "Ajitha.C",
    "Devadas",
    "Manju S",
    "Remya M",
    "Sheeja R",
    "Sudhakaran T",
    "Santha C",
    "Deepthish K R",
    "Kaladharan",
    "Radha V",
    "Thangamani",
    "Kumaran.K",
    "Pankajam",
    "Renuka C",
    "Sanju U",
    "Harpal Singh",
    "Satyam Kumar",
    "KEERTHIKA DEVI",
    "Sanoj M",
    "Sarath R",
    "Dr. Rahul R",
    "Rahul Srivastava",
    "Krishnapriya K",
    "Lineesh N",
    "Mahesh K",
    "Kiran Prasad",
    "Kavita Mahawar",
    "Sonu",
    "Saju",
    "Sabareesan S",
    "Sandeep Kumar",
    "Mona Walia",
    "Tanisha Kataria",
    "Tapswani Nandan Sharma",
    "Suneel Kumar",
    "Yasil K",
    "Athulkrishna K",
    "Jayan P C",
    "UDHAYANANDHINI A",
    "Kavita (PC)",
    "Chandraprakash Parashar",
    "Nithin M",
    "Karan Pahuja (PC)",
    "Visakh R",
    "Deepratan Bande",
    "Arun",
    "Kamal Sharma",
    "Munisha",
    "AJAY SINGH RAWAT",
    "Poonam",
    "Priyanka Murugeshan",
    "Shristi",
    "Neelam Ishrani",
    "Dharmender",
    "Meena Mathur",
    "Bajrang",
    "Ajay Bobby",
    "Dr. Shari K",
    "Dr Anjana Krishnardra K",
    "Supriya Rajesh Kumar",
    "Raj Kumar",
    "Subir",
    "Masaba",
    "Naveen",
    "Amrita",
    "Dr Aiswarya N K Nair",
    "Anurag Dilip Sarkar",
    "Roshni A John",
    "Nilu",
    "Dr Sachin",
    "Ratheesh K R",
    "Sana Albi",
    "Sivasubramaniyam",
    "Saravanakumar",
    "Dhamodharan",
    "Dinesh Kumar",
    "Sabariraj M",
    "Balamurugan B",
    "Vijay Kumar V",
    "Jayan",
    "Ashin M",
    "Birender Singh Chauhan",
    "Rahul Kumar Gupta",
    "Kartik Jain",
    "Anjana Sharma",
    "Priya Sharma - AI",
    "Vyshakh K",
    "Sruthi C",
    "Rahul Raj P R",
    "Avnish Kumar Dubey",
    "Ashikha Raj",
    "Santhosh",
    "Arvind Kumar Thakur",
    "Tikam Chand Ashrani",
    "Zaki Ahmed",
    "Sharat",
    "Mayank Shekhar",
    "Snehal Narendra Mehta",
    "Astha Kumari",
    "Himanshu Kumar",
    "Anupam Singh Molpha",
    "Bonny Thomas",
    "Sajeev K",
    "Shyamdas S",
    "Pradeep Gond",
    "Deepu Sahani",
    "Sathish Kumar S",
    "Pradyumna Kumar Behera",
    "Dr. Akhila Oommen",
    "Kishore K",
    "Jayendra Singh",
    "Sujit Gautam",
    "Vishnudas S",
    "Chithra C",
    "Ravi Shankar Govindu",
    "Kamal",
    "Karthik Kumar",
    "Selvaraj T",
    "Divya Sharma",
    "Madhusudan Mandal",
    "Aakash",
    "Vishnu Prasad S",
    "Parveen Kumar",
    "Sumith S",
    "Yathipathi Sai Krishna Ramanujan",
    "Bestine Benny",
    "Sunil Gour",
    "Milan Pagi",
    "Prema Dhuri",
    "Sagar Niranjanghavatv",
    "Surjeet Kumar",
    "Pratik Karn",
    "Arundas R",
    "Sevit Dhingra",
    "Yogesh Gopalkishan Arora",
    "Manoj G",
    "Shona George",
    "Bharathi",
    "Vinod M",
    "Dhanesh M P",
    "Safad Shah K S",
    "Sarath",
    "Harish Mishra",
    "Rakesh Raja",
    "Gopal",
    "Rohit Ahuja",
    "Anil Kumar",
    "ANAGHA S",
    "Rohan Babbar",
    "Vignesh S",
    "Vishnu Prasad N",
    "Achanya B",
    "Nishant",
  ]

  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter
      const matchesTeam = teamFilter === "all" || booking.team === teamFilter

      return matchesSearch && matchesStatus && matchesTeam
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

  const activeBookings = filteredBookings.filter((booking) => booking.status !== "cancelled")
  const cancelledBookings = filteredBookings.filter((booking) => booking.status === "cancelled")
  const autoReleaseBookings = filteredBookings.filter((booking) => booking.status === "auto_release")

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      payment_pending: "bg-orange-100 text-orange-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-red-100 text-red-800",
      partial: "bg-yellow-100 text-yellow-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getReceivedPercentage = (received: number, total: number) => {
    return total > 0 ? Math.round((received / total) * 100) : 0
  }

  const handleAction = (action: string, bookingId: string) => {
    console.log("[v0] Action clicked:", action, "for booking:", bookingId)
    switch (action) {
      case "edit":
        window.open("https://www.kairali.com/GoogleScript/KTAHV_Reservation_form/", "_blank")
        break
      case "view":
        const booking = bookings.find((b) => b.id === bookingId)
        if (booking) {
          setViewBookingData(booking)
          setShowViewModal(true)
        }
        break
      case "cancel":
        console.log("[v0] Opening cancel modal for:", bookingId)
        setSelectedBookingId(bookingId)
        setShowCancelModal(true)
        break
      case "payment_upload":
        console.log("[v0] Opening payment modal for:", bookingId)
        const paymentBooking = bookings.find((b) => b.id === bookingId)
        if (paymentBooking) {
          setSelectedBookingForPayment(paymentBooking)
          setShowPaymentModal(true)
        }
        break
      case "approval_upload":
        console.log("[v0] Opening approval modal for:", bookingId)
        const bookingForApproval = bookings.find((b) => b.id === bookingId)
        if (bookingForApproval) {
          setSelectedBookingForApproval(bookingForApproval)
          setShowApprovalModal(true)
        }
        break
      case "verify_accounts":
        console.log("[v0] Opening accounts verify modal for:", bookingId)
        const accountsBooking = bookings.find((b) => b.id === bookingId)
        if (accountsBooking) {
          setSelectedBookingForAccounts(accountsBooking)
          setShowAccountsVerifyModal(true)
        }
        break
      case "verify_fo":
        console.log("[v0] Opening FO PMS verify modal for:", bookingId)
        const foPMSBooking = bookings.find((b) => b.id === bookingId)
        if (foPMSBooking) {
          setSelectedBookingForFOPMS(foPMSBooking)
          setFOPMSVerifyModal(true)
        }
        break
      case "verify_checkout":
        console.log("[v0] Opening checkout verify modal for:", bookingId)
        const checkoutBooking = bookings.find((b) => b.id === bookingId)
        if (checkoutBooking) {
          setSelectedBookingForCheckout(checkoutBooking)
          setShowCheckoutVerifyModal(true)
        }
        break
    }
  }

  const handleCancelBooking = () => {
    if (!cancelReason.trim()) {
      alert("Please select a reason for cancellation")
      return
    }

    setBookings(bookings.map((b) => (b.id === selectedBookingId ? { ...b, status: "cancelled" as const } : b)))

    // Reset modal state
    setShowCancelModal(false)
    setSelectedBookingId("")
    setCancelReason("")
    setCancelRemarks("")

    console.log("Booking cancelled:", {
      bookingId: selectedBookingId,
      reason: cancelReason,
      remarks: cancelRemarks,
    })
  }

  const handlePaymentSubmit = () => {
    if (
      !paymentData.receivedAmount ||
      !paymentData.paymentMode ||
      !paymentData.receivedDate ||
      !paymentData.receiptNumber
    ) {
      alert("Please fill all required fields")
      return
    }

    console.log("Payment submitted:", {
      booking: selectedBookingForPayment,
      paymentData,
    })

    // Reset modal state
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

  const handleApprovalSubmit = () => {
    console.log("Approval submitted:", {
      booking: selectedBookingForApproval,
      approvalData,
    })

    // Reset modal state
    setShowApprovalModal(false)
    setSelectedBookingForApproval(null)
    setApprovalData({
      approvedBy: "",
      approveTillDate: "",
      screenshot: null,
      remarks: "",
      uploadedBy: "",
    })
  }

  const handleAccountsVerifySubmit = () => {
    if (!accountsVerifyData.paymentReceivedStatus) {
      alert("Please select payment received status")
      return
    }

    console.log("Accounts verification submitted:", {
      booking: selectedBookingForAccounts,
      accountsVerifyData,
    })

    // Reset modal state
    setShowAccountsVerifyModal(false)
    setSelectedBookingForAccounts(null)
    setAccountsVerifyData({
      paymentReceivedStatus: "",
      actualReceivedAmount: "",
      remarks: "",
    })
  }

  const handleFOPMSVerifySubmit = () => {
    if (!foPMSVerifyData.releasePassActionStatus || !foPMSVerifyData.informedToBookingPerson) {
      alert("Please fill all required fields")
      return
    }

    console.log("FO PMS verification submitted:", {
      booking: selectedBookingForFOPMS,
      foPMSVerifyData,
    })

    // Reset modal state
    setFOPMSVerifyModal(false)
    setSelectedBookingForFOPMS(null)
    setFoPMSVerifyData({
      releasePassActionStatus: "",
      pmsBlockStatus: "",
      informedToBookingPerson: "",
      remarks: "",
    })
  }

  const handleCheckoutVerifySubmit = () => {
    if (!checkoutVerifyData.paymentReceivedStatus) {
      alert("Please select payment received status")
      return
    }

    console.log("Checkout verification submitted:", {
      booking: selectedBookingForCheckout,
      checkoutVerifyData,
    })

    // Reset modal state
    setShowCheckoutVerifyModal(false)
    setSelectedBookingForCheckout(null)
    setCheckoutVerifyData({
      paymentReceivedStatus: "",
      remarks: "",
    })
  }

  const SortIcon = ({ field }: { field: keyof Booking }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const totalBookings = filteredBookings.length
  const totalAmount = filteredBookings.reduce((sum, booking) => sum + booking.amount, 0)
  const totalReceived = filteredBookings.reduce((sum, booking) => sum + booking.receivedAmount, 0)
  const confirmedBookings = filteredBookings.filter((b) => b.status === "confirmed").length
  const pendingBookings = filteredBookings.filter((b) => b.status === "pending").length
  const cancelledCount = cancelledBookings.length
  const autoReleaseCount = autoReleaseBookings.length

  const renderStatusBadge = (status: string, type: string) => {
    const getStatusColor = (status: string, type: string) => {
      switch (type) {
        case "sales":
          switch (status) {
            case "completed":
              return "bg-green-100 text-green-800 border-green-200"
            case "in_progress":
              return "bg-blue-100 text-blue-800 border-blue-200"
            case "on_hold":
              return "bg-yellow-100 text-yellow-800 border-yellow-200"
            default:
              return "bg-gray-100 text-gray-800 border-gray-200"
          }
        case "accounts":
          switch (status) {
            case "payment_verified":
              return "bg-green-100 text-green-800 border-green-200"
            case "approval_verified":
              return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "booking_cancelled":
              return "bg-red-100 text-red-800 border-red-200"
            case "under_review":
              return "bg-blue-100 text-blue-800 border-blue-200"
            default:
              return "bg-gray-100 text-gray-800 border-gray-200"
          }
        case "frontoffice":
          switch (status) {
            case "pms_verified_done":
              return "bg-green-100 text-green-800 border-green-200"
            case "booking_cancelled":
              return "bg-red-100 text-red-800 border-red-200"
            case "processing":
              return "bg-blue-100 text-blue-800 border-blue-200"
            default:
              return "bg-gray-100 text-gray-800 border-gray-200"
          }
        case "payment":
          switch (status) {
            case "full_payment_received":
              return "bg-green-100 text-green-800 border-green-200"
            case "partial_payment":
              return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "booking_cancelled":
              return "bg-red-100 text-red-800 border-red-200"
            default:
              return "bg-gray-100 text-gray-800 border-gray-200"
          }
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BackButton className="mb-4" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">New Booking Sales Update</h1>
                  <p className="text-lg text-slate-600 mt-1">Executive Dashboard • Real-time PMS Analytics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-500">Last Updated</p>
                <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 uppercase tracking-wide truncate">
                    Total Bookings
                  </p>
                  <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900">{totalBookings}</p>
                  <div className="flex items-center gap-1 lg:gap-2">
                    <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-emerald-100 rounded-full">
                      <TrendingUp className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-700">+12%</span>
                    </div>
                    <span className="text-xs text-slate-500 hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-primary/10 rounded-xl flex-shrink-0 ml-2">
                  <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-emerald-50 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 uppercase tracking-wide truncate">
                    Total Revenue
                  </p>
                  <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900">
                    ₹{totalAmount.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 lg:gap-2">
                    <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-emerald-100 rounded-full">
                      <TrendingUp className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-700">+8%</span>
                    </div>
                    <span className="text-xs text-slate-500 hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-emerald-100 rounded-xl flex-shrink-0 ml-2">
                  <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 uppercase tracking-wide truncate">
                    Amount Received
                  </p>
                  <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900">
                    ₹{totalReceived.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 lg:gap-2">
                    <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-red-100 rounded-full">
                      <TrendingDown className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-red-600" />
                      <span className="text-xs font-semibold text-red-700">-3%</span>
                    </div>
                    <span className="text-xs text-slate-500 hidden sm:inline">collection rate</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-blue-100 rounded-xl flex-shrink-0 ml-2">
                  <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-amber-50 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 uppercase tracking-wide truncate">
                    Pending
                  </p>
                  <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-amber-700">{pendingBookings}</p>
                  <div className="flex items-center gap-1 lg:gap-2">
                    <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-amber-100 rounded-full">
                      <TrendingUp className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">+5%</span>
                    </div>
                    <span className="text-xs text-slate-500 hidden sm:inline">requires attention</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-amber-100 rounded-xl flex-shrink-0 ml-2">
                  <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 uppercase tracking-wide truncate">
                    Cancelled
                  </p>
                  <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-red-700">{cancelledCount}</p>
                  <div className="flex items-center gap-1 lg:gap-2">
                    <div className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-emerald-100 rounded-full">
                      <TrendingDown className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-700">-15%</span>
                    </div>
                    <span className="text-xs text-slate-500 hidden sm:inline">improvement</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-red-100 rounded-xl flex-shrink-0 ml-2">
                  <XCircle className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              Filters & Search
              <div className="ml-auto text-sm font-normal text-slate-500">Advanced Analytics Controls</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Search Bookings</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by guest name, booking ID, or assigned to..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-slate-300 focus:border-primary focus:ring-primary/20">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="payment_pending">Payment Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Team Filter</Label>
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="border-slate-300 focus:border-primary focus:ring-primary/20">
                    <SelectValue placeholder="Filter by team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="sales">Sales Team</SelectItem>
                    <SelectItem value="accounts">Accounts Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              Active PMS Bookings
              <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-800 font-semibold">
                {activeBookings.length} Records
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200">
                    <TableHead
                      className="cursor-pointer font-semibold text-slate-700 hover:text-primary transition-colors"
                      onClick={() => handleSort("bookingId")}
                    >
                      <div className="flex items-center gap-2">
                        Booking ID
                        <SortIcon field="bookingId" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-slate-700 hover:text-primary transition-colors"
                      onClick={() => handleSort("guestName")}
                    >
                      <div className="flex items-center gap-2">
                        Guest Name
                        <SortIcon field="guestName" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">Room Details</TableHead>
                    <TableHead className="font-semibold text-slate-700">Programme</TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-slate-700 hover:text-primary transition-colors"
                      onClick={() => handleSort("checkIn")}
                    >
                      <div className="flex items-center gap-2">
                        Check In/Out
                        <SortIcon field="checkIn" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-slate-700 hover:text-primary transition-colors"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-2">
                        Amount
                        <SortIcon field="amount" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">Payment Progress</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Salesperson</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Verification Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">PI Link</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBookings.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      className={`border-slate-200 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-25"}`}
                    >
                      <TableCell className="font-semibold text-primary">{booking.bookingId}</TableCell>
                      <TableCell className="font-medium text-slate-900">{booking.guestName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">{booking.roomNumber}</div>
                          <div className="text-sm text-slate-600">{booking.roomType}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">{booking.programmeName}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600 font-medium">In:</span>
                            <span className="text-slate-700">{new Date(booking.checkIn).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 font-medium">Out:</span>
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
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
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
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {booking.assignedTo
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{booking.assignedTo}</div>
                            <div className="text-xs text-slate-500">Sales Executive</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center space-y-2">
                        <div>{renderStatusBadge(booking.accountsVerifyStatus, "accounts")}</div>
                        <div>{renderStatusBadge(booking.frontOfficeStatus, "frontoffice")}</div>
                        <div>{renderStatusBadge(booking.paymentSettlementStatus, "payment")}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-slate-100 transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 bg-white border border-slate-200 shadow-lg rounded-lg"
                          >
                            <DropdownMenuItem
                              onClick={() => handleAction("edit", booking.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                              <span className="text-slate-700">Edit Booking</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("view", booking.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-emerald-600" />
                              <span className="text-slate-700">View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 border-slate-200" />
                            <DropdownMenuItem
                              onClick={() => handleAction("verify_accounts", booking.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-slate-700">Accounts Verify</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("verify_fo", booking.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                            >
                              <Building className="h-4 w-4 text-purple-600" />
                              <span className="text-slate-700">FO PMS Verify</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("verify_checkout", booking.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                            >
                              <CreditCard className="h-4 w-4 text-orange-600" />
                              <span className="text-slate-700">Checkout Verify</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 border-slate-200" />
                            <DropdownMenuItem
                              onClick={() => handleAction("payment_upload", booking.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 text-cyan-600" />
                              <span className="text-slate-700">Upload Payment</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("cancel", booking.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Cancel Booking</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {autoReleaseBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Clock className="h-5 w-5" />
                Under Auto Release Bookings ({autoReleaseBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Programme Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Salesperson</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Accounts Verify Status</TableHead>
                      <TableHead>Front Office PMS Verify Status</TableHead>
                      <TableHead>On Checkout Status</TableHead>
                      <TableHead>PI Link</TableHead>
                      <TableHead>Release Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {autoReleaseBookings.map((booking) => (
                      <TableRow key={booking.id} className="opacity-75">
                        <TableCell className="font-medium">{booking.bookingId}</TableCell>
                        <TableCell>{booking.guestName}</TableCell>
                        <TableCell>{booking.contact}</TableCell>
                        <TableCell>{booking.programmeName}</TableCell>
                        <TableCell className="font-medium">₹{booking.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-medium">
                              {booking.salesperson
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "N/A"}
                            </div>
                            <span className="text-sm">{booking.salesperson || "Not Assigned"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(
                            ["Website", "Facebook", "PPC", "Online"][Math.floor(Math.random() * 4)],
                            "source",
                          )}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(booking.status ? booking.status.toUpperCase() : "UNKNOWN", "status")}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(
                            ["Payment Verified", "Approval Verified", "Booking Cancelled"][
                              Math.floor(Math.random() * 3)
                            ],
                            "accounts",
                          )}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(
                            ["PMS Verified Done", "Booking Cancelled"][Math.floor(Math.random() * 2)],
                            "frontoffice",
                          )}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(
                            ["Full Payment Received", "Partial Payment", "Booking Cancelled"][
                              Math.floor(Math.random() * 3)
                            ],
                            "checkout",
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `https://script.google.com/macros/s/AKfycbw0diRGbRmKa-DhFe-55pIGAXmR5QePBmFQdbM0h6mxuaDDgdznsa-kkv_16DqVE5ZKUA/exec?refId=${booking.bookingId}&rowNum=${Math.floor(Math.random() * 9999)}&pINum=KR/25-26/09/${Math.floor(Math.random() * 99)}&bookingType=Individual`,
                                "_blank",
                              )
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            PI Link
                          </Button>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(booking.lastUpdated).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open("https://www.kairali.com/GoogleScript/KTAHV_Reservation_form/", "_blank")
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("view", booking.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("accounts_verify", booking.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accounts Verify
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("fo_verify", booking.id)}>
                                <Shield className="h-4 w-4 mr-2" />
                                FO PMS Verify
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("checkout_verify", booking.id)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                On Checkout Collection Verify
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {cancelledBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Cancelled Bookings ({cancelledBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Programme Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Cancelled Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledBookings.map((booking) => (
                      <TableRow key={booking.id} className="opacity-75">
                        <TableCell className="font-medium">{booking.bookingId}</TableCell>
                        <TableCell>{booking.guestName}</TableCell>
                        <TableCell className="font-medium">{booking.roomNumber}</TableCell>
                        <TableCell>{booking.programmeName}</TableCell>
                        <TableCell className="font-medium">₹{booking.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium">
                              {booking.assignedTo.split(" ").map((n) => n[0])}
                            </div>
                            <span className="text-sm">{booking.assignedTo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-red-200 text-red-600">
                            {booking.team ? booking.team.toUpperCase() : "UNKNOWN"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(booking.lastUpdated).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAction("view", booking.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction("delete", booking.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <SelectItem value="room_unavailable">Room Unavailable</SelectItem>
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
                  console.log("[v0] Cancel modal closed")
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
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <Upload className="h-5 w-5" />
                Payment Collection Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {selectedBookingForPayment && (
                <>
                  {/* Client Information */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold text-gray-900">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Client Name:</Label>
                        <p className="font-medium">{selectedBookingForPayment.guestName}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Mobile No.:</Label>
                        <p className="font-medium">9849996851</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Booking Amount:</Label>
                        <p className="font-medium">₹ {selectedBookingForPayment.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Final Amount to be Collection:</Label>
                        <p className="font-medium">
                          ₹{" "}
                          {(
                            selectedBookingForPayment.amount - selectedBookingForPayment.receivedAmount
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Collection Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Payment Collection Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="received-amount">Received Amount *</Label>
                        <div className="flex gap-2">
                          <Input
                            id="received-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={paymentData.receivedAmount}
                            onChange={(e) => setPaymentData({ ...paymentData, receivedAmount: e.target.value })}
                            className="flex-1"
                          />
                          <Select
                            value={paymentData.currency}
                            onValueChange={(value) => setPaymentData({ ...paymentData, currency: value })}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INR">INR</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                            <SelectItem value="paypal">Paypal</SelectItem>
                            <SelectItem value="bank">Bank</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="debit_card">Debit Card</SelectItem>
                            <SelectItem value="money_orders">Money Orders</SelectItem>
                            <SelectItem value="echecks">eChecks</SelectItem>
                            <SelectItem value="paper_checks">Paper Checks</SelectItem>
                            <SelectItem value="digital_wallets">Digital Wallets</SelectItem>
                            <SelectItem value="ach">Automated Clearing House (ACH)</SelectItem>
                            <SelectItem value="complimentary">Complimentary</SelectItem>
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
                        <Label htmlFor="receipt-number">Receipt/Transaction Number *</Label>
                        <Input
                          id="receipt-number"
                          placeholder="Enter receipt/transaction number"
                          value={paymentData.receiptNumber}
                          onChange={(e) => setPaymentData({ ...paymentData, receiptNumber: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="screenshot">Upload Screenshot</Label>
                        <Input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPaymentData({ ...paymentData, screenshot: e.target.files?.[0] || null })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment-location">Payment Location</Label>
                        <Select
                          value={paymentData.paymentLocation}
                          onValueChange={(value) => setPaymentData({ ...paymentData, paymentLocation: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ho">HO</SelectItem>
                            <SelectItem value="resort">Resort</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="collected-by">Payment Collection By</Label>
                      <Select
                        value={paymentData.paymentCollectedBy}
                        onValueChange={(value) => setPaymentData({ ...paymentData, paymentCollectedBy: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {employeeList.map((employee) => (
                            <SelectItem key={employee} value={employee}>
                              {employee}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Label className="text-gray-600">Pending Amount:</Label>
                      <p className="text-lg font-semibold text-blue-600">
                        ₹{" "}
                        {selectedBookingForPayment
                          ? (
                              selectedBookingForPayment.amount -
                              selectedBookingForPayment.receivedAmount -
                              (Number.parseFloat(paymentData.receivedAmount) || 0)
                            ).toLocaleString()
                          : 0}
                      </p>
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
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Submit Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Accounts Verify Modal */}
        <Dialog open={showAccountsVerifyModal} onOpenChange={setShowAccountsVerifyModal}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-600">
                <DollarSign className="h-5 w-5" />
                Accounts Verify
              </DialogTitle>
              {selectedBookingForAccounts && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-blue-700">Customer:</span>
                      <p className="text-blue-900">{selectedBookingForAccounts.guestName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Booking ID:</span>
                      <p className="text-blue-900">{selectedBookingForAccounts.bookingId}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Contact:</span>
                      <p className="text-blue-900">{selectedBookingForAccounts.contactNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-received-status">Payment Received Status *</Label>
                  <Select
                    value={accountsVerifyData.paymentReceivedStatus}
                    onValueChange={(value) =>
                      setAccountsVerifyData({ ...accountsVerifyData, paymentReceivedStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment_received">Payment Received</SelectItem>
                      <SelectItem value="payment_not_received_approval_taken">
                        Payment Not Received But Approval Taken
                      </SelectItem>
                      <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                      <SelectItem value="payment_not_received">Payment Not Received</SelectItem>
                      <SelectItem value="complimentary_voucher">Complimentary Voucher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual-received-amount">Actual Received in Bank Amount</Label>
                  <Input
                    id="actual-received-amount"
                    type="number"
                    placeholder="Enter actual amount received"
                    value={accountsVerifyData.actualReceivedAmount}
                    onChange={(e) =>
                      setAccountsVerifyData({ ...accountsVerifyData, actualReceivedAmount: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accounts-remarks">Remarks</Label>
                <Textarea
                  id="accounts-remarks"
                  placeholder="Enter any additional remarks..."
                  value={accountsVerifyData.remarks}
                  onChange={(e) => setAccountsVerifyData({ ...accountsVerifyData, remarks: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAccountsVerifyModal(false)
                  setSelectedBookingForAccounts(null)
                  setAccountsVerifyData({
                    paymentReceivedStatus: "",
                    actualReceivedAmount: "",
                    remarks: "",
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAccountsVerifySubmit}
                disabled={!accountsVerifyData.paymentReceivedStatus}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Submit Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* FO PMS Verify Modal */}
        <Dialog open={showFOPMSVerifyModal} onOpenChange={setFOPMSVerifyModal}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-purple-600">
                <Building className="h-5 w-5" />
                FO PMS Verify
              </DialogTitle>
              {selectedBookingForFOPMS && (
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-purple-700">Customer:</span>
                      <p className="text-purple-900">{selectedBookingForFOPMS.guestName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-700">Booking ID:</span>
                      <p className="text-purple-900">{selectedBookingForFOPMS.bookingId}</p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-700">Contact:</span>
                      <p className="text-purple-900">{selectedBookingForFOPMS.contactNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="release-pass-status">Release/Pass Action Status *</Label>
                  <Select
                    value={foPMSVerifyData.releasePassActionStatus}
                    onValueChange={(value) =>
                      setFoPMSVerifyData({ ...foPMSVerifyData, releasePassActionStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pass">PASS</SelectItem>
                      <SelectItem value="fail">FAIL</SelectItem>
                      <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                      <SelectItem value="complimentary_voucher">Complimentary Voucher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pms-block-status">PMS Dashboard Block Status</Label>
                  <Select
                    value={foPMSVerifyData.pmsBlockStatus}
                    onValueChange={(value) => setFoPMSVerifyData({ ...foPMSVerifyData, pmsBlockStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select block status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                      <SelectItem value="no_action">No Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="informed-booking-person">Informed to Booking Taken Person *</Label>
                <Select
                  value={foPMSVerifyData.informedToBookingPerson}
                  onValueChange={(value) => setFoPMSVerifyData({ ...foPMSVerifyData, informedToBookingPerson: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Yes/No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fo-pms-remarks">Remarks</Label>
                <Textarea
                  id="fo-pms-remarks"
                  placeholder="Enter any additional remarks..."
                  value={foPMSVerifyData.remarks}
                  onChange={(e) => setFoPMSVerifyData({ ...foPMSVerifyData, remarks: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFOPMSVerifyModal(false)
                  setSelectedBookingForFOPMS(null)
                  setFoPMSVerifyData({
                    releasePassActionStatus: "",
                    pmsBlockStatus: "",
                    informedToBookingPerson: "",
                    remarks: "",
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFOPMSVerifySubmit}
                disabled={!foPMSVerifyData.releasePassActionStatus || !foPMSVerifyData.informedToBookingPerson}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Building className="h-4 w-4 mr-2" />
                Submit Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* On Checkout Collection Verify Modal */}
        <Dialog open={showCheckoutVerifyModal} onOpenChange={setShowCheckoutVerifyModal}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CreditCard className="h-5 w-5" />
                On Checkout Collection Verify
              </DialogTitle>
              {selectedBookingForCheckout && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-700">Customer Information</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Name:</span> {selectedBookingForCheckout.guestName}
                        </div>
                        <div>
                          <span className="font-medium">Booking ID:</span> {selectedBookingForCheckout.bookingId}
                        </div>
                        <div>
                          <span className="font-medium">Contact:</span>{" "}
                          {selectedBookingForCheckout.contactNumber || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-700">Collection Information</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">PI Amount:</span>
                          <span className="text-green-800">₹{selectedBookingForCheckout.totalAmount || "0"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Amount Received:</span>
                          <span className="text-green-800">₹{selectedBookingForCheckout.paidAmount || "0"}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-medium text-orange-600">Pending Amount:</span>
                          <span className="text-orange-800 font-semibold">
                            ₹
                            {(
                              Number.parseFloat(selectedBookingForCheckout.totalAmount || "0") -
                              Number.parseFloat(selectedBookingForCheckout.paidAmount || "0")
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Payment Upload Section at Top */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Upload Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-received-amount">Received Amount *</Label>
                    <Input
                      id="checkout-received-amount"
                      type="number"
                      placeholder="Enter received amount"
                      value={paymentData.receivedAmount}
                      onChange={(e) => setPaymentData({ ...paymentData, receivedAmount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-payment-mode">Payment Mode *</Label>
                    <Select
                      value={paymentData.paymentMode}
                      onChange={(value) => setPaymentData({ ...paymentData, paymentMode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-received-date">Received Date *</Label>
                    <Input
                      id="checkout-received-date"
                      type="date"
                      value={paymentData.receivedDate}
                      onChange={(e) => setPaymentData({ ...paymentData, receivedDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-receipt-number">Receipt Number *</Label>
                    <Input
                      id="checkout-receipt-number"
                      placeholder="Enter receipt number"
                      value={paymentData.receiptNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, receiptNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Checkout Verification Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="checkout-payment-status">Payment Received Status *</Label>
                  <Select
                    value={checkoutVerifyData.paymentReceivedStatus}
                    onChange={(value) => setCheckoutVerifyData({ ...checkoutVerifyData, paymentReceivedStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_payment_received">Full Payment Received</SelectItem>
                      <SelectItem value="partial_payment_received">Partial Payment Received</SelectItem>
                      <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                      <SelectItem value="payment_pending">Payment Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-remarks">Remarks</Label>
                  <Textarea
                    id="checkout-remarks"
                    placeholder="Enter any additional remarks..."
                    value={checkoutVerifyData.remarks}
                    onChange={(e) => setCheckoutVerifyData({ ...checkoutVerifyData, remarks: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCheckoutVerifyModal(false)
                  setSelectedBookingForCheckout(null)
                  setCheckoutVerifyData({
                    paymentReceivedStatus: "",
                    remarks: "",
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCheckoutVerifySubmit}
                disabled={!checkoutVerifyData.paymentReceivedStatus}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Submit Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-600">
                <CheckCircle className="h-5 w-5" />
                Approval Upload
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedBookingForApproval && (
                <>
                  {/* Booking Information */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold text-gray-900">Booking Information</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <Label className="text-gray-600">Booking ID:</Label>
                        <p className="font-medium">{selectedBookingForApproval.bookingId}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Guest Name:</Label>
                        <p className="font-medium">{selectedBookingForApproval.guestName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Approval Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="approved-by">Approved By *</Label>
                      <Select
                        value={approvalData.approvedBy}
                        onChange={(value) => setApprovalData({ ...approvalData, approvedBy: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select approver" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {employeeList.map((employee) => (
                            <SelectItem key={employee} value={employee}>
                              {employee}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approve-till-date">Approve Till Date *</Label>
                      <Input
                        id="approve-till-date"
                        type="date"
                        value={approvalData.approveTillDate}
                        onChange={(e) => setApprovalData({ ...approvalData, approveTillDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approval-screenshot">Upload Approval Screenshot</Label>
                      <Input
                        id="approval-screenshot"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setApprovalData({ ...approvalData, screenshot: e.target.files?.[0] || null })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approval-remarks">Remarks</Label>
                      <Textarea
                        id="approval-remarks"
                        placeholder="Enter approval remarks or notes..."
                        value={approvalData.remarks}
                        onChange={(e) => setApprovalData({ ...approvalData, remarks: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="uploaded-by">Uploaded By *</Label>
                      <Select
                        value={approvalData.uploadedBy}
                        onChange={(value) => setApprovalData({ ...approvalData, uploadedBy: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select uploader" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {employeeList.map((employee) => (
                            <SelectItem key={employee} value={employee}>
                              {employee}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApprovalModal(false)
                  setSelectedBookingForApproval(null)
                  setApprovalData({
                    approvedBy: "",
                    approveTillDate: "",
                    screenshot: null,
                    remarks: "",
                    uploadedBy: "",
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprovalSubmit}
                disabled={!approvalData.approvedBy || !approvalData.approveTillDate || !approvalData.uploadedBy}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Complete Booking Details - {viewBookingData?.bookingId}</DialogTitle>
            </DialogHeader>
            {viewBookingData && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-blue-600 border-b pb-2">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp:</span>
                        <span className="font-medium">{new Date().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Buyer ID:</span>
                        <span className="font-medium">{viewBookingData.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Date:</span>
                        <span className="font-medium">{viewBookingData.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reservation ID:</span>
                        <span className="font-medium">{viewBookingData.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guest ID:</span>
                        <span className="font-medium">G-{viewBookingData.bookingId.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Edit ID:</span>
                        <span className="font-medium">E-{viewBookingData.bookingId.slice(-4)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-green-600 border-b pb-2">Guest Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{viewBookingData.guestName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country Code:</span>
                        <span className="font-medium">+91</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mobile:</span>
                        <span className="font-medium">{viewBookingData.mobile || "9849996851"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{viewBookingData.email || "guest@example.com"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">Male</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Is OP Patient:</span>
                        <span className="font-medium">No</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-purple-600 border-b pb-2">Address Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Billing Address:</span>
                        <span className="font-medium">123 Main Street</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country:</span>
                        <span className="font-medium">India</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium">Kerala</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">Palakkad</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-orange-600 border-b pb-2">Stay Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arrival Date:</span>
                        <span className="font-medium">{viewBookingData.checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departure Date:</span>
                        <span className="font-medium">{viewBookingData.checkOut}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Days of Stay:</span>
                        <span className="font-medium">7 Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package Type:</span>
                        <span className="font-medium">Wellness Package</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Programme:</span>
                        <span className="font-medium">{viewBookingData.programmeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purpose of Stay:</span>
                        <span className="font-medium">Health & Wellness</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Type:</span>
                        <span className="font-medium">Individual</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-red-600 border-b pb-2">Room Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room No:</span>
                        <span className="font-medium">{viewBookingData.roomNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Type:</span>
                        <span className="font-medium">{viewBookingData.roomType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Category:</span>
                        <span className="font-medium">Deluxe</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adults:</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Male:</span>
                        <span className="font-medium">1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Female:</span>
                        <span className="font-medium">1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Children:</span>
                        <span className="font-medium">0</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-teal-600 border-b pb-2">Guest Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guest Status:</span>
                        <span className="font-medium">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guest History:</span>
                        <span className="font-medium">First Time</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repeat Client:</span>
                        <span className="font-medium">No</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client Category:</span>
                        <span className="font-medium">Individual</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client Type:</span>
                        <span className="font-medium">Direct</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Group Booking:</span>
                        <span className="font-medium">No</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-green-600 border-b pb-2">Financial Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount (Before Discount):</span>
                        <span className="font-medium">₹{(viewBookingData.amount * 1.1).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount Amount:</span>
                        <span className="font-medium">₹{(viewBookingData.amount * 0.1).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount %:</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Amount:</span>
                        <span className="font-medium">₹{viewBookingData.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance:</span>
                        <span className="font-medium">
                          ₹{Math.floor(viewBookingData.amount * 0.3).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance:</span>
                        <span className="font-medium">
                          ₹{Math.floor(viewBookingData.amount * 0.7).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">INR</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-blue-600 border-b pb-2">Booking Management</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Taken By:</span>
                        <span className="font-medium">{viewBookingData.salesperson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Status:</span>
                        <span className="font-medium">{viewBookingData.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booker Name:</span>
                        <span className="font-medium">{viewBookingData.guestName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booker Email:</span>
                        <span className="font-medium">{viewBookingData.email || "guest@example.com"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booker Phone:</span>
                        <span className="font-medium">{viewBookingData.mobile || "9849996851"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Source:</span>
                        <span className="font-medium">{viewBookingData.source}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-emerald-600 border-b pb-2">Payment Collection</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Received Date:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Received Amount:</span>
                        <span className="font-medium">
                          ₹
                          {Math.floor(
                            viewBookingData.amount * (viewBookingData.receivedPercentage / 100),
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Mode:</span>
                        <span className="font-medium">Online Transfer</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Receipt Number:</span>
                        <span className="font-medium">RCP-{viewBookingData.bookingId.slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Location:</span>
                        <span className="font-medium">Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Collection By:</span>
                        <span className="font-medium">{viewBookingData.salesperson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Received:</span>
                        <span className="font-medium">
                          ₹
                          {Math.floor(
                            viewBookingData.amount * (viewBookingData.receivedPercentage / 100),
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">% Received:</span>
                        <span className="font-medium">{viewBookingData.receivedPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending Amount:</span>
                        <span className="font-medium">
                          ₹
                          {(
                            viewBookingData.amount -
                            Math.floor(viewBookingData.amount * (viewBookingData.receivedPercentage / 100))
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-indigo-600 border-b pb-2">Approval Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approval Given Date:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved Till Date:</span>
                        <span className="font-medium">{viewBookingData.checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved By:</span>
                        <span className="font-medium">Manager</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approval Remarks:</span>
                        <span className="font-medium">Approved for booking</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Tracking */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-pink-600 border-b pb-2">Status Tracking</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ML Final Status:</span>
                        <span className="font-medium">Confirmed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ML Remarks:</span>
                        <span className="font-medium">All requirements met</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Edit Action Status:</span>
                        <span className="font-medium">Completed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PI Generation Status:</span>
                        <span className="font-medium">Generated</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PI Number:</span>
                        <span className="font-medium">KR/25-26/09/{viewBookingData.bookingId.slice(-2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-cyan-600 border-b pb-2">Travel Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arrival Time:</span>
                        <span className="font-medium">14:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arrival Mode:</span>
                        <span className="font-medium">Car</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arrival Pickup:</span>
                        <span className="font-medium">Yes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departure Time:</span>
                        <span className="font-medium">11:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departure Mode:</span>
                        <span className="font-medium">Car</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departure Pickup:</span>
                        <span className="font-medium">Yes</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-amber-600 border-b pb-2">Communication</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">WhatsApp to Client:</span>
                        <span className="font-medium">Sent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email to Client:</span>
                        <span className="font-medium">Sent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">WhatsApp to Staff:</span>
                        <span className="font-medium">Sent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email to Staff:</span>
                        <span className="font-medium">Sent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div />
    </div>
  )
}
