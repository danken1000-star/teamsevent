import { createClient } from '@/lib/supabase'

export default async function PublicVotingPage({
  params,
}: {
  params: { eventId: string; memberId: string }
}) {
  const supabase = createClient()
  
  // DEBUG: Zeige was wir versuchen zu laden
  console.log('Loading:', params)
  
  const { data: teamMember, error: memberError } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', params.memberId)
    .single()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">DEBUG INFO</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Event ID:</strong> {params.eventId}
        </div>
        <div>
          <strong>Member ID:</strong> {params.memberId}
        </div>
        <div>
          <strong>Error:</strong> {memberError ? JSON.stringify(memberError) : 'None'}
        </div>
        <div>
          <strong>Team Member Found:</strong> {teamMember ? 'YES ✅' : 'NO ❌'}
        </div>
        {teamMember && (
          <div>
            <strong>Email:</strong> {teamMember.email}
          </div>
        )}
      </div>
    </div>
  )
}