import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Create a Supabase client with direct connection (for development only)
const supabaseUrl = 'https://lwvbkcwxjjrlpbgtddoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dmJrY3d4ampybHBiZ3RkZG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjY3MDQsImV4cCI6MjA2MzAwMjcwNH0.bPGn0rDqm1owPwhYcpB5ThSbQiZ4eIPgh5gMPjtLl6Q';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// DELETE /api/teams/[teamId]/members/[memberId] - Remove a member from a team
export async function DELETE(
  request: Request,
  { params }: { params: { teamId: string; memberId: string } }
) {
  try {
    const { teamId, memberId } = params;

    if (!teamId || !memberId) {
      return NextResponse.json(
        { success: false, error: 'Team ID and member ID are required' },
        { status: 400 }
      );
    }

    // Check if the team exists
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamError) {
      console.error('Error fetching team:', teamError);
      return NextResponse.json(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    // First, try to find and delete the member in the team_members table
    const { data: member, error: memberError } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', memberId)
      .eq('team_id', teamId)
      .single();

    if (!memberError && member) {
      // Member found in team_members table, delete it
      const { error: deleteError } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)
        .eq('team_id', teamId);

      if (deleteError) {
        console.error('Error deleting team member:', deleteError);
        throw new Error(`Database error: ${deleteError.message}`);
      }

      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    // If not found in team_members, check in pending_invitations
    const { data: invitation, error: invitationError } = await supabase
      .from('pending_invitations')
      .select('*')
      .eq('id', memberId)
      .eq('team_id', teamId)
      .single();

    if (invitationError) {
      console.error('Error fetching invitation:', invitationError);
      return NextResponse.json(
        { success: false, error: 'Team member or invitation not found' },
        { status: 404 }
      );
    }

    // Delete the pending invitation
    const { error: deleteInvitationError } = await supabase
      .from('pending_invitations')
      .delete()
      .eq('id', memberId)
      .eq('team_id', teamId);

    if (deleteInvitationError) {
      console.error('Error deleting invitation:', deleteInvitationError);
      throw new Error(`Database error: ${deleteInvitationError.message}`);
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove team member' 
      },
      { status: 500 }
    );
  }
}
