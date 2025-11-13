"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Lead, LeadActivity, LeadStats, LeadPriority, LeadUrgency, LeadStatus } from "@/types/lead"
import { useAuth } from "@/hooks/use-auth"

interface LeadsContextType {
  leads: Lead[]
  activities: LeadActivity[]
  stats: LeadStats
  createLead: (leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>
  assignLead: (leadId: string, assignedTo: string) => Promise<void>
  addRemark: (leadId: string, remark: string) => Promise<void>
  scheduleFollowUp: (leadId: string, followUpDate: string) => Promise<void>
  searchLeads: (query: string) => Lead[]
  getLeadsByAgent: (agentId: string) => Lead[]
  getLeadActivities: (leadId: string) => LeadActivity[]
  checkDuplicates: (phone: string, email: string) => Lead[]
  isLoading: boolean
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined)

// Mock AI verification function
const aiVerifyLead = (
  lead: Omit<Lead, "id" | "createdAt" | "updatedAt">,
): { priority: LeadPriority; urgency: LeadUrgency } => {
  // Simulate AI logic based on source, requirements, etc.
  let priority: LeadPriority = "medium"
  let urgency: LeadUrgency = "normal"

  // High priority sources
  if (["referral", "walk_in"].includes(lead.source)) {
    priority = "high"
    urgency = "urgent"
  }

  // Check requirements for urgency indicators
  if (lead.requirements?.toLowerCase().includes("urgent") || lead.requirements?.toLowerCase().includes("immediate")) {
    urgency = "urgent"
    priority = "high"
  }

  // Medical leads are typically high priority for KTAHV
  if (lead.company === "KTAHV" && lead.requirements?.toLowerCase().includes("treatment")) {
    priority = "high"
  }

  return { priority, urgency }
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91-9876543210",
    company: "KAPPL",
    source: "website",
    priority: "high",
    urgency: "urgent",
    status: "new",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    remarks: [],
    isDuplicate: false,
    tatBreached: false,
    tags: ["hot_lead"],
    requirements: "Looking for immediate consultation",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91-9876543211",
    company: "KTAHV",
    source: "facebook",
    priority: "medium",
    urgency: "normal",
    status: "assigned",
    assignedTo: "3",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    lastContactedAt: "2024-01-15T09:00:00Z",
    nextFollowUpAt: "2024-01-16T10:00:00Z",
    remarks: ["Initial contact made", "Interested in treatment"],
    isDuplicate: false,
    tatBreached: false,
    tags: ["follow_up"],
    requirements: "Ayurvedic treatment inquiry",
  },
]

const mockActivities: LeadActivity[] = [
  {
    id: "1",
    leadId: "2",
    type: "assigned",
    description: "Lead assigned to Priya Sharma",
    performedBy: "2",
    performedAt: "2024-01-14T16:00:00Z",
  },
  {
    id: "2",
    leadId: "2",
    type: "contacted",
    description: "Initial contact made via phone",
    performedBy: "3",
    performedAt: "2024-01-15T09:00:00Z",
  },
]

