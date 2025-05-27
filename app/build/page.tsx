"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { SportsActivitiesSelect } from "@/components/sports-activities-select"
import { PlanAccessControls } from "@/components/plan-access-controls"
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  Download,
  Dumbbell, 
  Edit,
  ExternalLink,
  FileText,
  Filter,
  FolderOpen,
  Info,
  Loader,
  Loader2,
  Pencil,
  Plus,
  Save, 
  Search,
  Share,
  Target,
  Timer,
  Trash,
  Trash2, 
  Upload, 
  Users, 
  Video,
  X
} from "lucide-react"

// Types
type Drill = {
  id: string
  name: string
  description: string
  duration: number
  activity_tagging: string
  skillLevel: string
  players: string
  equipment: string[]
  sport: string
  objectives: string[]
  category: string
  type: string
  isCustom?: boolean
  setup?: string
  instructions?: string
  variations?: string
  tips?: string
  imageUrl?: string
  videoUrl?: string
  tagClassification?: "sport-specific" | "selective-universal" | "universal"
}

type PracticeDrill = {
  id: string
  drillId: string
  name: string
  duration: number
  description: string
  notes?: string
}

type PracticePlan = {
  id: string
  name: string
  sport: string
  duration: number
  drills: PracticeDrill[]
  createdAt: string
  lastModified: string
  privacy?: 'private' | 'team' | 'public'
  privacy_level?: string // For API compatibility
  shared?: boolean // Flag for plans shared with the user
  team_access?: any[] // Team access information
}

// Drill types for quick filtering
const drillTypes = [
  "All Types",
  "Drills",
  "Scrimmage",
  "Conditioning",
  "Stretching",
  "Instructions",
  "Weights",
  "Plyometrics",
  "Hand-Eye",
  "Footwork",
  "Cooldown",
  "Meditation",
]

