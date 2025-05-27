import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Create a Supabase client with direct connection (for development only)
const supabaseUrl = 'https://lwvbkcwxjjrlpbgtddoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dmJrY3d4ampybHBiZ3RkZG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjY3MDQsImV4cCI6MjA2MzAwMjcwNH0.bPGn0rDqm1owPwhYcpB5ThSbQiZ4eIPgh5gMPjtLl6Q';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// GET /api/teams - Get teams for a user
export async function GET(request: Request) {
  try {
    console.log('Teams API called');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log('Requested userId:', userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get teams created by the user
    console.log('Fetching teams created by user:', userId);
    const { data: ownedTeams, error: ownedTeamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('created_by', userId);

    if (ownedTeamsError) {
      console.error('Error fetching owned teams:', ownedTeamsError);
      throw new Error(`Database error: ${ownedTeamsError.message}`);
    }
    console.log('Owned teams found:', ownedTeams?.length || 0);

    // Get teams the user is a member of
    const { data: teamMemberships, error: membershipError } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', userId);

    if (membershipError) {
      console.error('Error fetching team memberships:', membershipError);
      throw new Error(`Database error: ${membershipError.message}`);
    }

    // Get additional teams the user is a member of
    let memberTeams: any[] = [];
    if (teamMemberships && teamMemberships.length > 0) {
      const teamIds = teamMemberships.map(membership => membership.team_id);
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .in('id', teamIds);

      if (teamsError) {
        console.error('Error fetching member teams:', teamsError);
        throw new Error(`Database error: ${teamsError.message}`);
      }

      memberTeams = teams || [];
    }

    // Combine owned and member teams, removing duplicates
    const allTeams = [...(ownedTeams || []), ...memberTeams];
    const uniqueTeams = Array.from(new Map(allTeams.map(team => [team.id, team])).values());

    // For each team, get its members
    const teamsWithMembers = await Promise.all(
      uniqueTeams.map(async (team) => {
        const { data: members, error: membersError } = await supabase
          .from('team_members')
          .select('*')
          .eq('team_id', team.id);

        if (membersError) {
          console.error(`Error fetching members for team ${team.id}:`, membersError);
          return { ...team, members: [] };
        }

        // Get user details for each member
        console.log(`Fetching member details for team ${team.id}, found ${members?.length || 0} members`);
        const membersWithDetails = await Promise.all(
          (members || []).map(async (member) => {
            console.log(`Looking up user details for member: ${member.user_id}`);
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('email, name')
              .eq('id', member.user_id)
              .single();

            if (userError) {
              console.error(`Error fetching user details for ${member.user_id}:`, userError);
              // Don't fail the entire request if we can't get details for one user
              return {
                id: member.id,
                email: 'Unknown',
                isRegistered: true
              };
            }

            return {
              id: member.id,
              email: userData?.email || 'Unknown',
              name: userData?.name,
              isRegistered: true
            };
          })
        );

        return { ...team, members: membersWithDetails };
      })
    );

    return NextResponse.json(
      { success: true, teams: teamsWithMembers },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch teams' 
      },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, created_by } = data;

    if (!name || !created_by) {
      return NextResponse.json(
        { success: false, error: 'Name and created_by are required' },
        { status: 400 }
      );
    }

    console.log('Creating team with name:', name, 'and created_by:', created_by);
    
    // Create the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name,
        created_by
      })
      .select()
      .single();

    if (teamError) {
      console.error('Error creating team:', teamError);
      throw new Error(`Database error: ${teamError.message}`);
    }

    // Add the creator as a team member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: created_by
      });

    if (memberError) {
      console.error('Error adding creator as team member:', memberError);
      // Don't throw here, as the team was created successfully
    }

    return NextResponse.json(
      { 
        success: true, 
        team: { ...team, members: [] }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create team' 
      },
      { status: 500 }
    );
  }
}
