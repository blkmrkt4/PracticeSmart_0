import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
    name?: string;
  };
};

type PendingInvitation = {
  id: string;
  team_id: string;
  email: string;
  created_at: string;
  expires_at: string;
  invitation_token: string;
  team?: {
    name: string;
  };
};

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams where the current user is a member
  const fetchUserTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get teams created by the user
      const { data: createdTeams, error: createdTeamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('created_by', user.id);

      if (createdTeamsError) throw createdTeamsError;

      // Get teams where the user is a member
      const { data: memberTeams, error: memberTeamsError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      if (memberTeamsError) throw memberTeamsError;

      // If user is a member of any teams, fetch those teams
      let memberTeamsData: Team[] = [];
      if (memberTeams && memberTeams.length > 0) {
        const teamIds = memberTeams.map(tm => tm.team_id);
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select('*')
          .in('id', teamIds);

        if (teamsError) throw teamsError;
        memberTeamsData = teams || [];
      }

      // Combine and deduplicate teams
      const allTeams = [...(createdTeams || []), ...memberTeamsData];
      const uniqueTeams = Array.from(new Map(allTeams.map(team => [team.id, team])).values());

      // Get member counts for each team
      const teamsWithCounts = await Promise.all(uniqueTeams.map(async (team) => {
        const { count, error: countError } = await supabase
          .from('team_members')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', team.id);

        if (countError) throw countError;
        return { ...team, memberCount: count || 0 };
      }));

      setTeams(teamsWithCounts);
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members of a specific team
  const fetchTeamMembers = async (teamId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: membersError } = await supabase
        .from('team_members')
        .select('*, user:user_id(email, name)')
        .eq('team_id', teamId);

      if (membersError) throw membersError;

      setTeamMembers(data || []);
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending invitations for a team
  const fetchTeamInvitations = async (teamId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: invitationsError } = await supabase
        .from('pending_invitations')
        .select('*')
        .eq('team_id', teamId);

      if (invitationsError) throw invitationsError;

      setPendingInvitations(data || []);
    } catch (err: any) {
      console.error('Error fetching team invitations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch invitations for the current user
  const fetchUserInvitations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user's email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email) {
        throw new Error('User not authenticated or email not available');
      }

      const { data, error: invitationsError } = await supabase
        .from('pending_invitations')
        .select('*, team:team_id(name)')
        .eq('email', user.email.toLowerCase());

      if (invitationsError) throw invitationsError;

      setPendingInvitations(data || []);
    } catch (err: any) {
      console.error('Error fetching user invitations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new team
  const createTeam = async (name: string, description?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const teamId = uuidv4();
      const now = new Date().toISOString();

      // Create the team
      const { error: teamError } = await supabase
        .from('teams')
        .insert({
          id: teamId,
          name,
          created_at: now,
          updated_at: now,
          created_by: user.id,
          description: description || ''
        });

      if (teamError) throw teamError;

      // Add the creator as a team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          id: uuidv4(),
          team_id: teamId,
          user_id: user.id,
          created_at: now
        });

      if (memberError) throw memberError;

      // Refresh the teams list
      await fetchUserTeams();

      return teamId;
    } catch (err: any) {
      console.error('Error creating team:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Invite a user to a team
  const inviteToTeam = async (teamId: string, email: string) => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      // Set expiration to 7 days from now
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Check if invitation already exists
      const { data: existingInvites, error: checkError } = await supabase
        .from('pending_invitations')
        .select('*')
        .eq('team_id', teamId)
        .eq('email', email.toLowerCase());

      if (checkError) throw checkError;

      if (existingInvites && existingInvites.length > 0) {
        throw new Error('An invitation has already been sent to this email');
      }

      // Create invitation
      const { error: inviteError } = await supabase
        .from('pending_invitations')
        .insert({
          id: uuidv4(),
          team_id: teamId,
          email: email.toLowerCase(),
          created_at: now.toISOString(),
          expires_at: expiresAt,
          invitation_token: uuidv4()
        });

      if (inviteError) throw inviteError;

      // Refresh invitations
      await fetchTeamInvitations(teamId);

      return true;
    } catch (err: any) {
      console.error('Error inviting to team:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Accept an invitation
  const acceptInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('pending_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (inviteError) throw inviteError;
      if (!invitation) throw new Error('Invitation not found');

      // Check if invitation has expired
      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }

      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          id: uuidv4(),
          team_id: invitation.team_id,
          user_id: user.id,
          created_at: new Date().toISOString()
        });

      if (memberError) throw memberError;

      // Delete the invitation
      const { error: deleteError } = await supabase
        .from('pending_invitations')
        .delete()
        .eq('id', invitationId);

      if (deleteError) throw deleteError;

      // Refresh user teams and invitations
      await fetchUserTeams();
      await fetchUserInvitations();

      return true;
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove a member from a team
  const removeTeamMember = async (teamId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user to verify they're the team creator
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the team to check if current user is the creator
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;
      
      // Only team creator can remove members
      if (team.created_by !== user.id) {
        throw new Error('Only the team creator can remove members');
      }

      // Remove the member
      const { error: removeError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (removeError) throw removeError;

      // Refresh team members
      await fetchTeamMembers(teamId);

      return true;
    } catch (err: any) {
      console.error('Error removing team member:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a team
  const deleteTeam = async (teamId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user to verify they're the team creator
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the team to check if current user is the creator
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;
      
      // Only team creator can delete the team
      if (team.created_by !== user.id) {
        throw new Error('Only the team creator can delete the team');
      }

      // Delete all team members
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId);

      if (membersError) throw membersError;

      // Delete all pending invitations
      const { error: invitationsError } = await supabase
        .from('pending_invitations')
        .delete()
        .eq('team_id', teamId);

      if (invitationsError) throw invitationsError;

      // Delete the team
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (deleteError) throw deleteError;

      // Refresh teams
      await fetchUserTeams();

      return true;
    } catch (err: any) {
      console.error('Error deleting team:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    teams,
    teamMembers,
    pendingInvitations,
    loading,
    error,
    fetchUserTeams,
    fetchTeamMembers,
    fetchTeamInvitations,
    fetchUserInvitations,
    createTeam,
    inviteToTeam,
    acceptInvitation,
    removeTeamMember,
    deleteTeam
  };
}
