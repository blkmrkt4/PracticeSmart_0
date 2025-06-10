import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { teamsId: string } }
) {
  const cookieStorePromise = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const resolvedCookieStore = await cookieStorePromise;
          return resolvedCookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const resolvedCookieStore = await cookieStorePromise;
            (resolvedCookieStore as any).set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const resolvedCookieStore = await cookieStorePromise;
            (resolvedCookieStore as any).set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  );

  const teamId = params.teamsId;

  if (!teamId) {
    return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
  }

  try {
    // Step 1: Delete all members associated with this team
    // Supabase automatically handles this if ON DELETE CASCADE is set on the foreign key
    // in team_members table referencing teams.id. 
    // However, explicit deletion can be safer or used if CASCADE is not set.
    const { error: deleteMembersError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId);

    if (deleteMembersError) {
      console.error('Error deleting team members:', deleteMembersError);
      return NextResponse.json(
        { error: `Failed to delete team members: ${deleteMembersError.message}` },
        { status: 500 }
      );
    }

    // Step 2: Delete the team itself
    const { error: deleteTeamError } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (deleteTeamError) {
      console.error('Error deleting team:', deleteTeamError);
      // Check if it's a foreign key constraint violation (e.g., from activities table)
      if (deleteTeamError.code === '23503') { // PostgreSQL foreign key violation code
         return NextResponse.json(
          { error: 'Failed to delete team: This team is still referenced by other data (e.g., activities). Please remove those references first.' },
          { status: 409 } // 409 Conflict
        );
      }
      return NextResponse.json(
        { error: `Failed to delete team: ${deleteTeamError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Team deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Unexpected error deleting team:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
