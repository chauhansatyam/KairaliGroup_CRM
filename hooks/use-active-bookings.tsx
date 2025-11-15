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
                    "https://script.google.com/macros/s/AKfycbw-ZyT1rj6MLlLeVASCO3ZFR8WIVkFSynZU1tIwp3d53KscgJ4tw8gLdapv_sidfKyYmQ/exec";
                const res = await fetch(SCRIPT_URL);
                if (!res.ok) throw new Error("Failed to fetch villa bookings");

                const data = await res.json();

                const formatted = data.map((item: any, index: number) => {
                    // Room Category fix → sometimes number / array / empty
                    let roomCategory = item["Room Category"];
                    if (Array.isArray(roomCategory)) {
                        roomCategory = roomCategory.join(", ");
                    }
                    roomCategory = String(roomCategory || "N/A");

                    // ✅ FIXED: Correct status mapping based on actual API behavior
                    const bookingStatus = Number(item["Booking Status"]);
                    let status = "pending";
                    let paymentProgress = "pending";

                    // Based on your data: 1 = confirmed, 2 = pending/hold
                    if (bookingStatus === 3) {
                        status = "canceled";
                        paymentProgress = "canceled";
                    } else if (bookingStatus === 1) {
                        status = "confirmed";
                        paymentProgress = "paid";
                    } else if (bookingStatus === 2) {
                        status = "hold";
                        paymentProgress = "hold";
                    } else if (bookingStatus === 0 || bookingStatus === 4) {
                        status = "pending";
                        paymentProgress = "pending";
                    }

                    return {
                        id: String(item["Booking ID"] || index),
                        bookingId: String(item["Booking ID"] || ""),
                        guestName: String(item["Name of Client"] || ""),
                        checkIn: item["Arrival Date"] || "",
                        checkOut: item["Departure Date"] || "",
                        villaType: "Villa Raag",
                        villaNumber: String(item["Room No."] || "N/A"),
                        roomName: roomCategory,
                        plan: String(item["Meal Plan Type"] || ""),
                        amount: Number(item["Invoice Amount"] || 0),
                        receivedAmount: Number(item["Invoice Amount"] || 0),
                        approvedTillDate: "",
                        status,
                        assignedTo: String(item["Name of the Booker"] || item["Booker Emial"] || "Villa Team").split("@")[0],
                        team: "sales",
                        createdDate: item["Booking Date and Time"] || "",
                        lastUpdated: item["Last Edit Date"] || "",
                        source: "API Import",
                        paymentStatus: paymentProgress,
                        salesTeamStatus: bookingStatus === 3 ? "completed" : bookingStatus === 1 ? "in_progress" : "pending",
                        accountsVerifyStatus: bookingStatus === 3 ? "payment_verified" : "pending",
                        frontOfficeStatus: bookingStatus === 3 ? "pms_verified_done" : "pending",
                        paymentSettlementStatus: bookingStatus === 3 ? "full_payment_received" : "pending",
                        mobile: String(item["Mobile"] || ""),
                        email: String(item["Guest Email"] || ""),
                        receivedPercentage: bookingStatus === 3 ? 100 : 0,
                        salesperson: String(item["Name of the Booker"] || "Villa Team"),
                        contactNumber: String(item["Mobile"] || ""),
                        totalAmount: String(item["Invoice Amount"] || "0"),
                        paidAmount: String(item["Invoice Amount"] || "0"),
                    };
                });

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
