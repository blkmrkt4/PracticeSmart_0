import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Team {
  id: string
  name: string
  created_by: string
  role?: string
}

interface PlanAccessControlsProps {
  privacyLevel: string
  onPrivacyChange: (value: string) => void
  selectedTeams: string[]
  onTeamsChange: (teams: string[]) => void
  userId: string
}

export function PlanAccessControls({
  privacyLevel,
  onPrivacyChange,
  selectedTeams,
  onTeamsChange,
  userId
}: PlanAccessControlsProps) {
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)

  // Fetch user's teams when the component mounts
  useEffect(() => {
    fetchUserTeams()
  }, [])

  const fetchUserTeams = async () => {
    setIsLoadingTeams(true)
    try {
      const response = await fetch(`/api/teams?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch teams')
      }
      
      const data = await response.json()
      console.log('Fetched teams:', data.teams)
      
      // Sort teams: owned teams first, then teams user is a member of
      const sortedTeams = [...(data.teams || [])].sort((a, b) => {
        // Owner teams first
        if (a.created_by === userId && b.created_by !== userId) return -1
        if (a.created_by !== userId && b.created_by === userId) return 1
        // Then alphabetically by name
        return a.name.localeCompare(b.name)
      })
      
      setUserTeams(sortedTeams)
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setIsLoadingTeams(false)
    }
  }

  const handleTeamSelection = (teamId: string, checked: boolean) => {
    if (checked) {
      onTeamsChange([...selectedTeams, teamId])
    } else {
      onTeamsChange(selectedTeams.filter(id => id !== teamId))
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="plan-privacy">Privacy</Label>
        <Select
          value={privacyLevel}
          onValueChange={onPrivacyChange}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select privacy level" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/20 text-white">
            <SelectItem value="private">Private (Only you)</SelectItem>
            <SelectItem value="team">Team (Select teams below)</SelectItem>
            <SelectItem value="public">Public (Anyone with link)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {privacyLevel === "team" && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <Label>Share with Teams</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchUserTeams}
              disabled={isLoadingTeams}
              className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
            >
              {isLoadingTeams ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1 text-xs">Refresh</span>
            </Button>
          </div>
          
          <div className="max-h-40 overflow-y-auto pr-2 space-y-2 border border-white/10 rounded-md p-2">
            {isLoadingTeams ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-white/70" />
                <span className="ml-2 text-sm text-white/70">Loading teams...</span>
              </div>
            ) : userTeams.length === 0 ? (
              <div className="text-center py-4 text-white/70">
                <p>You don't have any teams yet.</p>
                <Link href="/teams" className="text-blue-400 hover:underline block mt-1">Create a team</Link>
              </div>
            ) : (
              <>
                {userTeams.map((team) => (
                  <div key={team.id} className="flex items-center p-1 hover:bg-white/5 rounded">
                    <Checkbox
                      id={`team-${team.id}`}
                      checked={selectedTeams.includes(team.id)}
                      onCheckedChange={(checked) => {
                        handleTeamSelection(team.id, checked as boolean)
                      }}
                      className="border-white/50"
                    />
                    <Label
                      htmlFor={`team-${team.id}`}
                      className="ml-2 text-sm font-normal cursor-pointer flex-1"
                    >
                      <span className="flex items-center">
                        {team.name}
                        {team.created_by === userId ? (
                          <span className="ml-2 text-xs text-blue-400 px-1.5 py-0.5 rounded bg-blue-400/10">(Owner)</span>
                        ) : (
                          <span className="ml-2 text-xs text-green-400 px-1.5 py-0.5 rounded bg-green-400/10">(Member)</span>
                        )}
                      </span>
                    </Label>
                  </div>
                ))}
                <div className="text-center pt-2 text-xs text-white/50">
                  <Link href="/teams" className="text-blue-400 hover:underline">Manage teams</Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
