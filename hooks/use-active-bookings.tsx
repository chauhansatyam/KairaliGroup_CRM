"use client";
import { useEffect, useState } from "react";

export function useActiveVillaBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const SCRIPT_URL =
                    "https://script.google.com/macros/s/AKfycbzVFoLZOso1SVyuEHb6Gsn63_8bN_Bp2sEJRgH78ic4E0q7L85rCtsXP9KKZFy7fl8b/exec";
                const res = await fetch(SCRIPT_URL);
                if (!res.ok) throw new Error("Failed to fetch villa bookings");

                const data = await res.json();

                const formatted = data.map((item: any) => ({
                    id: item.reservation_id || "",
                    bookingId: item.reservation_number || item.folio_number || "",
                    guestName: item.guest_name || "",
                    checkIn: item.arrival_date || "",
                    checkOut: item.departure_date || "",
                    villaType: "Villa Raag",
                    villaNumber: item.folio_number || "N/A",
                    roomName: `Room ${item.folio_number || ""}`,
                    plan: item["Plan/Programme / Package Name"] || "",
                    amount: Number(item.total_amount || 0),
                    receivedAmount: Number(item.total_amount || 0),
                    approvedTillDate: "",
                    // 👇 simple, reliable condition (like your working code)
                    status: item.status === "3" ? "confirmed" : "pending",
                    paymentProgress: item.status === "3" ? "paid" : "pending",
                    assignedTo: item.email ? item.email.split("@")[0] : "Villa Team",
                    team: "sales",
                    createdDate: "",
                    lastUpdated: "",
                    source: "API Import",
                    salesTeamStatus: "completed",
                    accountsVerifyStatus: "payment_verified",
                    frontOfficeStatus: "pms_verified_done",
                    paymentSettlementStatus: "full_payment_received",
                    mobile: item.mobile || "",
                    email: item.email || "",
                    contactNumber: item.mobile || "",
                    salesperson: item.email || "Villa Team",
                    receivedPercentage: 100,
                    totalAmount: item.total_amount?.toString() || "0",
                    paidAmount: item.total_amount?.toString() || "0",
                }));

                setBookings(formatted);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchBookings();
    }, []);

    return { bookings, loading, error };
}
