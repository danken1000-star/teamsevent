'use client'

type EditEventButtonProps = {
  eventId: string
}

export default function EditEventButton({ eventId }: EditEventButtonProps) {
  return (
    <a
      href={`/dashboard/events/${eventId}`}
      className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
    >
      📝 Details
    </a>
  )
}