'use client'

type Vote = {
  id: string
  team_member_id: string
  vote_type: string
  vote_value: string
  created_at: string
}

type TeamMember = {
  id: string
  email: string
  name: string | null
  voted_at: string | null
}

type VotingResultsProps = {
  eventId: string
  votes: Vote[]
  teamMembers: TeamMember[]
}

export default function VotingResults({ votes, teamMembers }: VotingResultsProps) {
  // Date Votes
  const dateVotes = votes.filter(v => v.vote_type === 'date')
  const dateResults = dateVotes.reduce((acc, vote) => {
    acc[vote.vote_value] = (acc[vote.vote_value] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topDate = Object.entries(dateResults)
    .sort(([, a], [, b]) => b - a)[0]

  // Location Votes (für zukünftige Erweiterung)
  const locationVotes = votes.filter(v => v.vote_type === 'location')

  const totalMembers = teamMembers.length
  const votedMembers = teamMembers.filter(m => m.voted_at).length
  const votingProgress = totalMembers > 0 ? (votedMembers / totalMembers) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Voting Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Abstimmungs-Fortschritt</span>
          <span className="font-medium text-gray-900">
            {votedMembers} / {totalMembers}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all"
            style={{ width: `${votingProgress}%` }}
          />
        </div>
      </div>

      {/* Date Voting Results */}
      {dateVotes.length > 0 ? (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            📅 Datum-Abstimmung
          </h3>
          <div className="space-y-2">
            {Object.entries(dateResults)
              .sort(([, a], [, b]) => b - a)
              .map(([date, count]) => {
                const percentage = (count / dateVotes.length) * 100
                const isWinner = topDate && date === topDate[0] && topDate[1] > 1
                
                return (
                  <div key={date} className="relative">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">
                        {new Date(date).toLocaleDateString('de-CH', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {isWinner && ' 🏆'}
                      </span>
                      <span className="text-gray-600">
                        {count} Stimme{count > 1 ? 'n' : ''}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isWinner ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>

          {topDate && topDate[1] > 1 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900">
                🎉 Gewinner: {new Date(topDate[0]).toLocaleDateString('de-CH')} mit {topDate[1]} Stimmen
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Noch keine Abstimmungen vorhanden</p>
          <p className="text-xs mt-2">
            {teamMembers.length === 0 
              ? 'Laden Sie Team-Mitglieder ein um mit der Abstimmung zu starten'
              : 'Warten Sie bis Team-Mitglieder abgestimmt haben'
            }
          </p>
        </div>
      )}

      {/* Location Voting (für später) */}
      {locationVotes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            📍 Location-Abstimmung
          </h3>
          <p className="text-sm text-gray-500">
            Wird angezeigt sobald Abstimmungen eingehen
          </p>
        </div>
      )}
    </div>
  )
}