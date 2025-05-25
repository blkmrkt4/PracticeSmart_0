"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"
import { SportsActivitiesSelect } from "@/components/sports-activities-select"

// Define available activity tagging options

const activityTaggingOptions = [
  "Technique",
  "Tactics",
  "Physical Conditioning",
  "Team Building",
  "Game Situations",
  "Individual Skills",
  "Group Skills",
  "Strategy",
  "Mental Preparation",
  "Recovery",
  "Strength",
  "Power",
  "Endurance",
  "Zone 2",
  "Agility",
  "Core Stability",
  "Injury Prevention",
  // Added from Category values
  "Training",
  "Tactical",
  "Drill",
  // Added from export page categories
  "Passing",
  "Shooting",
  "Defending",
  "Game Play",
  "Dribbling",
  "Warm-up",
  "Cool Down"
]

export default function NewActivityPage() {
  const [activity, setActivity] = useState({
    title: "",
    sport: "soccer", // Default sport
    activity_tagging: "",
    description: "",
    video_url: "",
    image_url: "",
    setup_instructions: "",
    coaching_points: "",
    duration: 15, // Default duration in minutes
    equipment: "",
    participants: "",
    user_id: "", // Will be set from session
    skill_level: "All Levels"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    // Basic validation
    if (!activity.title.trim()) {
      setError('Please provide a title for the activity/drill')
      setIsSubmitting(false)
      return
    }
    
    if (!activity.sport) {
      setError('Please select a sport')
      setIsSubmitting(false)
      return
    }
    
    if (!activity.description.trim()) {
      setError('Please provide a description')
      setIsSubmitting(false)
      return
    }
    
    try {
      // Prepare data for submission
      const submissionData = {
        ...activity,
        // Convert equipment to array if it's a string
        equipment: activity.equipment.includes(',') ? 
          activity.equipment.split(',').map(item => item.trim()).filter(Boolean) : 
          activity.equipment.trim() ? [activity.equipment.trim()] : [],
        // Ensure duration is a number
        duration: Number(activity.duration),
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
      // Reset form
      setActivity({
        title: "",
        sport: activity.sport, // Keep the same sport
        activity_tagging: "",
        description: "",
        video_url: "",
        image_url: "",
        setup_instructions: "",
        coaching_points: "",
        duration: 15,
        equipment: "",
        participants: "",
        user_id: "",
        skill_level: "All Levels"
      })
      
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
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <img src="/coaching-beast-icon.svg" alt="Coaching Beast Icon" className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold text-white">Coaching Beast</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <ArrowLeft className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/70">Back to Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Activity/Drill</h1>

          <form onSubmit={handleSubmit}>
            <Card className="bg-gray-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Activity Details</CardTitle>
                <CardDescription className="text-gray-300">
                  Fill in the details for your new training activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Activity Name</Label>
                    <Input
                      id="title"
                      value={activity.title}
                      onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., Advanced Passing Drill"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={activity.duration || ''}
                      onChange={(e) => setActivity({ ...activity, duration: parseInt(e.target.value) || 0 })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="15"
                    />
                  </div>
                </div>

                {/* Sport and Activity Tagging */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sport" className="text-white">Sport or Activity</Label>
                    <SportsActivitiesSelect
                      value={activity.sport}
                      onValueChange={(value) => setActivity({ ...activity, sport: value })}
                      placeholder="Select a sport or activity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activityTagging" className="text-white">Activity Tagging</Label>
                    <Select
                      value={activity.activity_tagging}
                      onValueChange={(value) => setActivity({ ...activity, activity_tagging: value })}
                      required
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select activity tagging" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTaggingOptions.map((area: string) => (
                          <SelectItem key={area} value={area.toLowerCase()}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Skill Level */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel" className="text-white">Skill Level</Label>
                    <Select
                      value={activity.skill_level}
                      onValueChange={(value) => setActivity({ ...activity, skill_level: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="All Levels">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={activity.description}
                    onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white min-h-[100px]"
                    placeholder="Describe the activity and its objectives..."
                  />
                </div>

                {/* Media Section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl" className="text-white">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={activity.video_url}
                      onChange={(e) => setActivity({ ...activity, video_url: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., YouTube or Vimeo URL"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-white">Illustration or Court Diagram</Label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-white/50 mb-2" />
                        <p className="text-sm text-gray-300 mb-2">
                          Drag and drop an image, or click to select
                        </p>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/20">
                          Upload Image
                        </Button>
                        <p className="text-xs text-gray-400 mt-2">
                          Supports PNG, JPG or GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="setup" className="text-white">Setup Instructions</Label>
                    <Textarea
                      id="setup"
                      value={activity.setup_instructions}
                      onChange={(e) => setActivity({ ...activity, setup_instructions: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Describe how to set up the activity..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coachingPoints" className="text-white">Coaching Points</Label>
                    <Textarea
                      id="coachingPoints"
                      value={activity.coaching_points}
                      onChange={(e) => setActivity({ ...activity, coaching_points: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Key points for coaches to focus on..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="equipment" className="text-white">Required Equipment</Label>
                      <Input
                        id="equipment"
                        value={activity.equipment}
                        onChange={(e) => setActivity({ ...activity, equipment: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="e.g., Balls, Cones, Goals"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participants" className="text-white">Number of Participants</Label>
                      <Input
                        id="participants"
                        value={activity.participants}
                        onChange={(e) => setActivity({ ...activity, participants: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="e.g., 8-12 players"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/20 hover:text-white"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                  {isSubmitting ? 'Creating...' : 'Create Activity/Drill'}
                </Button>
              </CardFooter>
            </Card>
          </form>
            
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
        </div>
      </main>
    </div>
  )
}
