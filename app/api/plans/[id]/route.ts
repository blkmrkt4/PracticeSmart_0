import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { privacy_level, userId } = data;
    
    if (!id || !privacy_level || !userId) {
      return NextResponse.json({ error: 'Plan ID, privacy level, and user ID are required' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify the user owns this plan
    const { data: planCheck, error: checkError } = await supabase
      .from('training_plans')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      console.error('Error checking plan ownership:', checkError);
      return NextResponse.json({ error: 'You do not have permission to update this plan' }, { status: 403 });
    }
    
    // Update the plan's privacy level
    const { data: updatedPlan, error } = await supabase
      .from('training_plans')
      .update({ privacy_level })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating plan privacy level:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (error) {
    console.error('Error in PATCH plan API:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!id || !userId) {
      return NextResponse.json({ error: 'Plan ID and user ID are required' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify the user owns this plan
    const { data: planCheck, error: checkError } = await supabase
      .from('training_plans')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      console.error('Error checking plan ownership:', checkError);
      return NextResponse.json({ error: 'You do not have permission to delete this plan' }, { status: 403 });
    }
    
    // First delete all team access entries for this plan
    const { error: teamAccessError } = await supabase
      .from('team_training_plan_access')
      .delete()
      .eq('training_plan_id', id);
    
    if (teamAccessError) {
      console.error('Error deleting team access entries:', teamAccessError);
      // Continue with plan deletion even if team access deletion fails
    }
    
    // Delete all plan items
    const { error: itemsError } = await supabase
      .from('training_plan_items')
      .delete()
      .eq('training_plan_id', id);
    
    if (itemsError) {
      console.error('Error deleting plan items:', itemsError);
      // Continue with plan deletion even if items deletion fails
    }
    
    // Delete the plan
    const { error: deleteError } = await supabase
      .from('training_plans')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting plan:', deleteError);
      throw deleteError;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE plan API:', error);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}
