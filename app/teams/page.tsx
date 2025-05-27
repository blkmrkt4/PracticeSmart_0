"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

// Create a Supabase client
const supabaseUrl = 'https://lwvbkcwxjjrlpbgtddoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dmJrY3d4ampybHBiZ3RkZG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjY3MDQsImV4cCI6MjA2MzAwMjcwNH0.bPGn0rDqm1owPwhYcpB5ThSbQiZ4eIPgh5gMPjtLl6Q';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);
import Link from "next/link"
import { ArrowLeft, Plus, UserPlus, Trash2, Users, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

type TeamMember = {
  id: string
  email: string
  name?: string
  isRegistered: boolean
}

type Team = {
  id: string
  name: string
  created_at: string
  updated_at?: string
  members: TeamMember[]
  created_by: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({})
  
  // Using Robin Hutchinson's user ID from the database
  const [currentUserId, setCurrentUserId] = useState<string>('597256d8-8bbd-412d-a857-8e6c8b0244d3')

  // Fetch teams on component mount using the hardcoded ID
  useEffect(() => {
    console.log('Using hardcoded user ID for testing:', currentUserId);
    fetchTeams(currentUserId);
  }, [])

  const fetchTeams = async (userId?: string) => {
    if (!userId && !currentUserId) {
      console.log('No user ID available for fetching teams');
      setIsLoading(false);
      return;
    }
    setIsLoading(true)
    try {
      const userIdToUse = userId || currentUserId;
      console.log('Fetching teams for user ID:', userIdToUse);
      const response = await fetch(`/api/teams?userId=${userIdToUse}`)
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error('Failed to fetch teams')
      }
      
      const data = await response.json()
      console.log('Teams data received:', data);
      if (data.teams && data.teams.length > 0) {
        setTeams(data.teams);
      } else {
        console.log('No teams returned from API, using test data');
        // Create test teams for demonstration
        const testTeams = [
          {
            id: 'd1befc1e-46e0-45a6-b351-63efbf124a44',
            name: 'Gym 1971 Master Coaches',
            created_at: '2025-05-26 13:29:36.886886+00',
            created_by: currentUserId,
            members: [
              { id: '1', email: 'blkmrkt.runner@gmail.com', name: 'Robin Hutchinson', isRegistered: true },
              { id: '2', email: 'member1@example.com', name: 'Team Member 1', isRegistered: true }
            ]
          },
          {
            id: '477d259b-c88d-4085-820f-48dc92ecbf83',
            name: 'Team2',
            created_at: '2025-05-26 13:33:16.582242+00',
            created_by: '7961b230-79fa-4cf1-b747-252b9e2e4ce6', // Not created by current user
            members: [
              { id: '3', email: 'blkmrkt.runner@gmail.com', name: 'Robin Hutchinson', isRegistered: true },
              { id: '4', email: 'owner@example.com', name: 'Team Owner', isRegistered: true }
            ]
          }
        ];
        setTeams(testTeams);
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
      toast({
        title: "Error",
        description: "Failed to load teams. Using test data instead.",
        variant: "destructive",
      })
      
      // Create test teams for demonstration
      const testTeams = [
        {
          id: 'd1befc1e-46e0-45a6-b351-63efbf124a44',
          name: 'Gym 1971 Master Coaches',
          created_at: '2025-05-26 13:29:36.886886+00',
          created_by: currentUserId,
          members: [
            { id: '1', email: 'blkmrkt.runner@gmail.com', name: 'Robin Hutchinson', isRegistered: true },
            { id: '2', email: 'member1@example.com', name: 'Team Member 1', isRegistered: true }
          ]
        },
        {
          id: '477d259b-c88d-4085-820f-48dc92ecbf83',
          name: 'Team2',
          created_at: '2025-05-26 13:33:16.582242+00',
          created_by: '7961b230-79fa-4cf1-b747-252b9e2e4ce6', // Not created by current user
          members: [
            { id: '3', email: 'blkmrkt.runner@gmail.com', name: 'Robin Hutchinson', isRegistered: true },
            { id: '4', email: 'owner@example.com', name: 'Team Owner', isRegistered: true }
          ]
        }
      ];
      setTeams(testTeams);
    } finally {
      setIsLoading(false)
    }
  }

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team name",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTeamName,
          created_by: currentUserId as string,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create team')
      }

      const data = await response.json()
      setTeams([...teams, data.team])
      setNewTeamName('')
      setShowCreateDialog(false)
      
      toast({
        title: "Success",
        description: "Team created successfully",
      })
    } catch (error) {
      console.error('Error creating team:', error)
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addTeamMember = async () => {
    if (!selectedTeam) return
    
    if (!newMemberEmail.trim() || !newMemberEmail.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newMemberEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add team member')
      }

      const data = await response.json()
      
      // Update the teams state with the new member
      setTeams(teams.map(team => {
        if (team.id === selectedTeam.id) {
          return {
            ...team,
            members: [...team.members, data.member]
          }
        }
        return team
      }))
      
      setNewMemberEmail('')
      setShowAddMemberDialog(false)
      
      toast({
        title: "Success",
        description: `${newMemberEmail} added to team`,
      })
    } catch (error) {
      console.error('Error adding team member:', error)
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeTeamMember = async (teamId: string, memberId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove team member')
      }

      // Update the teams state by removing the member
      setTeams(teams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter(member => member.id !== memberId)
          }
        }
        return team
      }))
      
      toast({
        title: "Success",
        description: "Team member removed",
      })
    } catch (error) {
      console.error('Error removing team member:', error)
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete team')
      }

      // Remove the team from state
      setTeams(teams.filter(team => team.id !== teamId))
      
      toast({
        title: "Success",
        description: "Team deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting team:', error)
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/20 bg-black/90 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <img src="/coaching-beast-icon.svg" alt="Coaching Beast Icon" className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold text-white">Coaching Beast</span>
          </Link>
          <div className="ml-4 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4 text-white/70" />
            <Link href="/" className="text-sm text-white/70 hover:text-white">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Teams</h1>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Team
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-white/70">You don't have any teams yet.</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {teams.map((team) => (
              <Card 
                key={team.id} 
                className={`border-white/20 overflow-hidden ${team.created_by === currentUserId ? 'bg-green-900/40' : 'bg-yellow-900/40'}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium mb-1">
                        {team.created_by === currentUserId ? (
                          <span className="bg-green-600/70 text-white px-2 py-0.5 rounded-full">Owner</span>
                        ) : (
                          <span className="bg-yellow-600/70 text-white px-2 py-0.5 rounded-full">Member</span>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-white">{team.name}</CardTitle>
                      <span className="text-sm text-white/70">({team.members.length} {team.members.length === 1 ? 'member' : 'members'})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10"
                        onClick={() => {
                          setExpandedTeams(prev => ({
                            ...prev,
                            [team.id]: !prev[team.id]
                          }))
                        }}
                      >
                        {expandedTeams[team.id] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m18 15-6-6-6 6"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m6 9 6 6 6-6"/></svg>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-white/10"
                        onClick={() => deleteTeam(team.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-white/70">
                    Created on {new Date(team.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                {expandedTeams[team.id] && (
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Team Members</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => {
                            setSelectedTeam(team)
                            setShowAddMemberDialog(true)
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4" /> Add Member
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10">
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {team.members.length === 0 ? (
                            <TableRow className="border-white/10">
                              <TableCell colSpan={3} className="text-center text-white/50 py-6">
                                No members in this team yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            team.members.map((member) => (
                              <TableRow key={member.id} className="border-white/10">
                                <TableCell className="font-medium text-white">
                                  {member.email}
                                </TableCell>
                                <TableCell>
                                  {member.isRegistered ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <Check className="mr-1 h-3 w-3" /> Registered
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <X className="mr-1 h-3 w-3" /> Pending
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-white/10"
                                    onClick={() => removeTeamMember(team.id, member.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Team Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Create New Team</DialogTitle>
            <DialogDescription className="text-white/70">
              Create a team to share activities and training plans with other coaches and players.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name" className="text-white">Team Name</Label>
              <Input
                id="team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={createTeam}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Add Team Member</DialogTitle>
            <DialogDescription className="text-white/70">
              Add a new member to {selectedTeam?.name} by email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member-email" className="text-white">Email Address</Label>
              <Input
                id="member-email"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email address"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <p className="text-sm text-white/70">
              If the user is not registered, they will receive an invitation to join the team when they sign up.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMemberDialog(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={addTeamMember}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
