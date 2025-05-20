import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const activityData = await request.json();
    
    // Here you would typically save to a database
    // For now, we'll just log and return the data
    console.log('Creating new activity:', activityData);
    
    // Simulate database save with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(
      { 
        success: true, 
        data: { 
          ...activityData,
          id: Date.now(), // Simulate generated ID
          createdAt: new Date().toISOString()
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}