// Sample data
const sampleDrills: Drill[] = [
  {
    id: "drill-1",
    name: "Passing Triangle",
    description: "Players form triangles and practice passing and movement",
    duration: 15,
    category: "Passing",
    activity_tagging: "passing",
    skillLevel: "Intermediate",
    players: "9+",
    equipment: ["Balls", "Cones"],
    sport: "soccer-football",
    objectives: ["Improve passing accuracy", "Develop movement off the ball"],
    type: "Drills",
    setup:
      "Set up three cones in a triangle formation, approximately 10 yards apart. Place three players at each cone.",
    instructions:
      "1. Player A passes to Player B and then runs to take B's position\n2. Player B receives the ball, passes to Player C, and runs to take C's position\n3. Player C receives the ball, passes to Player A's replacement, and runs to take the new position\n4. Continue this pattern, focusing on accurate passes and proper receiving technique",
    variations:
      "- Limit touches to one or two\n- Add defensive pressure\n- Change the size of the triangle based on skill level\n- Add a fourth cone to create a diamond pattern",
    tips: "- Emphasize communication between players\n- Focus on proper weight of passes\n- Encourage players to check to the ball when receiving",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "drill-2",
    name: "Shooting Practice",
    description: "Players take turns shooting at goal from various positions",
    duration: 20,
    category: "Shooting",
    activity_tagging: "shooting",
    skillLevel: "All Levels",
    players: "6+",
    equipment: ["Balls", "Goals"],
    sport: "soccer-football",
    objectives: ["Improve shooting accuracy", "Practice different shooting techniques"],
    type: "Drills",
    setup:
      "Set up a goal with a goalkeeper. Place cones at various distances and angles from the goal to mark shooting positions.",
    instructions:
      "1. Players form a line at each shooting position\n2. First player in each line takes a shot\n3. After shooting, player retrieves their ball and joins the back of the line\n4. Rotate positions after everyone has taken 3-5 shots",
    variations:
      "- Add a defender to create pressure\n- Incorporate a pass before shooting\n- Practice volleys and half-volleys\n- Set up shooting after dribbling through cones",
    tips: "- Focus on proper technique: plant foot, body position, follow-through\n- Aim for the corners of the goal\n- Vary the power and placement of shots",
    imageUrl: "/placeholder.svg?height=300&width=400",
    videoUrl: "https://www.youtube.com/watch?v=example",
  },
  {
    id: "drill-3",
    name: "1v1 Defending",
    description: "Players practice 1v1 defending techniques in a confined space",
    duration: 15,
    category: "Defending",
    activity_tagging: "defending",
    skillLevel: "Intermediate",
    players: "8+",
    equipment: ["Balls", "Cones"],
    sport: "soccer-football",
    objectives: ["Improve defensive positioning", "Practice tackling technique"],
    type: "Drills",
  },
  {
    id: "drill-4",
    name: "Small-Sided Game",
    description: "4v4 small-sided game with focus on quick transitions",
    duration: 25,
    category: "Game Simulation",
    activity_tagging: "game-simulation",
    skillLevel: "All Levels",
    players: "8+",
    equipment: ["Balls", "Cones", "Pinnies"],
    sport: "soccer-football",
    objectives: ["Apply skills in game-like situations", "Improve decision making"],
    type: "Scrimmage",
  },
  {
    id: "drill-5",
    name: "Dribbling Relay",
    description: "Teams compete in a dribbling relay race through cones",
    duration: 10,
    category: "Dribbling",
    activity_tagging: "dribbling",
    skillLevel: "Beginner",
    players: "6+",
    equipment: ["Balls", "Cones"],
    sport: "soccer-football",
    objectives: ["Improve dribbling control", "Add competitive element"],
    type: "Drills",
  },
  {
    id: "drill-6",
    name: "Possession Circle",
    description: "Players maintain possession against defenders in a circle",
    duration: 15,
    category: "Possession",
    activity_tagging: "possession",
    skillLevel: "Advanced",
    players: "10+",
    equipment: ["Balls", "Pinnies"],
    sport: "soccer-football",
    objectives: ["Improve possession under pressure", "Quick decision making"],
    type: "Drills",
  },
  {
    id: "drill-7",
    name: "Warm-up Jog & Stretch",
    description: "Light jogging followed by dynamic stretching routine",
    duration: 10,
    category: "Warm-up",
    activity_tagging: "warm-up",
    skillLevel: "All Levels",
    players: "Any",
    equipment: [],
    sport: "soccer-football",
    objectives: ["Prepare body for activity", "Prevent injuries"],
    type: "Stretching",
  },
  {
    id: "drill-8",
    name: "Cool Down & Stretch",
    description: "Light activity followed by static stretching",
    duration: 10,
    category: "Cool Down",
    activity_tagging: "cool-down",
    skillLevel: "All Levels",
    players: "Any",
    equipment: [],
    sport: "soccer-football",
    objectives: ["Gradually reduce heart rate", "Improve flexibility"],
    type: "Cooldown",
  },
  {
    id: "drill-9",
    name: "Passing Pattern",
    description: "Players execute a specific passing pattern across the field",
    duration: 15,
    category: "Passing",
    activity_tagging: "passing",
    skillLevel: "Intermediate",
    players: "8+",
    equipment: ["Balls", "Cones"],
    sport: "soccer-football",
    objectives: ["Improve passing accuracy", "Practice movement patterns"],
    type: "Drills",
  },
  {
    id: "drill-10",
    name: "Crossing & Finishing",
    description: "Players practice crossing from wide areas and finishing",
    duration: 20,
    category: "Attacking",
    activity_tagging: "attacking",
    skillLevel: "Intermediate",
    players: "8+",
    equipment: ["Balls", "Goals", "Cones"],
    sport: "soccer-football",
    objectives: ["Improve crossing accuracy", "Practice finishing from crosses"],
    type: "Drills",
  },
  {
    id: "drill-11",
    name: "Defensive Shape",
    description: "Team works on maintaining defensive shape against attackers",
    duration: 20,
    category: "Defending",
    activity_tagging: "defending",
    skillLevel: "Intermediate",
    players: "10+",
    equipment: ["Balls", "Cones", "Pinnies"],
    sport: "soccer-football",
    objectives: ["Improve team defensive organization", "Practice shifting and covering"],
    type: "Drills",
  },
  {
    id: "drill-12",
    name: "Goalkeeper Distribution",
    description: "Goalkeepers practice various distribution techniques",
    duration: 15,
    category: "Goalkeeping",
    activity_tagging: "goalkeeping",
    skillLevel: "All Levels",
    players: "2+",
    equipment: ["Balls", "Goals"],
    sport: "soccer-football",
    objectives: ["Improve distribution accuracy", "Practice decision making"],
    type: "Drills",
  },
  {
    id: "drill-13",
    name: "High-Intensity Interval Training",
    description: "Alternating between high-intensity and recovery periods",
    duration: 20,
    category: "Fitness",
    activity_tagging: "fitness",
    skillLevel: "All Levels",
    players: "Any",
    equipment: ["Cones", "Timer"],
    sport: "soccer-football",
    objectives: ["Improve cardiovascular fitness", "Enhance endurance"],
    type: "Conditioning",
  },
  {
    id: "drill-14",
    name: "Team Strategy Session",
    description: "Coach explains team tactics and positioning using whiteboard",
    duration: 15,
    category: "Tactical",
    activity_tagging: "tactical",
    skillLevel: "All Levels",
    players: "All",
    equipment: ["Whiteboard", "Markers"],
    sport: "soccer-football",
    objectives: ["Improve tactical understanding", "Clarify player roles"],
    type: "Instructions",
  },
  {
    id: "drill-15",
    name: "Lower Body Strength Circuit",
    description: "Circuit training focusing on leg strength and stability",
    duration: 20,
    category: "Strength",
    activity_tagging: "strength",
    skillLevel: "Intermediate",
    players: "Any",
    equipment: ["Weights", "Resistance Bands"],
    sport: "soccer-football",
    objectives: ["Build leg strength", "Improve stability"],
    type: "Weights",
  },
  {
    id: "drill-16",
    name: "Box Jumps and Ladder Drills",
    description: "Explosive jumping exercises combined with agility ladder work",
    duration: 15,
    category: "Agility",
    activity_tagging: "agility",
    skillLevel: "Intermediate",
    players: "Any",
    equipment: ["Plyo Boxes", "Agility Ladder"],
    sport: "soccer-football",
    objectives: ["Improve explosive power", "Enhance footwork"],
    type: "Plyometrics",
  },
  {
    id: "drill-17",
    name: "Ball Control Challenges",
    description: "Series of ball control exercises requiring hand-eye coordination",
    duration: 15,
    category: "Ball Control",
    activity_tagging: "ball-control",
    skillLevel: "All Levels",
    players: "Any",
    equipment: ["Balls", "Cones"],
    sport: "soccer-football",
    objectives: ["Improve ball control", "Enhance coordination"],
    type: "Hand-Eye",
  },
  {
    id: "drill-18",
    name: "Footwork Speed Ladder",
    description: "Various footwork patterns through speed ladder",
    duration: 15,
    category: "Agility",
    activity_tagging: "agility",
    skillLevel: "All Levels",
    players: "Any",
    equipment: ["Speed Ladder"],
    sport: "soccer-football",
    objectives: ["Improve footwork speed", "Enhance agility"],
    type: "Footwork",
  },
]

