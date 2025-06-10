// app/api/training-plans/route.ts
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server'; // Add NextRequest import
import type { Database } from '@/lib/database.types'; // Assuming your DB types are here

// Define the expected shape of the incoming plan data from the client
// This should align with the PracticePlan type on the frontend,
// but we might only expect a subset of fields for creation.
interface NewPracticePlanData {
  name: string;
  sport: string;
  drills: any[]; // Assuming drills is an array of objects. Adjust if more specific type is available.
  privacy_setting: 'public' | 'private' | 'team';
  team_id?: string | null;
  duration?: number; // Optional, as table has a default
}

export async function POST(request: NextRequest) {
  // Initialize Supabase client, calling cookies() inside each method
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            // For removing, typically you'd set an empty value and/or an expired date.
            // Or use cookieStore.delete(name) if available and appropriate for ssr client.
            // The Supabase client might handle the specifics of 'remove'.
            // Sticking to the previous pattern of setting empty value:
            cookieStore.set({ name, value: '', ...options }); 
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = user.id;

  try {
    const planData = (await request.json()) as NewPracticePlanData;

    // Validate required fields
    if (!planData.name || !planData.sport || !planData.drills || !planData.privacy_setting) {
      return NextResponse.json({ error: 'Missing required plan data' }, { status: 400 });
    }
    if (planData.privacy_setting === 'team' && !planData.team_id) {
      return NextResponse.json({ error: 'Team ID is required for team privacy setting' }, { status: 400 });
    }

    const newPlan = {
      user_id: userId,
      name: planData.name,
      title: planData.name, // Populate title with the same value as name
      sport: planData.sport,
      drills: planData.drills, // This will be stored in the JSONB column
      privacy_setting: planData.privacy_setting,
      team_id: planData.privacy_setting === 'team' ? planData.team_id : null,
      duration: planData.duration, // Will use table default if not provided
      last_modified: new Date().toISOString(), // Set last_modified timestamp
    };

    const { data, error } = await supabase
      .from('training_plans')
      .insert(newPlan)
      .select()
      .single(); // Assuming you want to return the created plan

    if (error) {
      console.error('Error inserting training plan:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error('Error processing request:', e);
    return NextResponse.json({ error: 'Failed to create training plan: ' + e.message }, { status: 500 });
  }
}

interface UpdatePracticePlanData {
  id: string; // Plan ID to update
  privacy_setting: 'public' | 'private' | 'team';
  team_id?: string | null;
}

export async function PUT(request: NextRequest) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = user.id;

  try {
    const { id: planId, privacy_setting, team_id } = (await request.json()) as UpdatePracticePlanData;

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }
    if (!privacy_setting) {
      return NextResponse.json({ error: 'Privacy setting is required' }, { status: 400 });
    }
    if (privacy_setting === 'team' && !team_id) {
      return NextResponse.json({ error: 'Team ID is required for team privacy setting' }, { status: 400 });
    }

    // Verify ownership before update
    const { data: existingPlan, error: fetchError } = await supabase
      .from('training_plans')
      .select('user_id')
      .eq('id', planId)
      .single();

    if (fetchError) {
      console.error('Error fetching plan for ownership check:', fetchError);
      return NextResponse.json({ error: 'Plan not found or error checking ownership.' }, { status: 404 });
    }
    if (existingPlan.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this plan.' }, { status: 403 });
    }

    const updateData = {
      privacy_setting,
      team_id: privacy_setting === 'team' ? team_id : null,
      last_modified: new Date().toISOString(),
    };

    const { data, error: updateError } = await supabase
      .from('training_plans')
      .update(updateData)
      .eq('id', planId)
      // .eq('user_id', userId) // RLS should also enforce this, but double check is fine
      .select()
      .single();

    if (updateError) {
      console.error('Error updating training plan:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    console.error('Error processing PUT request:', e);
    return NextResponse.json({ error: 'Failed to update training plan: ' + e.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = user.id;

  try {
    // Fetch plans created by the user. RLS policies should handle other access rights.
    const { data: plans, error } = await supabase
      .from('training_plans')
      .select('*') // Select all columns for now
      .eq('user_id', userId)
      .order('last_modified', { ascending: false }); // Order by most recently modified

    if (error) {
      console.error('Error fetching training plans:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(plans || [], { status: 200 });
  } catch (e: any) {
    console.error('Error processing GET request:', e);
    return NextResponse.json({ error: 'Failed to fetch training plans: ' + e.message }, { status: 500 });
  }
}

// TODO: Implement DELETE handler as needed
// DELETE /api/training-plans/:id - to delete a plan
