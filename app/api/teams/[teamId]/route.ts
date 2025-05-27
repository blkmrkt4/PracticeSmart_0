import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Create a Supabase client with direct connection (for development only)
const supabaseUrl = 'https://lwvbkcwxjjrlpbgtddoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dmJrY3d4ampybHBiZ3RkZG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjY3MDQsImV4cCI6MjA2MzAwMjcwNH0.bPGn0rDqm1owPwhYcpB5ThSbQiZ4eIPgh5gMPjtLl6Q';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// DELETE /api/teams/[teamId] - Delete a team
export async function DELETE(request: Request, { params }: { params: { teamId: string } }) {
  try {
    const { teamId } = params;

    if (!teamId) {
      return NextResponse.json(
        { success: false, error: 'Team ID is required' },
        { status: 400 }
      );
    }

    // First, delete all team members
    const { error: memberDeleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId);

    if (memberDeleteError) {
      console.error('Error deleting team members:', memberDeleteError);
      throw new Error(`Database error: ${memberDeleteError.message}`);
    }

    // Then delete the team
    const { error: teamDeleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (teamDeleteError) {
      console.error('Error deleting team:', teamDeleteError);
      throw new Error(`Database error: ${teamDeleteError.message}`);
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete team' 
      },
      { status: 500 }
    );
  }
}
