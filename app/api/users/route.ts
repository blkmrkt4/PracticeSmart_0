import { NextRequest, NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Define a type for the user object we expect from the database
interface DbUser {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string;
  // Add any other fields you expect from your 'users' table
}

// Define a type for team membership
interface TeamMembership {
  team_id: string;
  teams: {
    id: string;
    name: string;
  } | null; // teams can be null if the join fails or team is deleted
}

// GET /api/users - Get all users and their team memberships
export async function GET(request: NextRequest) {
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

  try {
    // Get current user to verify authentication (optional, depends on your app's security model for this endpoint)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      console.error('Auth error fetching users:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users from your public 'users' table
    // Based on your previous query: SELECT * FROM users LIMIT 1;
    // this table has 'id', 'email', 'created_at', 'updated_at', 'is_subscribed', 'name'
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, created_at') as { data: DbUser[] | null, error: any };

    if (usersError) {
      console.error('Error fetching users from DB:', usersError);
      throw usersError;
    }
    
    if (!users) {
      return NextResponse.json({ users: [] });
    }

    // For each user, fetch their team memberships
    const usersWithTeams = await Promise.all(
      users.map(async (user) => {
        const { data: memberships, error: membershipError } = await supabase
          .from('team_members')
          .select('team_id, teams!inner(id, name)') // Assumes 'teams' is the related table name
          .eq('user_id', user.id) as { data: TeamMembership[] | null, error: any };

        if (membershipError) {
          console.error(`Error fetching memberships for user ${user.id}:`, membershipError);
          // Decide how to handle: return user without teams, or skip user, or throw error
          return { ...user, teams: [] }; 
        }
        
        return {
          ...user,
          teams: memberships?.map(m => m.teams).filter(t => t !== null) || [] // Filter out null teams
        };
      })
    );

    return NextResponse.json(usersWithTeams);
  } catch (error: any) {
    console.error('General error in GET /api/users:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
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

  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Insert the new user into the 'users' table
    // Adjust table and column names if they differ in your Supabase schema
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ email, name: name || null }]) // Ensure name can be null if not provided
      .select('id, email, name, created_at')
      .single(); // Use .single() if you expect one row back and want it as an object

    if (insertError) {
      console.error('Error creating user:', insertError);
      if (insertError.code === '23505') { // Unique constraint violation (e.g., email already exists)
        return NextResponse.json({ error: 'User with this email already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: insertError.message || 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json(newUser, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error('General error in POST /api/users:', error);
    if (error.name === 'SyntaxError') {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE /api/users - Delete a user by ID
export async function DELETE(request: NextRequest) {
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

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required for deletion' }, { status: 400 });
    }

    // First, delete references in team_members table if RLS doesn't handle cascade or if you want to be explicit
    // This step might be optional if your database schema handles cascades or if users aren't always in teams.
    const { error: deleteMembersError } = await supabase
      .from('team_members')
      .delete()
      .eq('user_id', userId);

    if (deleteMembersError) {
      console.error(`Error deleting team memberships for user ${userId}:`, deleteMembersError);
      // Decide if this is a critical error. For now, we'll log and continue.
    }

    // Delete the user from the 'users' table
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json({ error: deleteError.message || 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('General error in DELETE /api/users:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
