"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Settings, Share2, Trash2, UserX } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Team types
type Team = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  memberCount?: number;
};

type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  created_at: string;
  user?: {
    email: string;
  };
};

type TeamInvitation = {
  id: string;
  team_id: string;
  email: string;
  created_at: string;
  expires_at: string;
  invitation_token: string;
  team?: {
    name: string;
  };
  status?: string;
};

export default function TeamsPage() {
  // State
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Team expansion state
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [newMemberEmails, setNewMemberEmails] = useState<Record<string, string>>({});
  const [isAddingMember, setIsAddingMember] = useState<Record<string, boolean>>({});
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  
  // Dialog state - keeping for backward compatibility
  const [teamDetailsOpen, setTeamDetailsOpen] = useState(false);
  
  // Form state
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // Toggle team expansion
  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeams(prev => {
      const newState = { ...prev, [teamId]: !prev[teamId] };
      
      // If expanding, fetch team members
      if (newState[teamId]) {
        fetchTeamMembers(teamId);
      }
      
      return newState;
    });
  };
  
  // Set member email for a specific team
  const setMemberEmail = (teamId: string, email: string) => {
    setNewMemberEmails(prev => ({
      ...prev,
      [teamId]: email
    }));
  };
  
  // Set adding member state for a specific team
  const setAddingMember = (teamId: string, isAdding: boolean) => {
    setIsAddingMember(prev => ({
      ...prev,
      [teamId]: isAdding
    }));
  };
  
  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams();
    fetchInvitations();
  }, []);
  
  // Fetch teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teams');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch teams');
      }
      
      const data = await response.json();
      setTeams(data);
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch team members
  const fetchTeamMembers = async (teamId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teams/members?teamId=${teamId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch team members');
      }
      
      const data = await response.json();
      setTeamMembers(prev => ({
        ...prev,
        [teamId]: data
      }));
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch invitations
  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teams/invitations');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch invitations');
      }
      
      const data = await response.json();
      setInvitations(data);
    } catch (err: any) {
      console.error('Error fetching invitations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Create team
  const createTeam = async () => {
    try {
      if (!newTeamName.trim()) {
        toast({
          title: "Error",
          description: "Team name is required",
          variant: "destructive",
        });
        return;
      }
      
      setLoading(true);
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTeamName,
          description: newTeamDescription,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create team');
      }
      
      await fetchTeams();
      setNewTeamName("");
      setNewTeamDescription("");
      toast({
        title: "Success",
        description: "Team created successfully",
      });
    } catch (err: any) {
      console.error('Error creating team:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsCreatingTeam(false);
    }
  };
  
  // Add or invite member to team
  const addOrInviteMember = async (teamId: string) => {
    try {
      const email = newMemberEmails[teamId];
      
      if (!email || !email.trim()) {
        toast({
          title: "Error",
          description: "Email is required",
          variant: "destructive",
        });
        return;
      }
      
      setAddingMember(teamId, true);
      
      // Use the new API endpoint for adding/inviting members
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add/invite member');
      }
      
      const result = await response.json();
      
      // Clear the input field
      setMemberEmail(teamId, "");
      
      // Refresh team members if a user was added directly
      if (result.type === 'member_added') {
        fetchTeamMembers(teamId);
      }
      
      // Show appropriate toast message based on the result
      let toastMessage = "Action completed successfully";
      if (result.type === 'member_added') {
        toastMessage = "User added to team successfully";
      } else if (result.type === 'invitation_sent') {
        toastMessage = "Invitation sent successfully";
      } else if (result.type === 'member_exists') {
        toastMessage = "User is already a member of this team";
      } else if (result.type === 'invitation_exists') {
        toastMessage = "An invitation is already pending for this email";
      }
      
      toast({
        title: "Success",
        description: toastMessage,
      });
      
      // Refresh invitations list if an invitation was sent
      if (result.type === 'invitation_sent') {
        fetchInvitations();
      }
    } catch (err: any) {
      console.error('Error adding/inviting member:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setAddingMember(teamId, false);
    }
  };
  
  // Accept invitation
  const acceptInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/teams/invitations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationId,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to accept invitation');
      }
      
      await fetchTeams();
      await fetchInvitations();
      toast({
        title: "Success",
        description: "Invitation accepted successfully",
      });
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Remove team member
  const removeTeamMember = async (teamId: string, userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove team member');
      }
      
      // Refresh team members
      fetchTeamMembers(teamId);
      
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    } catch (err: any) {
      console.error('Error removing team member:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Open team details
  const openTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    fetchTeamMembers(team.id);
    setTeamDetailsOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="container py-6 space-y-6 bg-black text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Teams</h1>
      </div>
      
      {/* Inline Team Creation Form */}
      <Card className="bg-black/40 border border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-white">Create a New Team</CardTitle>
          <CardDescription className="text-gray-400">Create a team to collaborate with others</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-team-name" className="text-white">Team Name</Label>
              <Input 
                id="new-team-name" 
                placeholder="Enter team name" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-team-description" className="text-white">Description (Optional)</Label>
              <Input 
                id="new-team-description" 
                placeholder="Brief description of your team" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={createTeam}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Team"}
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="my-teams">
        <TabsList className="bg-black/40 border border-white/10">
          <TabsTrigger value="my-teams" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">My Teams</TabsTrigger>
          <TabsTrigger value="invitations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Invitations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-teams" className="space-y-4">
          {loading && <p className="text-center text-gray-400">Loading teams...</p>}
          
          {!loading && teams.length === 0 && (
            <Card className="bg-black/40 border border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-white">No Teams Found</CardTitle>
                <CardDescription className="text-gray-400">You haven't created or joined any teams yet.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Users className="h-16 w-16 text-purple-400" />
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreatingTeam(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Team
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {!loading && teams.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <Card key={team.id} className="bg-black/40 border border-white/10 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-white">{team.name}</CardTitle>
                      </div>
                      <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
                        {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    <CardDescription className="text-gray-400">
                      Created on {formatDate(team.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="link" 
                      className="text-blue-400 p-0 h-auto font-normal"
                      onClick={() => toggleTeamExpansion(team.id)}
                    >
                      {expandedTeams[team.id] ? "Hide details" : "Show details"}
                    </Button>
                    
                    {expandedTeams[team.id] && (
                      <div className="mt-4 space-y-4">
                        {/* Team Members List */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Team Members</h4>
                          {!teamMembers[team.id] ? (
                            <p className="text-xs text-gray-400">Loading members...</p>
                          ) : teamMembers[team.id].length === 0 ? (
                            <p className="text-xs text-gray-400">No members yet</p>
                          ) : (
                            <ul className="space-y-1">
                              {teamMembers[team.id].map((member) => (
                                <li key={member.id} className="flex items-center justify-between text-sm">
                                  <span>{member.user?.email}</span>
                                  {team.created_by !== member.user_id && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                      onClick={() => removeTeamMember(team.id, member.user_id)}
                                    >
                                      <UserX className="h-3 w-3" />
                                    </Button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        
                        {/* Add Member Form */}
                        <div className="pt-2 border-t border-white/10">
                          <h4 className="text-sm font-medium mb-2">Add Member</h4>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Email address"
                              className="flex-1 h-8 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              value={newMemberEmails[team.id] || ''}
                              onChange={(e) => setMemberEmail(team.id, e.target.value)}
                            />
                            <Button
                              size="sm"
                              className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={isAddingMember[team.id]}
                              onClick={() => addOrInviteMember(team.id)}
                            >
                              {isAddingMember[team.id] ? "Adding..." : "Add"}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Enter email to add existing user or send invitation
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
                      onClick={() => openTeamDetails(team)}
                    >
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Add a 'Create Team' card at the end of the list */}
              <Card className="bg-black/40 border border-white/10 text-white border-dashed">
                <CardHeader>
                  <CardTitle className="text-white">Create a Team</CardTitle>
                  <CardDescription className="text-gray-400">Start collaborating with others</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <Users className="h-16 w-16 text-purple-400/50" />
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreatingTeam(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create New Team
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="invitations" className="space-y-4">
          {loading && <p className="text-center text-gray-400">Loading invitations...</p>}
          
          {!loading && invitations.length === 0 && (
            <Card className="bg-black/40 border border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-white">No Pending Invitations</CardTitle>
                <CardDescription className="text-gray-400">You don't have any pending team invitations.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">When someone invites you to join their team, it will appear here.</p>
              </CardContent>
            </Card>
          )}
          
          {!loading && invitations.length > 0 && (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="bg-black/40 border border-white/10 text-white">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <CardTitle className="text-white">{invitation.team?.name}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">
                      Invited on {formatDate(invitation.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      This invitation expires on {formatDate(invitation.expires_at)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => acceptInvitation(invitation.id)}
                    >
                      Accept Invitation
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Team Details Dialog */}
      <Dialog open={teamDetailsOpen} onOpenChange={setTeamDetailsOpen}>
        <DialogContent className="bg-black/90 border border-white/10 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedTeam?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage team members and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">Team Members</h3>
            {!selectedTeam || !teamMembers[selectedTeam.id] ? (
              <p className="text-gray-400">Loading team members...</p>
            ) : (
              <Table className="text-white">
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Joined</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTeam && teamMembers[selectedTeam.id] ? teamMembers[selectedTeam.id].map((member) => (
                    <TableRow key={member.id} className="border-white/10">
                      <TableCell>{member.user?.email}</TableCell>
                      <TableCell>{formatDate(member.created_at)}</TableCell>
                      <TableCell className="text-right">
                        {selectedTeam?.created_by !== member.user_id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => removeTeamMember(member.team_id, member.user_id)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-400">No members found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white mr-2"
                onClick={() => {
                  // Close the details dialog
                  setTeamDetailsOpen(false);
                  
                  // If we have a selected team, expand it to show the add member form
                  if (selectedTeam) {
                    toggleTeamExpansion(selectedTeam.id);
                  }
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
