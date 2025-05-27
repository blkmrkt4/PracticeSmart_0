"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ActivityForm, ActivityFormData } from "@/components/activity-form"

export default function NewActivityPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (formData: ActivityFormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Prepare data for submission
      const submissionData = {
        title: formData.title,
        sport: formData.sport,
        activity_tagging: formData.activity_tagging,
        description: formData.description,
        video_url: formData.video_url,
        image_url: formData.image_url,
        setup_instructions: formData.setup_instructions,
        coaching_points: formData.coaching_points,
        duration: Number(formData.duration),
        // Convert equipment to array if it's a string
        equipment: formData.equipment.includes(',') ? 
          formData.equipment.split(',').map(item => item.trim()).filter(Boolean) : 
          formData.equipment.trim() ? [formData.equipment.trim()] : [],
        participants: formData.participants,
        skill_level: formData.skill_level,
        // Add timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Log the exact data being sent to the API
      console.log('Submitting activity data:', JSON.stringify(submissionData, null, 2));
      
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create activity/drill')
      }
      
      setSuccess(true)
      
      // Reset success message after 3 seconds and redirect to homepage
      setTimeout(() => {
        setSuccess(false)
        window.location.href = '/'
      }, 3000)
    } catch (err) {
      console.error('Error creating activity:', err)
      // More detailed error logging
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
      }
      // Try to extract more information from the response if available
      if (err instanceof Error && err.message.includes('Failed to create activity')) {
        setError('Server error: ' + err.message)
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/20 bg-black/90 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <img src="/coaching-beast-icon.svg" alt="Coaching Beast Icon" className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold text-white">Coaching Beast</span>
          </Link>
          <div className="ml-4 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4 text-white/70" />
            <Link href="/" className="text-sm text-white/70 hover:text-white">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6">
        <div className="py-6">
          <Card className="bg-black/50 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create New Activity/Drill</CardTitle>
              <CardDescription className="text-white/70">
                Fill in the details for your new training activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityForm
                onSubmit={handleSubmit}
                onCancel={() => window.history.back()}
                isSubmitting={isSubmitting}
                submitLabel="Create Activity/Drill"
              />
              
              {error && (
                <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-red-100 rounded-lg">
                  Error: {error}
                </div>
              )}
              
              {success && (
                <div className="mt-6 p-4 bg-green-900/50 border border-green-500 text-green-100 rounded-lg">
                  Activity created successfully! Redirecting...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
