'use client'

import { useState } from 'react'
import InviteTeamMembersMulti from './InviteTeamMembersMulti'
import InviteTeamMembersBulk from './InviteTeamMembersBulk'

type InviteTeamMembersTabsProps = {
  eventId: string
}

export default function InviteTeamMembersTabs({ eventId }: InviteTeamMembersTabsProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single')

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'single'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          📝 Einzeln (1-5 E-Mails)
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'bulk'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          📋 Bulk (5+ E-Mails)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'single' && (
        <div>
          <InviteTeamMembersMulti eventId={eventId} />
        </div>
      )}

      {activeTab === 'bulk' && (
        <div>
          <InviteTeamMembersBulk eventId={eventId} />
        </div>
      )}
    </div>
  )
}
