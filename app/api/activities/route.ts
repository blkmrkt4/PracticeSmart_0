import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const activityData = await request.json();
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Add user_id to the activity data
    const activityWithUser = {
      ...activityData,
      user_id: session.user.id,
      created_at: new Date().toISOString()
    };
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('drills')
      .insert(activityWithUser)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    
    return NextResponse.json(
      { 
        success: true, 
        data: data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create activity' 
      },
      { status: 500 }
    );
  }
}
