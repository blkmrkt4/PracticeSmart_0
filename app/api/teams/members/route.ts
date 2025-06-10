import { type NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase'; // Using createRouteHandlerClient instead
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types'; // Make sure this path is correct
// import { v4 as uuidv4 } from 'uuid'; // Not used in this version

// POST /api/teams/members - Add a user to a team
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const { email, team_id: teamId } = await request.json();

    if (!email || !teamId) {
      return NextResponse.json(
        { error: 'Email and team_id are required' },
        { status: 400 }
      );
    }

    // Optional: Validate current user's permission to add members if needed
    // const { data: { user: currentUser } } = await supabase.auth.getUser();
    // if (!currentUser) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // Further permission checks can be added here, e.g., is currentUser admin or team owner?

    // 1. Find the user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('Error finding user by email:', userError);
      return NextResponse.json({ error: 'User not found with that email' }, { status: 404 });
    }
    const userId = userData.id;

    // 2. Check if the user is already a member of the team
    const { data: existingMember, error: checkError } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to not error if no record found

    if (checkError) {
      console.error('Error checking existing membership:', checkError);
      throw checkError;
    }

    if (existingMember) {
      return NextResponse.json(
        { message: 'User is already a member of this team', member: existingMember },
        { status: 200 } // Or 409 Conflict if preferred
      );
    }

    // 3. Add user to the team
    const { data: newMember, error: insertError } = await supabase
      .from('team_members')
      .insert([{ team_id: teamId, user_id: userId }])
      .select()
      .single();

    if (insertError) {
      console.error('Error adding user to team:', insertError);
      throw insertError;
    }

    return NextResponse.json(
      { message: 'User added to team successfully', member: newMember },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error in POST /api/teams/members:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add user to team' },
      { status: 500 }
    );
  }
}

// GET /api/teams/members?teamId=xxx - Get members of a team
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, created_by')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.created_by !== currentUser.id) {
      const { data: membership, error: membershipError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (membershipError || !membership) {
        return NextResponse.json({ error: 'You must be a team member to view members' }, { status: 403 });
      }
    }

    const { data: membersData, error: membersError } = await supabase
      .from('team_members')
      .select(`
        user_id,
        users (id, name, email, created_at)
      `)
      .eq('team_id', teamId);

    if (membersError) {
      console.error('Error fetching team members (GET /api/teams/members):', membersError);
      throw membersError;
    }
    
    const members = membersData?.map(tm => {
      const userObject = tm.users && Array.isArray(tm.users) ? tm.users[0] : tm.users;
      if (!userObject) {
        return {
          id: tm.user_id,
          name: 'Unknown User',
          email: 'unknown@example.com',
          created_at: new Date().toISOString(),
        };
      }
      return {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        created_at: userObject.created_at,
      };
    }) || [];

    return NextResponse.json(members);
  } catch (error: any) {
    console.error('Error in GET /api/teams/members:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch team members' }, { status: 500 });
  }
}

// DELETE /api/teams/members - Remove a member from a team
export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  try {
    const { teamId, userId } = await request.json();

    if (!teamId || !userId) {
      return NextResponse.json({ error: 'Team ID and User ID are required' }, { status: 400 });
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, created_by')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    if (team.created_by !== currentUser.id) {
      return NextResponse.json({ error: 'Only the team creator can remove members' }, { status: 403 });
    }

    if (userId === team.created_by) {
      return NextResponse.json({ error: 'Cannot remove the team creator' }, { status: 400 });
    }

    const { error: removeError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (removeError) {
      console.error('Error removing team member (DELETE /api/teams/members):', removeError);
      throw removeError;
    }

    return NextResponse.json({ message: 'Team member removed successfully' });
  } catch (error: any) {
    console.error('Error in DELETE /api/teams/members:', error);
    return NextResponse.json({ error: error.message || 'Failed to remove team member' }, { status: 500 });
  }
}