export function LeadsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [activities, setActivities] = useState<LeadActivity[]>(mockActivities)
  const [isLoading, setIsLoading] = useState(false)

  const calculateStats = (): LeadStats => {
    const total = leads.length
    const statusCounts = leads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const converted = statusCounts.converted || 0
    const conversionRate = total > 0 ? (converted / total) * 100 : 0

    return {
      total,
      new: statusCounts.new || 0,
      assigned: statusCounts.assigned || 0,
      contacted: statusCounts.contacted || 0,
      followUp: statusCounts.follow_up || 0,
      converted,
      cold: statusCounts.cold || 0,
      notConnected: statusCounts.not_connected || 0,
      delayed: statusCounts.delayed || 0,
      untouched: statusCounts.untouched || 0,
      tatBreached: leads.filter((l) => l.tatBreached).length,
      duplicates: leads.filter((l) => l.isDuplicate).length,
      conversionRate,
      avgResponseTime: 2.5, // Mock average response time in hours
    }
  }

  const checkDuplicates = (phone: string, email: string): Lead[] => {
    return leads.filter((lead) => lead.phone === phone || lead.email.toLowerCase() === email.toLowerCase())
  }

  const createLead = async (leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)

    // Check for duplicates
    const duplicates = checkDuplicates(leadData.phone, leadData.email)
    const isDuplicate = duplicates.length > 0

    // AI verification
    const aiResult = aiVerifyLead(leadData)

    // Check TAT breach (4 hours for new leads)
    const now = new Date()
    const createdAt = new Date().toISOString()

    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt,
      updatedAt: createdAt,
      priority: aiResult.priority,
      urgency: aiResult.urgency,
      isDuplicate,
      duplicateOf: isDuplicate ? duplicates[0].id : undefined,
      tatBreached: false,
      remarks: leadData.remarks || [],
    }

    setLeads((prev) => [...prev, newLead])

    // Add activity
    const activity: LeadActivity = {
      id: Date.now().toString(),
      leadId: newLead.id,
      type: "created",
      description: `Lead created from ${leadData.source}${isDuplicate ? " (Duplicate detected)" : ""}`,
      performedBy: user?.id || "system",
      performedAt: createdAt,
    }

    setActivities((prev) => [...prev, activity])
    setIsLoading(false)
  }

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead)),
    )

    if (updates.status) {
      const activity: LeadActivity = {
        id: Date.now().toString(),
        leadId: id,
        type: "status_changed",
        description: `Status changed to ${updates.status}`,
        performedBy: user?.id || "system",
        performedAt: new Date().toISOString(),
      }
      setActivities((prev) => [...prev, activity])
    }
  }

  const assignLead = async (leadId: string, assignedTo: string) => {
    await updateLead(leadId, {
      assignedTo,
      assignedBy: user?.id,
      status: "assigned" as LeadStatus,
    })

    const activity: LeadActivity = {
      id: Date.now().toString(),
      leadId,
      type: "assigned",
      description: `Lead assigned to agent`,
      performedBy: user?.id || "system",
      performedAt: new Date().toISOString(),
    }
    setActivities((prev) => [...prev, activity])
  }

  const addRemark = async (leadId: string, remark: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (lead) {
      const updatedRemarks = [...lead.remarks, remark]
      await updateLead(leadId, {
        remarks: updatedRemarks,
        lastContactedAt: new Date().toISOString(),
      })

      const activity: LeadActivity = {
        id: Date.now().toString(),
        leadId,
        type: "remark_added",
        description: `Remark added: ${remark}`,
        performedBy: user?.id || "system",
        performedAt: new Date().toISOString(),
      }
      setActivities((prev) => [...prev, activity])
    }
  }

  const scheduleFollowUp = async (leadId: string, followUpDate: string) => {
    await updateLead(leadId, {
      nextFollowUpAt: followUpDate,
      status: "follow_up" as LeadStatus,
    })

    const activity: LeadActivity = {
      id: Date.now().toString(),
      leadId,
      type: "follow_up_scheduled",
      description: `Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString()}`,
      performedBy: user?.id || "system",
      performedAt: new Date().toISOString(),
    }
    setActivities((prev) => [...prev, activity])
  }

  const searchLeads = (query: string): Lead[] => {
    const lowercaseQuery = query.toLowerCase()
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(lowercaseQuery) ||
        lead.email.toLowerCase().includes(lowercaseQuery) ||
        lead.phone.includes(query) ||
        lead.source.toLowerCase().includes(lowercaseQuery) ||
        lead.requirements?.toLowerCase().includes(lowercaseQuery),
    )
  }

  const getLeadsByAgent = (agentId: string): Lead[] => {
    return leads.filter((lead) => lead.assignedTo === agentId)
  }

  const getLeadActivities = (leadId: string): LeadActivity[] => {
    return activities.filter((activity) => activity.leadId === leadId)
  }

  // Check for TAT breaches every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.status === "new" && !lead.tatBreached) {
            const createdTime = new Date(lead.createdAt)
            const hoursDiff = (now.getTime() - createdTime.getTime()) / (1000 * 60 * 60)

            if (hoursDiff > 4) {
              return {
                ...lead,
                tatBreached: true,
                tatBreachedAt: now.toISOString(),
              }
            }
          }
          return lead
        }),
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const stats = calculateStats()

  return (
    <LeadsContext.Provider
      value={{
        leads,
        activities,
        stats,
        createLead,
        updateLead,
        assignLead,
        addRemark,
        scheduleFollowUp,
        searchLeads,
        getLeadsByAgent,
        getLeadActivities,
        checkDuplicates,
        isLoading,
      }}
    >
      {children}
    </LeadsContext.Provider>
  )
}

export function useLeads() {
  const context = useContext(LeadsContext)
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadsProvider")
  }
  return context
}
