import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Define the PracticeDrill type
interface PracticeDrill {
  id: string;
  drillId: string;
  name: string;
  duration: number;
  description: string;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    console.log('Fetching plans for user ID:', userId);
    
    // Get plans created by the user
    const { data: ownPlans, error: ownPlansError } = await supabase
      .from('training_plans')
      .select('*, team_access:team_training_plan_access(team_id, teams:team_id(id, name))')
      .eq('user_id', userId);
    
    if (ownPlansError) {
      console.error('Error fetching own plans:', ownPlansError);
      throw ownPlansError;
    }
    
    // Get plans shared with the user's teams
    const { data: userTeams, error: teamsError } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', userId);
    
    if (teamsError) {
      console.error('Error fetching user teams:', teamsError);
      // Continue with own plans only
    }
    
    let teamPlans: any[] = [];
    if (userTeams && userTeams.length > 0) {
      const teamIds = userTeams.map(t => t.team_id);
      
      // Get plans shared with user's teams
      const { data: sharedPlans, error: sharedError } = await supabase
        .from('team_training_plan_access')
        .select('training_plan_id, training_plans:training_plan_id(*)')
        .in('team_id', teamIds);
      
      if (sharedError) {
        console.error('Error fetching shared plans:', sharedError);
      } else if (sharedPlans) {
        // Extract unique plans and format them
        const uniquePlans = new Map<string, any>();
        
        sharedPlans.forEach(item => {
          const planData = item.training_plans;
          // Check if training_plans is a valid object with an id
          if (planData && typeof planData === 'object' && 'id' in planData && !Array.isArray(planData)) {
            // Safely cast planData to a type with user_id and id properties
            const typedPlanData = planData as { id: string; user_id: string; [key: string]: any };
            
            // Don't include plans the user already owns
            if (typedPlanData.user_id !== userId) {
              uniquePlans.set(typedPlanData.id, {
                ...typedPlanData,
                shared: true
              });
            }
          }
        });
        
        teamPlans = Array.from(uniquePlans.values());
      }
    }
    
    // Combine own plans and team plans
    const plans = [...(ownPlans || []), ...teamPlans];
    
    // For each plan, fetch its items/drills
    if (plans && plans.length > 0) {
      const plansWithItems = await Promise.all(plans.map(async (plan) => {
        const { data: items, error: itemsError } = await supabase
          .from('training_plan_items')
          .select(`
            id,
            position,
            duration,
            drills (*)
          `)
          .eq('training_plan_id', plan.id)
          .order('position');
          
        if (itemsError) {
          console.error('Error fetching plan items:', itemsError);
          return { ...plan, items: [] };
        }
        
        return { ...plan, items: items || [] };
      }));
      
      return NextResponse.json({ plans: plansWithItems });
    }
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error in plans API:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { planId, privacy_level, userId } = data;
    
    if (!planId || !privacy_level || !userId) {
      return NextResponse.json({ error: 'Plan ID, privacy level, and user ID are required' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify the user owns this plan
    const { data: planCheck, error: checkError } = await supabase
      .from('training_plans')
      .select('id')
      .eq('id', planId)
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
      .eq('id', planId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating plan privacy level:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (error) {
    console.error('Error in PUT plan API:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { plan, userId } = data;
    
    if (!plan || !userId) {
      return NextResponse.json({ error: 'Plan data and user ID are required' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if plan already exists
    if (plan.id && plan.id.startsWith('plan-')) {
      // This is a local plan that hasn't been saved to the database yet
      // Create a new entry
      const { data: savedPlan, error } = await supabase
        .from('training_plans')
        .insert({
          title: plan.name,
          description: plan.name, // Using name as description for now
          sport: plan.sport,
          duration: plan.duration,
          user_id: userId,
          privacy_level: plan.privacy_level || 'private' // Use provided privacy level or default to private
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating plan:', error);
        throw error;
      }
      
      
      // Now save the individual drills as training_plan_items
      if (plan.drills && plan.drills.length > 0) {
        const drillItems = plan.drills.map((drill: PracticeDrill, index: number) => ({
          training_plan_id: savedPlan.id,
          drill_id: drill.drillId, // Assuming drillId refers to an existing drill
          position: index,
          duration: drill.duration || 0
        }));
        
        const { error: itemsError } = await supabase
          .from('training_plan_items')
          .insert(drillItems);
        
        if (itemsError) {
          console.error('Error saving plan items:', itemsError);
          // We'll continue even if there's an error with items
        }
      }
      
      return NextResponse.json({ plan: savedPlan });
    } else {
      // Update existing plan
      const { data: updatedPlan, error } = await supabase
        .from('training_plans')
        .update({
          title: plan.name,
          description: plan.name, // Using name as description for now
          sport: plan.sport,
          duration: plan.duration,
          privacy_level: plan.privacy_level || 'private' // Update privacy level if provided
        })
        .eq('id', plan.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating plan:', error);
        throw error;
      }
      
      // Update plan items - first delete existing items
      const { error: deleteError } = await supabase
        .from('training_plan_items')
        .delete()
        .eq('training_plan_id', plan.id);
      
      if (deleteError) {
        console.error('Error deleting existing plan items:', deleteError);
        // Continue even if there's an error
      }
      
      // Then insert new items
      if (plan.drills && plan.drills.length > 0) {
        const drillItems = plan.drills.map((drill: PracticeDrill, index: number) => ({
          training_plan_id: plan.id,
          drill_id: drill.drillId,
          position: index,
          duration: drill.duration || 0
        }));
        
        const { error: itemsError } = await supabase
          .from('training_plan_items')
          .insert(drillItems);
        
        if (itemsError) {
          console.error('Error saving updated plan items:', itemsError);
          // Continue even if there's an error
        }
      }
      
      return NextResponse.json({ plan: updatedPlan });
    }
  } catch (error) {
    console.error('Error in plans API:', error);
    return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 });
  }
}
