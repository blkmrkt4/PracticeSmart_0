import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { randomBytes } from 'crypto';

// Create a Supabase client with direct connection (for development only)
const supabaseUrl = 'https://lwvbkcwxjjrlpbgtddoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dmJrY3d4ampybHBiZ3RkZG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjY3MDQsImV4cCI6MjA2MzAwMjcwNH0.bPGn0rDqm1owPwhYcpB5ThSbQiZ4eIPgh5gMPjtLl6Q';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Generate a random invitation token
function generateInvitationToken(): string {
  return randomBytes(32).toString('hex');
}

// POST /api/teams/[teamId]/members - Add a member to a team
export async function POST(request: Request, { params }: { params: { teamId: string } }) {
  try {
    const { teamId } = params;
    const data = await request.json();
    const { email } = data;

    if (!teamId || !email) {
      return NextResponse.json(
        { success: false, error: 'Team ID and email are required' },
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

    // Check if the user exists by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    // Check if there's already a pending invitation for this email
    const { data: existingInvitation, error: invitationError } = await supabase
      .from('pending_invitations')
      .select('*')
      .eq('team_id', teamId)
      .eq('email', email)
      .single();

    if (!invitationError && existingInvitation) {
      return NextResponse.json(
        { 
          success: true, 
          member: {
            id: existingInvitation.id,
            email,
            isRegistered: false
          },
          message: 'Invitation already sent to this email'
        },
        { status: 200 }
      );
    }

    let memberId;
    let isRegistered = true;

    if (userError) {
      // User doesn't exist, create a pending invitation
      console.log('User not found, creating invitation for:', email);
      isRegistered = false;
      
      // Generate an invitation token
      const invitationToken = generateInvitationToken();
      
      // Store the invitation in the pending_invitations table
      const { data: invitation, error: createInvitationError } = await supabase
        .from('pending_invitations')
        .insert({
          team_id: teamId,
          email,
          invitation_token: invitationToken
        })
        .select()
        .single();

      if (createInvitationError) {
        console.error('Error creating invitation:', createInvitationError);
        throw new Error(`Database error: ${createInvitationError.message}`);
      }

      memberId = invitation.id;
      
      // In a production environment, you would send an email with the invitation link
      // containing the invitation token
      console.log(`Invitation created with token: ${invitationToken}`);
    } else {
      // User exists, check if already a member
      const { data: existingMember, error: memberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (!memberError && existingMember) {
        return NextResponse.json(
          { success: false, error: 'User is already a member of this team' },
          { status: 400 }
        );
      }

      // Use the actual user ID from the database
      const userId = user.id;

      // Add the user as a team member
      const { data: member, error: addError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId
        })
        .select()
        .single();

      if (addError) {
        console.error('Error adding team member:', addError);
        throw new Error(`Database error: ${addError.message}`);
      }

      memberId = member.id;
    }

    return NextResponse.json(
      { 
        success: true, 
        member: {
          id: memberId,
          email,
          isRegistered
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add team member' 
      },
      { status: 500 }
    );
  }
}
