'use client'

type EditEventButtonProps = {
  eventId: string
}

export default function EditEventButton({ eventId }: EditEventButtonProps) {
  return (
    <a
      href={`/dashboard/events/${eventId}`}
      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-center"
    >
      ✏️ Bearbeiten
    </a>
  )
}