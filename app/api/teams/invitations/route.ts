import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase'; // We'll create a server client per request
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// GET /api/teams/invitations - Get invitations for the current user
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
    console.log('Invitations API route (GET) handler invoked.');
    // Get current user's email
    const { data: { user } } = await supabase.auth.getUser();
    console.log(`Invitations API route user email: ${user?.email || 'No user found in API route'}`);
    
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error: invitationsError } = await supabase
      .from('pending_invitations')
      .select('*, team:team_id(name)')
      .eq('email', user.email.toLowerCase());

    if (invitationsError) throw invitationsError;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/teams/invitations - Create a new invitation
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
    const { teamId, email } = await request.json();

    if (!teamId || !email) {
      return NextResponse.json({ error: 'Team ID and email are required' }, { status: 400 });
    }

    // Get current user to verify they're a team member
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a team member or creator
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamError) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check if user is the team creator or a member
    if (team.created_by !== user.id) {
      const { data: membership, error: membershipError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (membershipError || !membership) {
        return NextResponse.json({ error: 'You must be a team member to send invitations' }, { status: 403 });
      }
    }

    // Check if invitation already exists
    const { data: existingInvites, error: checkError } = await supabase
      .from('pending_invitations')
      .select('*')
      .eq('team_id', teamId)
      .eq('email', email.toLowerCase());

    if (checkError) throw checkError;

    if (existingInvites && existingInvites.length > 0) {
      return NextResponse.json({ error: 'An invitation has already been sent to this email' }, { status: 400 });
    }

    const now = new Date();
    // Set expiration to 7 days from now
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Create invitation
    const invitationId = uuidv4();
    const invitationToken = uuidv4();
    
    const { data: invitation, error: inviteError } = await supabase
      .from('pending_invitations')
      .insert({
        id: invitationId,
        team_id: teamId,
        email: email.toLowerCase(),
        created_at: now.toISOString(),
        expires_at: expiresAt,
        invitation_token: invitationToken
      })
      .select()
      .single();

    if (inviteError) throw inviteError;

    return NextResponse.json(invitation);
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/teams/invitations/:id - Accept an invitation
export async function PUT(request: NextRequest) {
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
    const { invitationId } = await request.json();

    if (!invitationId) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('pending_invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if the invitation is for the current user
    if (invitation.email.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json({ error: 'This invitation is not for you' }, { status: 403 });
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
