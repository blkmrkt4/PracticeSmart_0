import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Create a Supabase client with direct connection (for development only)
// In production, you would use createRouteHandlerClient with proper cookie handling
const supabaseUrl = 'https://lwvbkcwxjjrlpbgtddoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dmJrY3d4ampybHBiZ3RkZG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjY3MDQsImV4cCI6MjA2MzAwMjcwNH0.bPGn0rDqm1owPwhYcpB5ThSbQiZ4eIPgh5gMPjtLl6Q';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const activityData = await request.json();
    
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
      // Using Robin Hutchinson's user ID for testing
      user_id: '597256d8-8bbd-412d-a857-8e6c8b0244d3',
      // Privacy level - default to private if not specified
      privacy_level: activityData.privacy_level || 'private',
      // Team ID - only include if privacy level is team and team_id is provided
      team_id: activityData.privacy_level === 'team' && activityData.team_id ? activityData.team_id : null,
      // Owner ID - for tracking who created the activity
      owner_id: '597256d8-8bbd-412d-a857-8e6c8b0244d3',
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Creating activity with privacy level:', activityWithUser.privacy_level);
    if (activityWithUser.privacy_level === 'team') {
      console.log('Team ID:', activityWithUser.team_id);
    }
    
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
