import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const activityData = await request.json();
    const supabase = createRouteHandlerClient({ cookies });
    
    // Add required fields with defaults for testing
    const activityWithUser = {
      ...activityData,
      // Required fields with defaults if not provided
      title: activityData.title || 'Test Activity',
      sport: activityData.sport || 'General',
      description: activityData.description || 'Test description',
      duration: activityData.duration || 30,
      // Must be one of: 'All Levels', 'Beginner', 'Intermediate', 'Advanced'
      skill_level: activityData.skill_level || 'All Levels',
      // Handle the renamed field - map focus_area to activity_tagging if present
      activity_tagging: activityData.activity_tagging || activityData.focus_area || '',
      is_custom: activityData.is_custom !== undefined ? activityData.is_custom : true,
      // Using a fixed test UUID for user_id during development
      user_id: '00000000-0000-0000-0000-000000000000',
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('drills')
      .insert(activityWithUser)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      console.error('Activity data sent:', JSON.stringify(activityWithUser, null, 2));
      throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
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
