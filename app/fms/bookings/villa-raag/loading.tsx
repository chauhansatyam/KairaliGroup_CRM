export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="text-purple-600 font-medium">Loading Villa Raag Bookings...</p>
      </div>
    </div>
  )
}
