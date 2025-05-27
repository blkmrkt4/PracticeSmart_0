"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Users } from "lucide-react"
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

// Skill level options
const skillLevelOptions = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced"
]

// Tag classification options
const tagClassificationOptions = [
  { value: "sport-specific", label: "Sport-Specific (Red)", description: "Sport-specific activities" },
  { value: "selective-universal", label: "Cross-Sport (Yellow)", description: "Cross-sport with selective applicability" },
  { value: "universal", label: "Universal (Green)", description: "Universal activities for all sports" }
]

export type ActivityFormData = {
  title: string
  sport: string
  activity_tagging: string
  description: string
  video_url: string
  image_url: string
  setup_instructions: string
  coaching_points: string
  duration: number
  equipment: string
  participants: string
  skill_level: string
  tagClassification?: "sport-specific" | "selective-universal" | "universal"
  privacy_level: "private" | "team" | "public"
  team_id?: string | null
}

type ActivityFormProps = {
  initialData?: ActivityFormData
  onSubmit: (data: ActivityFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
  isDialog?: boolean
}

export function ActivityForm({
  initialData = {
    title: "",
    sport: "soccer-football",
    activity_tagging: "",
    description: "",
    video_url: "",
    image_url: "",
    setup_instructions: "",
    coaching_points: "",
    duration: 15,
    equipment: "",
    participants: "",
    skill_level: "All Levels",
    tagClassification: "sport-specific",
    privacy_level: "private",
    team_id: null
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Create Activity/Drill",
  isDialog = false
}: ActivityFormProps) {
  const [activity, setActivity] = useState<ActivityFormData>(initialData)
  const [teams, setTeams] = useState<{id: string, name: string, created_by?: string}[]>([])
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)
  
  // Fetch user's teams when the form loads
  useEffect(() => {
    if (activity.privacy_level === 'team') {
      fetchUserTeams()
    }
  }, [activity.privacy_level])
  
  const fetchUserTeams = async () => {
    setIsLoadingTeams(true)
    try {
      // Using Robin Hutchinson's user ID for testing
      const userId = '597256d8-8bbd-412d-a857-8e6c8b0244d3'
      const response = await fetch(`/api/teams?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch teams')
      }
      
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setIsLoadingTeams(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(activity)
  }

  // Function to check if a field is required and empty
  const isFieldRequired = (fieldName: keyof ActivityFormData) => {
    const requiredFields: (keyof ActivityFormData)[] = ['title', 'sport', 'description', 'duration'];
    // Special check for duration since 0 is falsy but not a valid duration
    if (fieldName === 'duration') {
      return requiredFields.includes(fieldName) && (!activity[fieldName] || activity[fieldName] < 1);
    }
    return requiredFields.includes(fieldName) && !activity[fieldName];
  };
  
  // Function to get placeholder text for required fields
  const getPlaceholder = (fieldName: keyof ActivityFormData, defaultText: string) => {
    return isFieldRequired(fieldName) ? 'Required' : defaultText;
  };

  return (
    <form onSubmit={handleSubmit} className={isDialog ? "" : "max-w-4xl mx-auto py-8"}>
      <div className="space-y-8">
        {/* Basic Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="activity-name" className="text-white">
                Activity Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="activity-name"
                value={activity.title}
                onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder={getPlaceholder('title', 'e.g., Advanced Passing Drill')}
                required
              />
              {isFieldRequired('title') && (
                <p className="text-xs text-red-400 mt-1">This field is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-duration" className="text-white">
                Duration (minutes) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="activity-duration"
                type="number"
                min={1}
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: parseInt(e.target.value) || 15 })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder={getPlaceholder('duration', 'e.g., 30')}
                required
              />
              {isFieldRequired('duration') && (
                <p className="text-xs text-red-400 mt-1">This field is required</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="activity-sport" className="text-white">
                Sport or Activity <span className="text-red-500">*</span>
              </Label>
              <div className="rounded-md border border-white/20 overflow-hidden">
                <SportsActivitiesSelect
                  value={activity.sport}
                  onValueChange={(value) => setActivity({ ...activity, sport: value })}
                />
              </div>
              {isFieldRequired('sport') && (
                <p className="text-xs text-red-400 mt-1">Please select a sport</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-tagging" className="text-white">Activity Tagging</Label>
              <Select
                value={activity.activity_tagging}
                onValueChange={(value) => setActivity({ ...activity, activity_tagging: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20 text-white">
                  {activityTaggingOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="skill-level" className="text-white">Skill Level</Label>
              <Select
                value={activity.skill_level}
                onValueChange={(value) => setActivity({ ...activity, skill_level: value })}
              >
                <SelectTrigger id="skill-level" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20 text-white">
                  {skillLevelOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            

          </div>
          

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tag-classification" className="text-white">Tag Classification</Label>
              <Select
                value={activity.tagClassification}
                onValueChange={(value) => 
                  setActivity({ 
                    ...activity, 
                    tagClassification: value as "sport-specific" | "selective-universal" | "universal" 
                  })
                }
              >
                <SelectTrigger id="tag-classification" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20 text-white">
                  {tagClassificationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="privacy-level" className="text-white">Privacy Level</Label>
              <Select
                value={activity.privacy_level}
                onValueChange={(value: "private" | "team" | "public") => 
                  setActivity({ ...activity, privacy_level: value })
                }
              >
                <SelectTrigger id="privacy-level" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select privacy level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20 text-white">
                  <SelectItem value="private">Private (Only you)</SelectItem>
                  <SelectItem value="team">Team (You and your team members)</SelectItem>
                  <SelectItem value="public">Public (Everyone)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {activity.privacy_level === 'team' && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="team-select" className="text-white">Select Team</Label>
              {isLoadingTeams ? (
                <div className="flex items-center space-x-2 text-white/70 text-sm">
                  <div className="animate-spin h-4 w-4 border-2 border-white/50 rounded-full border-t-transparent"></div>
                  <span>Loading teams...</span>
                </div>
              ) : teams.length === 0 ? (
                <div className="p-3 bg-white/5 rounded-md border border-white/10 text-white/70 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>You don't have any teams yet.</span>
                  </div>
                  <a href="/teams" className="text-blue-400 hover:underline block mt-1">Create a team</a>
                </div>
              ) : (
                <Select
                  value={activity.team_id || ''}
                  onValueChange={(value) => {
                    if (value === 'create-new') {
                      // Redirect to teams page to create a new team
                      window.location.href = '/teams';
                    } else {
                      setActivity({ ...activity, team_id: value || null });
                    }
                  }}
                >
                  <SelectTrigger id="team-select" className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20 text-white">
                    <SelectItem value="create-new" className="text-blue-400 font-medium">+ Create New Team</SelectItem>
                    {teams.map((team: any) => {
                      // Using Robin Hutchinson's user ID for testing
                      const userId = '597256d8-8bbd-412d-a857-8e6c8b0244d3';
                      const isOwner = team.created_by === userId;
                      return (
                        <SelectItem 
                          key={team.id} 
                          value={team.id}
                          className={isOwner ? 'text-green-400' : 'text-yellow-400'}
                        >
                          {team.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-description" className="text-white">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="activity-description"
              value={activity.description}
              onChange={(e) => setActivity({ ...activity, description: e.target.value })}
              className="bg-white/10 border-white/20 text-white min-h-[120px]"
              placeholder={getPlaceholder('description', 'Describe the activity and its objectives...')}
              required
            />
            {isFieldRequired('description') && (
              <p className="text-xs text-red-400 mt-1">This field is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-video" className="text-white">Video URL</Label>
            <Input
              id="activity-video"
              value={activity.video_url}
              onChange={(e) => setActivity({ ...activity, video_url: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="e.g., YouTube or Vimeo URL"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Illustration or Court Diagram</Label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="bg-white/10 rounded-full p-2">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm text-white">Drag and drop an image, or click to select</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    // Image upload functionality would go here
                    // For now, we'll just set a placeholder URL
                    setActivity({ ...activity, image_url: "/placeholder.svg" })
                  }}
                >
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
      </div>

      <div className={`flex justify-end space-x-4 ${isDialog ? 'mt-6' : 'mt-8'}`}>
        <Button
          type="button"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/20 hover:text-white"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
