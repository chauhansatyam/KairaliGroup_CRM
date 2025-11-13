"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole =
  | "super_admin"
  | "admin"
  | "general_manager"
  | "department_head"
  | "sales_manager"
  | "sales_agent"
  | "operation_manager"
  | "operation_staff"
  | "account_manager"
  | "account_staff"
  | "doctor"
  | "front_office"
  | "hr_manager"

export type Department =
  | "Administration"
  | "Sales"
  | "Operations"
  | "Accounts"
  | "Medical"
  | "Front Office"
  | "HR"
  | "IT"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: Department
  company: "KAPPL" | "KTAHV"
  permissions: string[]
  employeeId: string
  phone: string
  joinDate: string
  isActive: boolean
  reportingTo?: string
  shift?: "morning" | "evening" | "night"
  targets?: {
    daily?: number
    weekly?: number
    monthly?: number
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, company: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  isLoading: boolean
  getAllUsers: () => User[]
  createUser: (userData: Omit<User, "id">) => Promise<void>
  updateUser: (id: string, userData: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const rolePermissions: Record<UserRole, string[]> = {
  super_admin: ["all"],
  admin: [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "leads.view",
    "leads.edit",
    "leads.assign",
    "leads.delete",
    "calls.view",
    "calls.make",
    "calls.monitor",
    "reports.view",
    "reports.export",
    "reports.admin",
    "fms.view",
    "fms.edit",
    "fms.admin",
    "helpdesk.view",
    "helpdesk.admin",
    "performance.view",
    "performance.admin",
    "marketing.view",
    "marketing.admin",
    "employee.tools",
    "doctor.consultation.view",
  ],
  general_manager: [
    "leads.view",
    "leads.assign",
    "calls.monitor",
    "reports.view",
    "reports.export",
    "fms.view",
    "fms.approve",
    "performance.view",
    "escalations.handle",
    "marketing.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
  department_head: [
    "leads.view",
    "leads.assign",
    "calls.monitor",
    "reports.view",
    "fms.view",
    "fms.approve",
    "performance.view",
    "team.manage",
    "marketing.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
  sales_manager: [
    "leads.view",
    "leads.edit",
    "leads.assign",
    "calls.view",
    "calls.make",
    "calls.monitor",
    "reports.view",
    "performance.view",
    "team.manage",
    "marketing.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
  sales_agent: [
    "leads.view",
    "leads.edit",
    "calls.make",
    "reports.view",
    "performance.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
  operation_manager: [
    "fms.view",
    "fms.edit",
    "fms.approve",
    "bookings.view",
    "bookings.edit",
    "reports.view",
    "performance.view",
    "team.manage",
    "employee.tools",
    "doctor.consultation.view",
  ],
  operation_staff: [
    "fms.view",
    "fms.edit",
    "bookings.view",
    "bookings.edit",
    "reports.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
  account_manager: [
    "payments.view",
    "payments.edit",
    "invoices.view",
    "invoices.create",
    "reports.view",
    "performance.view",
    "team.manage",
    "employee.tools",
    "doctor.consultation.view",
  ],
  account_staff: [
    "payments.view",
    "payments.edit",
    "invoices.view",
    "reports.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
  doctor: [
    "consultations.view",
    "consultations.edit",
    "prescriptions.create",
    "reports.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
  front_office: [
    "bookings.view",
    "bookings.edit",
    "guests.view",
    "reports.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
  hr_manager: [
    "users.view",
    "users.create",
    "users.edit",
    "performance.view",
    "reports.view",
    "team.manage",
    "marketing.view",
    "employee.tools",
    "doctor.consultation.view",
  ],
}

const mockUsers: Record<string, User> = {
  "admin@kappl.com": {
    id: "1",
    email: "admin@kappl.com",
    name: "System Administrator",
    role: "admin",
    department: "Administration",
    company: "KAPPL",
    permissions: rolePermissions.admin,
    employeeId: "KAPPL001",
    phone: "+91-9876543210",
    joinDate: "2023-01-01",
    isActive: true,
  },
  "sales.manager@kappl.com": {
    id: "2",
    email: "sales.manager@kappl.com",
    name: "Rajesh Kumar",
    role: "sales_manager",
    department: "Sales",
    company: "KAPPL",
    permissions: rolePermissions.sales_manager,
    employeeId: "KAPPL002",
    phone: "+91-9876543211",
    joinDate: "2023-02-01",
    isActive: true,
    targets: { daily: 50, weekly: 300, monthly: 1200 },
  },
  "sales.agent@kappl.com": {
    id: "3",
    email: "sales.agent@kappl.com",
    name: "Priya Sharma",
    role: "sales_agent",
    department: "Sales",
    company: "KAPPL",
    permissions: rolePermissions.sales_agent,
    employeeId: "KAPPL003",
    phone: "+91-9876543212",
    joinDate: "2023-03-01",
    isActive: true,
    reportingTo: "2",
    shift: "morning",
    targets: { daily: 30, weekly: 180, monthly: 720 },
  },
  "operation@ktahv.com": {
    id: "4",
    email: "operation@ktahv.com",
    name: "Suresh Nair",
    role: "operation_manager",
    department: "Operations",
    company: "KTAHV",
    permissions: rolePermissions.operation_manager,
    employeeId: "KTAHV001",
    phone: "+91-9876543213",
    joinDate: "2023-01-15",
    isActive: true,
  },
  "doctor@ktahv.com": {
    id: "5",
    email: "doctor@ktahv.com",
    name: "Dr. Anjali Menon",
    role: "doctor",
    department: "Medical",
    company: "KTAHV",
    permissions: rolePermissions.doctor,
    employeeId: "KTAHV002",
    phone: "+91-9876543214",
    joinDate: "2023-02-15",
    isActive: true,
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>(Object.values(mockUsers))

  useEffect(() => {
    const storedUser = localStorage.getItem("kairali_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, company: string) => {
    const mockUser = mockUsers[email]
    if (mockUser && mockUser.company === company && mockUser.isActive) {
      setUser(mockUser)
      localStorage.setItem("kairali_user", JSON.stringify(mockUser))
    } else {
      throw new Error("Invalid credentials or inactive account")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kairali_user")
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    return user.permissions.includes("all") || user.permissions.includes(permission)
  }

  const getAllUsers = () => {
    return users.filter((u) => user?.company === u.company || user?.permissions.includes("all"))
  }

  const createUser = async (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      permissions: rolePermissions[userData.role] || [],
    }
    setUsers((prev) => [...prev, newUser])
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, ...userData, permissions: userData.role ? rolePermissions[userData.role] : u.permissions }
          : u,
      ),
    )
  }

  const deleteUser = async (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasPermission,
        isLoading,
        getAllUsers,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