// State variables for the build page
export default function BuildPage() {
  // State
  const [selectedSport, setSelectedSport] = useState("soccer-football")
  const [practiceDuration, setPracticeDuration] = useState(90)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSportSpecificOnly, setShowSportSpecificOnly] = useState(false)
  const [expandedDrills, setExpandedDrills] = useState<Record<string, boolean>>({})
  const [allExpanded, setAllExpanded] = useState(false)
  const [isClient, setIsClient] = useState(false) // For client-side rendering
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  // Using Robin Hutchinson's user ID for testing
  const userId = '597256d8-8bbd-412d-a857-8e6c8b0244d3'
  const [currentPlan, setCurrentPlan] = useState<PracticePlan>({
    id: `plan-${Math.random().toString(36).substring(2, 11)}`,
    name: "New Training Plan",
    sport: "soccer-football",
    duration: 90,
    drills: [],
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    privacy: 'private'
  })

  const [savedPlans, setSavedPlans] = useState<PracticePlan[]>([])
  const [isEditingName, setIsEditingName] = useState(false)
  const [showSavedPlans, setShowSavedPlans] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showDurationDialog, setShowDurationDialog] = useState(false)
  const [customDuration, setCustomDuration] = useState(practiceDuration)
  const [showDrillDetailDialog, setShowDrillDetailDialog] = useState(false)
  const [showEditAccessDialog, setShowEditAccessDialog] = useState(false)
  const [planToEditAccess, setPlanToEditAccess] = useState<PracticePlan | null>(null)
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null)
  const [customDrills, setCustomDrills] = useState<Drill[]>([])
  const router = useRouter()

  // Handle client-side rendering and load saved plans from localStorage and Supabase
  useEffect(() => {
    setIsClient(true)
    
    // Load saved plans from localStorage
    try {
      const savedPlansData = localStorage.getItem('savedPlans')
      if (savedPlansData) {
        const parsedPlans = JSON.parse(savedPlansData) as PracticePlan[]
        setSavedPlans(parsedPlans)
      }
    } catch (error) {
      console.error('Error loading saved plans from localStorage:', error)
    }

    // Load saved plans from Supabase
    const fetchPlansFromSupabase = async () => {
      try {
        console.log('Fetching plans for user ID:', userId)
        
        const response = await fetch(`/api/plans?userId=${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans from database')
        }
        
        const data = await response.json()
        console.log('Plans fetched from database:', data)
        
        if (data.plans && data.plans.length > 0) {
          // Define the database plan type
          interface DbTrainingPlan {
            id: string;
            title: string;
            description: string;
            sport: string;
            duration: number;
            user_id: string;
            created_at: string;
            privacy_level: string;
            team_access?: any[];
            items?: any[];
            shared?: boolean;
          }
          
          // Convert database format to app format
          const dbPlans = data.plans.map((dbPlan: DbTrainingPlan) => {
            // Extract drills from items if available
            const drills = (dbPlan.items || []).map(item => ({
              id: `pd-${item.id}`,
              drillId: item.drill_id || (item.drills ? item.drills.id : ''),
              name: item.drills ? item.drills.name : 'Unknown Drill',
              duration: item.duration || 0,
              description: item.drills ? item.drills.description : '',
            }));
            
            return {
              id: dbPlan.id,
              name: dbPlan.title,
              sport: dbPlan.sport,
              duration: dbPlan.duration,
              drills: drills,
              createdAt: dbPlan.created_at,
              lastModified: dbPlan.created_at, // Using created_at as there's no last_modified in training_plans
              privacy: dbPlan.privacy_level,
              privacy_level: dbPlan.privacy_level,
              team_access: dbPlan.team_access || [],
              shared: dbPlan.shared || false
            };
          })
          
          // Merge with local plans, preferring database plans for duplicates
          setSavedPlans(prevPlans => {
            // Filter out local plans that exist in the database (by name)
            const filteredLocalPlans = prevPlans.filter(localPlan => 
              !dbPlans.some((dbPlan: { name: string }) => dbPlan.name === localPlan.name)
            )
            
            return [...filteredLocalPlans, ...dbPlans]
          })
        }
      } catch (error) {
        console.error('Error fetching plans from database:', error)
        toast({
          title: "Could Not Load Remote Plans",
          description: "Your saved plans from the cloud could not be loaded. Local plans are still available.",
          variant: "destructive",
        })
      }
    }
    
    fetchPlansFromSupabase()
  }, [])

  // Combine sample and custom drills
  const allDrills = [...sampleDrills, ...customDrills]
  
  // Filter drills based on search, category, and sport
  const filteredDrills = allDrills.filter((drill) => {
    const matchesSport = selectedSport === "all" || drill.sport === selectedSport
    const matchesCategory = selectedCategory === "All" || drill.activity_tagging === selectedCategory.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      drill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSport && matchesCategory && matchesSearch
  })

  // Function to refresh custom drills from the database
  const refreshCustomDrills = async () => {
    try {
      const response = await fetch('/api/activities?type=custom');
      if (response.ok) {
        const data = await response.json();
        setCustomDrills(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching custom drills:', error);
    }
  };

  // Load custom drills when the component mounts
  useEffect(() => {
    refreshCustomDrills();
  }, []);

  // Calculate total duration of current plan
  const totalDuration = currentPlan.drills.reduce((total, drill) => total + drill.duration, 0)

  // Open drill detail dialog
  const openDrillDetail = (drill: Drill) => {
    setSelectedDrill(drill)
    setShowDrillDetailDialog(true)
  }

  // Find drill by ID
  const findDrillById = (id: string): Drill | undefined => {
    return allDrills.find((drill) => drill.id === id)
  }

  // Add drill to plan
  const addDrillToPlan = (drill: Drill) => {
    const newDrill: PracticeDrill = {
      id: `pd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      drillId: drill.id,
      name: drill.name,
      duration: drill.duration,
      description: drill.description,
    }

    setCurrentPlan({
      ...currentPlan,
      drills: [...currentPlan.drills, newDrill],
      lastModified: new Date().toISOString(),
    })

    toast({
      title: "Drill Added",
      description: `${drill.name} added to practice plan`,
    })
  }

  // Remove drill from plan
  const removeDrillFromPlan = (drillId: string) => {
    setCurrentPlan({
      ...currentPlan,
      drills: currentPlan.drills.filter((d) => d.id !== drillId),
      lastModified: new Date().toISOString(),
    })

    toast({
      title: "Drill Removed",
      description: "Drill removed from practice plan",
    })
  }

  // Handle drag end
  const handleDragEnd = (result: any) => {
    const { source, destination } = result

    // Dropped outside the list or no change
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return
    }

    // Reordering within the timeline
    if (source.droppableId === "drills-timeline" && destination.droppableId === "drills-timeline") {
      const newDrills = Array.from(currentPlan.drills)
      const [removed] = newDrills.splice(source.index, 1)
      newDrills.splice(destination.index, 0, removed)

      setCurrentPlan({
        ...currentPlan,
        drills: newDrills,
        lastModified: new Date().toISOString(),
      })
    }
    // Moving from drill library to timeline
    else if (source.droppableId === "drills-library" && destination.droppableId === "drills-timeline") {
      const drillToAdd = filteredDrills[source.index]

      if (drillToAdd) {
        const newDrill: PracticeDrill = {
          id: `pd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          drillId: drillToAdd.id,
          name: drillToAdd.name,
          duration: drillToAdd.duration,
          description: drillToAdd.description,
        }

        const newDrills = Array.from(currentPlan.drills)
        newDrills.splice(destination.index, 0, newDrill)

        setCurrentPlan({
          ...currentPlan,
          drills: newDrills,
          lastModified: new Date().toISOString(),
        })

        toast({
          title: "Drill Added",
          description: `${drillToAdd.name} added to practice plan`,
        })
      }
    }
  }

  // Save current plan
  const savePlan = async (name: string) => {
    const planToSave: PracticePlan = {
      ...currentPlan,
      name,
      lastModified: new Date().toISOString(),
    }

    // Check if we're updating an existing plan
    const existingPlanIndex = savedPlans.findIndex((p) => p.id === currentPlan.id)

    if (existingPlanIndex >= 0) {
      const updatedPlans = [...savedPlans]
      updatedPlans[existingPlanIndex] = planToSave
      setSavedPlans(updatedPlans)
    } else {
      setSavedPlans([...savedPlans, planToSave])
    }

    setShowSaveDialog(false)

    // Save to localStorage
    try {
      localStorage.setItem("savedPlans", JSON.stringify([...savedPlans, planToSave]))
    } catch (error) {
      console.error("Error saving plans to localStorage:", error)
    }

    // Save to Supabase
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: {
            ...planToSave,
            privacy_level: planToSave.privacy || 'private'
          },
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save plan to database')
      }

      const result = await response.json()
      console.log('Plan saved to database:', result)
      
      // If the plan is set to team access, save team associations
      if (planToSave.privacy === 'team' && selectedTeams.length > 0) {
        // Save team access settings
        const planId = result.plan.id || planToSave.id
        
        // For each selected team, create an entry in team_training_plan_access
        for (const teamId of selectedTeams) {
          const teamAccessResponse = await fetch('/api/plans/team-access', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              training_plan_id: planId,
              team_id: teamId
            }),
          })
          
          if (!teamAccessResponse.ok) {
            console.error('Error saving team access for team:', teamId)
          }
        }
      }

      toast({
        title: "Plan Saved",
        description: `${name} has been saved successfully`,
      })
    } catch (error) {
      console.error('Error saving plan to database:', error)
      
      toast({
        title: "Plan Saved Locally",
        description: `${name} has been saved to your browser, but could not be saved to the database.`,
        variant: "destructive",
      })
    }
  }

  // Open the edit access dialog for a plan
  const openEditAccessDialog = (plan: PracticePlan) => {
    setPlanToEditAccess(plan)
    
    // Set the selected teams based on the plan's team access
    const teamIds: string[] = []
    if (plan.team_access && Array.isArray(plan.team_access)) {
      plan.team_access.forEach(access => {
        if (access.team_id) {
          teamIds.push(access.team_id)
        } else if (access.teams && access.teams.id) {
          teamIds.push(access.teams.id)
        }
      })
    }
    setSelectedTeams(teamIds)
    
    setShowEditAccessDialog(true)
  }

  // Load a saved plan
  const loadPlan = (plan: PracticePlan) => {
    setCurrentPlan(plan)
    setSelectedSport(plan.sport)
    setPracticeDuration(plan.duration)
    
    // Extract team IDs from team_access if available
    const teamIds: string[] = []
    if (plan.team_access && Array.isArray(plan.team_access)) {
      plan.team_access.forEach(access => {
        if (access.team_id) {
          teamIds.push(access.team_id)
        } else if (access.teams && access.teams.id) {
          teamIds.push(access.teams.id)
        }
      })
    }
    setSelectedTeams(teamIds)
    
    setShowSavedPlans(false)

    toast({
      title: "Plan Loaded",
      description: `${plan.name} has been loaded successfully`,
    })
  }

  // Create a new plan
  const createNewPlan = () => {
    setCurrentPlan({
      id: `plan-${Date.now()}`,
      name: "New Training Plan",
      sport: selectedSport,
      duration: practiceDuration,
      drills: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      privacy: 'private'
    })
    setSelectedTeams([])
    setShowSavedPlans(false)

    toast({
      title: "New Plan Created",
      description: "Start building your new training plan",
    })
  }
  
  // Rest of the component code...

  // Rest of the component code...
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/20 bg-black/90 backdrop-blur-md">
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

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {isEditingName ? (
                <Input
                  value={currentPlan.name}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                  className="h-8 w-48 bg-white/10 border-white/20 text-white"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">{currentPlan.name}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push('/activities/new?returnTo=/build')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Activity/Drill
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-gray-200 hover:bg-gray-300 text-black"
                onClick={() => setShowSavedPlans(true)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                My Plans
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-gray-200 hover:bg-gray-300 text-black"
                onClick={() => setShowSaveDialog(true)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:px-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Settings and Drill Library */}
            <div className="lg:w-1/3 space-y-6">
              {/* Sport and Duration Settings */}
              <Card className="bg-gray-900/80 border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Training Plan Settings</CardTitle>
                  <CardDescription className="text-white/80">Configure your activity session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sport" className="text-white">
                      Sport or Activity
                    </Label>
                    <SportsActivitiesSelect
                      value={selectedSport}
                      onValueChange={setSelectedSport}
                      placeholder="Select a sport or activity"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="duration" className="text-white">
                        Activity Duration
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">{practiceDuration} minutes</span>
                      </div>
                    </div>
                    <Slider
                      id="duration"
                      min={0}
                      max={90}
                      step={5}
                      value={[Math.min(practiceDuration, 90)]}
                      onValueChange={(value) => setPracticeDuration(value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-white/70">
                      <span>0 min</span>
                      <span>90+ min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Drill Library */}
              <Card className="bg-gray-900/80 border-white/20 text-white">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Activity Library</CardTitle>
                      <CardDescription className="text-white/70">Drag activities to your training plan</CardDescription>
                    </div>
                    <Button
                      onClick={() => router.push('/activities/new?returnTo=/build')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Activity/Drill
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                      <Input
                        type="search"
                        placeholder="Search Activities or Drills"
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[130px] bg-white/10 border-white/20 text-white">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/10 text-white">
                        {["All", ...new Set(allDrills.map(drill => drill.activity_tagging))].map((tag: string) => (
                          <SelectItem key={tag} value={tag}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Drill List */}
                  <Droppable droppableId="drills-library" isDropDisabled={true}>
                    {(provided, snapshot) => (
                      <ScrollArea className="h-[calc(100vh-380px)] pr-4">
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                          {filteredDrills.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-white/70 border border-dashed border-white/30 rounded-lg">
                              <p className="text-center mb-1 text-white">No drills found</p>
                              <p className="text-center text-sm text-white/80">Try adjusting your filters</p>
                            </div>
                          ) : (
                            filteredDrills.map((drill, index) => (
                              <Draggable key={drill.id} draggableId={drill.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`rounded-lg border ${
                                      drill.isCustom
                                        ? "border-blue-500/50 bg-blue-950/20"
                                        : "border-white/20 bg-white/5"
                                    } p-3 hover:bg-white/10 transition-colors ${
                                      snapshot.isDragging ? "opacity-70" : ""
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center">
                                        <h3 className="font-medium">{drill.name}</h3>
                                        {drill.isCustom && (
                                          <Badge className="ml-2 bg-blue-600 text-white text-xs">Custom</Badge>
                                        )}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="bg-gray-200 text-black text-xs border-transparent"
                                      >
                                        {drill.duration} min
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-white/70 mb-2">{drill.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      <Badge className="bg-blue-600/30 text-blue-100 hover:bg-blue-600/40 text-xs">
                                        {drill.category}
                                      </Badge>
                                      <Badge className="bg-purple-600/30 text-purple-100 hover:bg-purple-600/40 text-xs">
                                        {drill.skillLevel}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center text-xs text-white/50">
                                        <Users className="h-3 w-3 mr-1" />
                                        <span>{drill.players}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 px-2 hover:bg-white/20 text-white"
                                          onClick={() => addDrillToPlan(drill)}
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          <span className="text-xs">Add</span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      </ScrollArea>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Practice Plan Timeline */}
            <div className="lg:w-2/3 space-y-6">
              <Card className="bg-gray-900/80 border-white/20 text-white">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Training Plan Timeline</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-white/80">
                        Total: <span className="font-medium text-white">{totalDuration} min</span>
                      </div>
                      <Separator orientation="vertical" className="h-4 bg-white/30" />
                      <div className="text-sm text-white/80">
                        Target: <span className="font-medium text-white">{practiceDuration} min</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-white/80">
                    Drag and drop to reorder drills in your plan
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Droppable droppableId="drills-timeline">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-3 min-h-[calc(100vh-250px)] ${
                          snapshot.isDraggingOver ? "bg-white/5 rounded-lg p-2" : ""
                        }`}
                      >
                        {currentPlan.drills.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-white/70 border border-dashed border-white/30 rounded-lg">
                            <p className="text-center mb-2 text-white">Your training plan is empty</p>
                            <p className="text-center text-sm text-white/80">
                              Drag drills from the library or click "Add" to build your plan
                            </p>
                          </div>
                        ) : (
                          currentPlan.drills.map((drill, index) => (
                            <Draggable key={drill.id} draggableId={drill.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`rounded-lg border border-white/20 bg-white/5 p-3 hover:bg-white/10 transition-colors ${
                                    snapshot.isDragging ? "opacity-70" : ""
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center">
                                        <h3 className="font-medium">{drill.name}</h3>
                                        <Badge className="ml-2 bg-gray-200 text-black text-xs">{index + 1}</Badge>
                                      </div>
                                      <p className="text-sm text-white/70 mt-1">{drill.description}</p>
                                    </div>
                                    <div className="flex items-start gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-white/70 hover:text-white hover:bg-red-600/20"
                                        onClick={() => removeDrillFromPlan(drill.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          </div>
        </DragDropContext>
      </main>

      {/* Save Plan Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Save Training Plan</DialogTitle>
            <DialogDescription className="text-white/80">
              Give your training plan a name to save it for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                value={currentPlan.name}
                onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <PlanAccessControls
              privacyLevel={currentPlan.privacy || 'private'}
              onPrivacyChange={(value) => setCurrentPlan({ ...currentPlan, privacy: value as 'private' | 'team' | 'public' })}
              selectedTeams={selectedTeams}
              onTeamsChange={setSelectedTeams}
              userId={userId}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="border-white/20 text-white hover:bg-white/20">
              Cancel
            </Button>
            <Button onClick={() => savePlan(currentPlan.name)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Access Dialog */}
      <Dialog open={showEditAccessDialog} onOpenChange={setShowEditAccessDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Edit Access Settings</DialogTitle>
            <DialogDescription className="text-white/80">
              {planToEditAccess && `Manage who can access ${planToEditAccess.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {planToEditAccess && (
              <PlanAccessControls
                privacyLevel={planToEditAccess.privacy || planToEditAccess.privacy_level || 'private'}
                onPrivacyChange={(value) => setPlanToEditAccess({
                  ...planToEditAccess,
                  privacy: value as 'private' | 'team' | 'public',
                  privacy_level: value
                })}
                selectedTeams={selectedTeams}
                onTeamsChange={setSelectedTeams}
                userId={userId}
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditAccessDialog(false)}
              className="border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!planToEditAccess) return;
                
                try {
                  // Update the plan's privacy level
                  const response = await fetch('/api/plans', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      planId: planToEditAccess.id,
                      privacy_level: planToEditAccess.privacy || 'private',
                      userId,
                    }),
                  });
                  
                  if (!response.ok) {
                    throw new Error('Failed to update plan privacy level');
                  }
                  
                  // If team access, update team associations
                  if (planToEditAccess.privacy === 'team') {
                    // First, delete all existing team access for this plan
                    const deleteResponse = await fetch(`/api/plans/team-access?training_plan_id=${planToEditAccess.id}`, {
                      method: 'DELETE',
                    });
                    
                    if (!deleteResponse.ok) {
                      console.error('Error deleting existing team access');
                    }
                    
                    // Then create new team access entries for each selected team
                    for (const teamId of selectedTeams) {
                      const teamAccessResponse = await fetch('/api/plans/team-access', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          training_plan_id: planToEditAccess.id,
                          team_id: teamId
                        }),
                      });
                      
                      if (!teamAccessResponse.ok) {
                        console.error('Error saving team access for team:', teamId);
                      }
                    }
                  }
                  
                  // Update the local state
                  setSavedPlans(prevPlans => {
                    return prevPlans.map(p => {
                      if (p.id === planToEditAccess.id) {
                        return {
                          ...p,
                          privacy: planToEditAccess.privacy,
                          privacy_level: planToEditAccess.privacy
                        };
                      }
                      return p;
                    });
                  });
                  
                  setShowEditAccessDialog(false);
                  
                  toast({
                    title: "Access Settings Updated",
                    description: `Access settings for ${planToEditAccess.name} have been updated.`,
                  });
                  
                  // Refresh plans from server
                  const fetchPlansFromSupabase = async () => {
                    try {
                      console.log('Fetching plans for user ID:', userId);
                      
                      const response = await fetch(`/api/plans?userId=${userId}`);
                      
                      if (!response.ok) {
                        throw new Error('Failed to fetch plans from database');
                      }
                      
                      const data = await response.json();
                      console.log('Plans fetched from database:', data);
                      
                      if (data.plans && data.plans.length > 0) {
                        // Process and update plans...
                        // This code is simplified as we already have this logic elsewhere
                        setSavedPlans(data.plans.map(plan => ({
                          ...plan,
                          privacy: plan.privacy_level,
                          name: plan.title || plan.name
                        })));
                      }
                    } catch (error) {
                      console.error('Error refreshing plans:', error);
                    }
                  };
                  
                  fetchPlansFromSupabase();
                } catch (error) {
                  console.error('Error updating access settings:', error);
                  
                  toast({
                    title: "Error Updating Access",
                    description: "There was an error updating the access settings.",
                    variant: "destructive",
                  });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Plans Dialog */}
      <Dialog open={showSavedPlans} onOpenChange={setShowSavedPlans}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>My Training Plans</DialogTitle>
            <DialogDescription className="text-white/80">
              Load a saved training plan or create a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Button onClick={createNewPlan} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </Button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {savedPlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-white/70 border border-dashed border-white/30 rounded-lg">
                  <p className="text-center mb-1 text-white">No saved plans yet</p>
                  <p className="text-center text-sm text-white/80">Create and save your first training plan</p>
                </div>
              ) : (
                savedPlans.map((plan) => (
                  <Card key={plan.id} className="bg-gray-800 border-white/20 text-white">
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          {plan.shared && (
                            <Badge variant="outline" className="ml-2 bg-green-600/20 text-green-100 border-green-500/30">
                              Shared with you
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-blue-600/20 text-blue-100 border-blue-500/30">
                          {plan.sport.charAt(0).toUpperCase() + plan.sport.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="flex justify-between text-sm text-white/80">
                        <div>Duration: {Array.isArray(plan.drills) ? plan.drills.reduce((total, drill) => total + (drill?.duration || 0), 0) : 0} min</div>
                        <div>Drills: {Array.isArray(plan.drills) ? plan.drills.length : 0}</div>
                      </div>
                      
                      <div className="flex items-center mt-2 text-xs">
                        <div className="flex items-center">
                          {(plan.privacy || plan.privacy_level) && (
                            <Badge variant="outline" className={"mr-2 " + (
                              (plan.privacy === 'private' || plan.privacy_level === 'private') 
                                ? "bg-gray-600/20 text-gray-100 border-gray-500/30" 
                                : (plan.privacy === 'team' || plan.privacy_level === 'team') 
                                  ? "bg-blue-600/20 text-blue-100 border-blue-500/30" 
                                  : "bg-green-600/20 text-green-100 border-green-500/30"
                            )}>
                              {plan.privacy || plan.privacy_level}
                            </Badge>
                          )}
                          
                          {/* Show team access information */}
                          {(plan.privacy === 'team' || plan.privacy_level === 'team') && plan.team_access && plan.team_access.length > 0 && (
                            <div className="text-white/70 flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span>Shared with {plan.team_access.length} team{plan.team_access.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-3">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-xs text-white/70">
                          Last modified: {new Date(plan.lastModified).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          {!plan.shared && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 hover:bg-white/10 text-white"
                              onClick={() => openEditAccessDialog(plan)}
                            >
                              <Users className="h-3 w-3 mr-1" />
                              Access
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:bg-white/10 text-white"
                            onClick={() => loadPlan(plan)}
                          >
                            Load Plan
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
// Remove the Link to create a new activity/drill:
// <Link href="/activities/new">
//   <Button
//     variant="outline"
//     size="sm"
//     className="border-white/20 bg-gray-200 hover:bg-gray-300 text-black"
//   >
//     <Plus className="h-4 w-4 mr-2" />
//     New Activity/Drill
//   </Button>
// </Link>
