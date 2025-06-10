import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const activityData = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      console.error('Error getting session or user ID:', sessionError);
      return NextResponse.json(
        { success: false, error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    const userId = session.user.id;
    
    // Extract tagClassification and any other UI-only fields
    // These fields are used in the frontend but not stored in the database
    const { tagClassification, ...dbSafeData } = activityData;

    // Process privacy settings
    const privacySetting = dbSafeData.privacy_setting || 'private';
    const teamId = privacySetting === 'team' ? dbSafeData.team_id : null;
    
    // Add required fields with defaults for testing
    const activityWithUser = {
      ...dbSafeData,
      // Required fields with defaults if not provided
      title: dbSafeData.title || 'Test Activity',
      sport: dbSafeData.sport || 'General',
      description: dbSafeData.description || 'Test description',
      duration: dbSafeData.duration || 30,
      // Must be one of: 'All Levels', 'Beginner', 'Intermediate', 'Advanced'
      skill_level: dbSafeData.skill_level || 'All Levels',
      // Handle the renamed field - map focus_area to activity_tagging if present
      activity_tagging: dbSafeData.activity_tagging || dbSafeData.focus_area || '',
      is_custom: dbSafeData.is_custom !== undefined ? dbSafeData.is_custom : true,
      user_id: userId, // Replaced hardcoded UUID with actual user ID
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Add processed privacy fields
      privacy_setting: privacySetting,
      team_id: teamId,
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
