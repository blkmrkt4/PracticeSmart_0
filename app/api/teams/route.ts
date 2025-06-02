import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase'; // We'll create a server client per request
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// GET /api/teams - Get teams for the current user
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    let memberTeamsData = [];
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

    return NextResponse.json(teamsWithCounts);
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        created_by: user.id
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

    return NextResponse.json({ id: teamId, name, created_at: now, updated_at: now, created_by: user.id });
  } catch (error: any) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
