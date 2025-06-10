import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types'; // Make sure this path is correct

// GET handler to fetch all members of a specific team
export async function GET(
  request: NextRequest,
  { params }: { params: { teamsId: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const teamId = params.teamsId;

  if (!teamId) {
    return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
  }

  try {
    const { data: teamMembersData, error: teamMembersError } = await supabase
      .from('team_members')
      .select(`
        user_id,
        users (
          id,
          email,
          name,
          created_at
        )
      `)
      .eq('team_id', teamId);

    if (teamMembersError) {
      console.error('Error fetching team members (GET):', teamMembersError);
      throw teamMembersError;
    }

    const members = teamMembersData.map(tm => {
      // tm.users can be UserObject | UserObject[] | null based on Supabase types and select query.
      // The lint error suggests TypeScript infers it as UserObject[] for this specific case.
      // We will robustly handle it by taking the first element if it's an array.
      const userObject = tm.users && Array.isArray(tm.users) ? tm.users[0] : tm.users;

      if (!userObject) {
        // This case handles if tm.users was null, or an empty array, or tm.users[0] was null (though unlikely for [0]).
        console.warn(`User data missing or in unexpected format for user_id: ${tm.user_id} in team: ${teamId}`);
        return {
          id: tm.user_id, // Fallback to user_id from team_members table
          name: 'Unknown User',
          email: 'unknown@example.com',
          created_at: new Date().toISOString(), // Placeholder date
          teams: [] // Placeholder for User type compatibility
        };
      }
      // Now userObject is expected to be a single user object.
      return {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        created_at: userObject.created_at,
        teams: [] // This is for the User type on frontend, not directly populated here
      };
    });

    return NextResponse.json(members);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch team members' }, { status: 500 });
  }
}

// PUT handler to update all members of a specific team
export async function PUT(
  request: NextRequest,
  { params }: { params: { teamsId: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const teamId = params.teamsId;

  if (!teamId) {
    return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
  }

  let memberIds: string[];
  try {
    const body = await request.json();
    memberIds = body.memberIds;
    if (!Array.isArray(memberIds) || !memberIds.every(id => typeof id === 'string')) {
      throw new Error('memberIds must be an array of strings.');
    }
  } catch (e: any) {
    return NextResponse.json({ error: `Invalid request body: ${e.message}. Expected { memberIds: string[] }` }, { status: 400 });
  }

  try {
    // Transaction: Delete existing members, then insert new ones.
    // This is typically done in a database transaction. Supabase JS client might not directly expose transactions
    // for multiple operations like this in a single client-side block. A PL/pgSQL function would be more robust.
    // For now, we'll do it sequentially.

    // 1. Delete all existing members for this team
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId);

    if (deleteError) {
      console.error('Error deleting old team members (PUT):', deleteError);
      throw deleteError;
    }

    // 2. Insert new members if any are provided
    if (memberIds.length > 0) {
      const newMembersData = memberIds.map(userId => ({
        team_id: teamId,
        user_id: userId,
        // 'created_by' or other audit fields might be needed depending on table schema
      }));

      const { error: insertError } = await supabase
        .from('team_members')
        .insert(newMembersData);

      if (insertError) {
        console.error('Error inserting new team members (PUT):', insertError);
        // Potentially attempt to rollback or handle partial failure if critical
        throw insertError;
      }
    }
    
    return NextResponse.json({ message: 'Team members updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update team members' }, { status: 500 });
  }
}
