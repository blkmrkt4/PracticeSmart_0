import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { training_plan_id, team_id } = data;
    
    if (!training_plan_id || !team_id) {
      return NextResponse.json({ error: 'Training plan ID and team ID are required' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if the access already exists
    const { data: existingAccess, error: checkError } = await supabase
      .from('team_training_plan_access')
      .select('*')
      .eq('training_plan_id', training_plan_id)
      .eq('team_id', team_id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      console.error('Error checking existing access:', checkError);
      throw checkError;
    }
    
    // If access already exists, return success
    if (existingAccess) {
      return NextResponse.json({ success: true, message: 'Access already exists' });
    }
    
    // Create new access
    const { data: newAccess, error } = await supabase
      .from('team_training_plan_access')
      .insert({
        training_plan_id,
        team_id,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating team access:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true, access: newAccess });
  } catch (error) {
    console.error('Error in team access API:', error);
    return NextResponse.json({ error: 'Failed to save team access' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const training_plan_id = url.searchParams.get('training_plan_id');
    const team_id = url.searchParams.get('team_id');
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // If training_plan_id is provided but no team_id, delete all team access for this plan
    if (training_plan_id && !team_id) {
      console.log('Deleting all team access for plan:', training_plan_id);
      
      const { error } = await supabase
        .from('team_training_plan_access')
        .delete()
        .eq('training_plan_id', training_plan_id);
      
      if (error) {
        console.error('Error deleting all team access for plan:', error);
        throw error;
      }
      
      return NextResponse.json({ success: true, message: 'All team access deleted for plan' });
    }
    
    // If both training_plan_id and team_id are provided, delete specific team access
    if (training_plan_id && team_id) {
      const { error } = await supabase
        .from('team_training_plan_access')
        .delete()
        .eq('training_plan_id', training_plan_id)
        .eq('team_id', team_id);
      
      if (error) {
        console.error('Error deleting team access:', error);
        throw error;
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Training plan ID is required' }, { status: 400 });
  } catch (error) {
    console.error('Error in team access API:', error);
    return NextResponse.json({ error: 'Failed to delete team access' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const training_plan_id = url.searchParams.get('training_plan_id');
    
    if (!training_plan_id) {
      return NextResponse.json({ error: 'Training plan ID is required' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get all teams that have access to this training plan
    const { data: accessList, error } = await supabase
      .from('team_training_plan_access')
      .select(`
        team_id,
        teams:team_id (id, name, created_by)
      `)
      .eq('training_plan_id', training_plan_id);
    
    if (error) {
      console.error('Error fetching team access:', error);
      throw error;
    }
    
    return NextResponse.json({ teams: accessList });
  } catch (error) {
    console.error('Error in team access API:', error);
    return NextResponse.json({ error: 'Failed to fetch team access' }, { status: 500 });
  }
}
