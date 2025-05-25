"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { SportsActivitiesSelect } from "@/components/sports-activities-select"
import {
  Search,
  Filter,
  Users,
  Save,
  FileText,
  Trash2,
  Edit,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  FolderOpen,
  Info,
  ExternalLink,
  Pencil,
  Target,
  Clock,
  Dumbbell,
  Video,
  Upload,
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
    skillLevel: "All Levels",
    players: "Any",
    equipment: ["Speed Ladder"],
    sport: "soccer-football",
    objectives: ["Improve foot speed", "Enhance coordination"],
    type: "Footwork",
  },
  {
    id: "drill-19",
    name: "Guided Visualization",
    description: "Guided meditation focusing on game scenarios and performance",
    duration: 10,
    category: "Mental",
    skillLevel: "All Levels",
    players: "Any",
    equipment: [],
    sport: "soccer-football",
    objectives: ["Improve mental focus", "Reduce performance anxiety"],
    type: "Meditation",
  },
]

const sampleSavedPlans: PracticePlan[] = [
  {
    id: "plan-1",
    name: "Standard Training Session",
    sport: "soccer-football",
    duration: 90,
    drills: [
      {
        id: "pd-1",
        drillId: "drill-7",
        name: "Warm-up Jog & Stretch",
        duration: 10,
        description: "Light jogging followed by dynamic stretching routine",
      },
      {
        id: "pd-2",
        drillId: "drill-1",
        name: "Passing Triangle",
        duration: 15,
        description: "Players form triangles and practice passing and movement",
      },
      {
        id: "pd-3",
        drillId: "drill-5",
        name: "Dribbling Relay",
        duration: 10,
        description: "Teams compete in a dribbling relay race through cones",
      },
      {
        id: "pd-4",
        drillId: "drill-2",
        name: "Shooting Practice",
        duration: 20,
        description: "Players take turns shooting at goal from various positions",
      },
      {
        id: "pd-5",
        drillId: "drill-4",
        name: "Small-Sided Game",
        duration: 25,
        description: "4v4 small-sided game with focus on quick transitions",
      },
      {
        id: "pd-6",
        drillId: "drill-8",
        name: "Cool Down & Stretch",
        duration: 10,
        description: "Light activity followed by static stretching",
      },
    ],
    createdAt: "2023-10-15T10:30:00Z",
    lastModified: "2023-10-15T10:30:00Z",
  },
  {
    id: "plan-2",
    name: "Defensive Focus Session",
    sport: "soccer-football",
    duration: 85,
    drills: [
      {
        id: "pd-7",
        drillId: "drill-7",
        name: "Warm-up Jog & Stretch",
        duration: 10,
        description: "Light jogging followed by dynamic stretching routine",
      },
      {
        id: "pd-8",
        drillId: "drill-3",
        name: "1v1 Defending",
        duration: 15,
        description: "Players practice 1v1 defending techniques in a confined space",
      },
      {
        id: "pd-9",
        drillId: "drill-11",
        name: "Defensive Shape",
        duration: 20,
        description: "Team works on maintaining defensive shape against attackers",
      },
      {
        id: "pd-10",
        drillId: "drill-6",
        name: "Possession Circle",
        duration: 15,
        description: "Players maintain possession against defenders in a circle",
      },
      {
        id: "pd-11",
        drillId: "drill-4",
        name: "Small-Sided Game",
        duration: 25,
        description: "4v4 small-sided game with focus on quick transitions",
      },
    ],
    createdAt: "2023-10-20T14:15:00Z",
    lastModified: "2023-10-20T14:15:00Z",
  },
]

// Activity tagging options
const activityTaggingOptions = [
  "All",
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
  "Training",
  "Tactical",
  "Drill",
  "Passing",
  "Shooting",
  "Defending",
  "Game Play",
  "Dribbling",
  "Warm-up",
  "Cool Down",
  "Attacking",
  "Possession",
  "Game Simulation",
  "Goalkeeping",
  "Fitness",
  "Ball Control",
  "Mental",
]

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
  const [currentPlan, setCurrentPlan] = useState<PracticePlan>({
    id: `plan-${Math.random().toString(36).substring(2, 11)}`,
    name: "New Training Plan",
    sport: "soccer-football",
    duration: 90,
    drills: [],
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  })
  const [savedPlans, setSavedPlans] = useState<PracticePlan[]>(sampleSavedPlans)
  const [isEditingName, setIsEditingName] = useState(false)
  const [showSavedPlans, setShowSavedPlans] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showDurationDialog, setShowDurationDialog] = useState(false)
  const [customDuration, setCustomDuration] = useState(practiceDuration)

  // Handle client-side rendering for export link to prevent hydration errors
  useEffect(() => {
    setIsClient(true)
    
    // Replace the export link placeholder with the actual link
    const container = document.getElementById('export-link-container')
    if (container) {
      container.innerHTML = `
        <a href="/export?id=${currentPlan.id}">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-white/90 font-medium h-9 px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><polyline points="10 9 9 9 8 9"></polyline></svg>
            Export Plan
          </button>
        </a>
      `
    }
  }, [currentPlan.id])
  const [customDrills, setCustomDrills] = useState<Drill[]>([])
  const [showNewDrillDialog, setShowNewDrillDialog] = useState(false)
  const [showDrillDetailDialog, setShowDrillDetailDialog] = useState(false)
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null)
  const [newDrill, setNewDrill] = useState<Partial<Drill>>({
    name: "",
    description: "",
    duration: 15,
    activity_tagging: "passing",
    skillLevel: "Intermediate",
    players: "Any",
    equipment: [],
    sport: selectedSport,
    objectives: [""],
    isCustom: true,
    tagClassification: "sport-specific"
  })

  // Save current plan to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("currentPlan", JSON.stringify(currentPlan))
    } catch (error) {
      console.error("Error saving plan to localStorage:", error)
    }
  }, [currentPlan])

  // Helper function to determine tag classification if not explicitly set
  const getTagClassification = (drill: Drill): "sport-specific" | "selective-universal" | "universal" => {
    // If explicitly set, use that value
    if (drill.tagClassification) {
      return drill.tagClassification;
    }
    
    // Otherwise, determine based on activity type
    // Universal tags (applicable to all sports)
    const universalTags = ["Warm-up", "Cool Down", "Recovery", "Mental", "Strength", "Team Building"];
    
    // Check if the activity is universal
    if (universalTags.includes(drill.activity_tagging)) {
      return "universal";
    }
    
    // Sport-specific tags (only apply to the current sport)
    const sportSpecificMap: Record<string, string[]> = {
      "soccer-football": ["Passing", "Shooting", "Defending", "Dribbling", "Ball Control"],
      "basketball": ["Shooting", "Dribbling", "Defense", "Rebounding"],
      "baseball": ["Batting", "Fielding", "Pitching", "Base Running"],
      // Add more sports as needed
    };
    
    // Check if the activity is sport-specific for the current sport
    if (sportSpecificMap[selectedSport]?.includes(drill.activity_tagging)) {
      return "sport-specific";
    }
    
    // Default to selective-universal (cross-sport but not universal)
    return "selective-universal";
  };

  // Filter drills based on search, category, type, and tag classification
  // Combine sample and custom drills, then filter
  const allDrills = [...sampleDrills, ...customDrills]
  
  // Extract unique sport values from available drills
  const availableSports = Array.from(new Set(allDrills.map(drill => drill.sport)))
  const filteredDrills = allDrills.filter((drill) => {
    const matchesSport = selectedSport === "all" || drill.sport === selectedSport
    const matchesCategory = selectedCategory === "All" || drill.activity_tagging === selectedCategory.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      drill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.description.toLowerCase().includes(searchQuery.toLowerCase())
      
    // Additional filter for sport-specific toggle
    const tagClassification = getTagClassification(drill);
    const matchesTagFilter = !showSportSpecificOnly || 
      tagClassification === "sport-specific" || 
      tagClassification === "universal";

    return matchesSport && matchesCategory && matchesSearch && matchesTagFilter
  })

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

        // Show toast notification
        toast({
          title: "Drill Added",
          description: `${drillToAdd.name} added to practice plan`,
        })
      }
    }
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
  }

  // Update drill duration
  const updateDrillDuration = (drillId: string, newDuration: number) => {
    setCurrentPlan({
      ...currentPlan,
      drills: currentPlan.drills.map((d) => (d.id === drillId ? { ...d, duration: newDuration } : d)),
      lastModified: new Date().toISOString(),
    })
  }

  // Save current plan
  const savePlan = (name: string) => {
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

    toast({
      title: "Plan Saved",
      description: `${name} has been saved successfully`,
    })
  }

  // Load a saved plan
  const loadPlan = (plan: PracticePlan) => {
    setCurrentPlan(plan)
    setSelectedSport(plan.sport)
    setPracticeDuration(plan.duration)
    setShowSavedPlans(false)
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
    })
    setShowSavedPlans(false)
  }

  // Add new custom drill
  const addNewDrill = async () => {
    if (!newDrill.name || !newDrill.description) {
      toast({
        title: "Error",
        description: "Name and description are required",
        variant: "destructive",
      })
      return
    }

    try {
      // Prepare data for submission to Supabase
      const submissionData = {
        title: newDrill.name,
        sport: newDrill.sport || selectedSport,
        activity_tagging: newDrill.activity_tagging,
        description: newDrill.description,
        setup_instructions: newDrill.setup,
        coaching_points: newDrill.tips,
        duration: newDrill.duration || 15,
        equipment: newDrill.equipment || [],
        participants: newDrill.players,
        skill_level: newDrill.skillLevel || "All Levels", // Match the exact values from database constraint
        type: newDrill.type || "Drills", // Match the exact values from database constraint
        is_custom: true,
        video_url: newDrill.videoUrl,
        image_url: newDrill.imageUrl,
        objectives: newDrill.objectives || []
      }

      // Log the data being sent
      console.log('Submitting activity data:', JSON.stringify(submissionData, null, 2));

      // Save to Supabase using the same API endpoint
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

      // Also add to local state for immediate display
      const customDrill: Drill = {
        id: result.data.id || `custom-drill-${customDrills.length + 1}-${newDrill.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: newDrill.name || "",
        description: newDrill.description || "",
        duration: newDrill.duration || 15,
        category: newDrill.category || "Other",
        skillLevel: newDrill.skillLevel || "All Levels",
        players: newDrill.players || "Any",
        equipment: newDrill.equipment || [],
        sport: newDrill.sport || selectedSport,
        objectives: newDrill.objectives || [""],
        type: newDrill.type || "Drills",
        isCustom: true,
        setup: newDrill.setup,
        instructions: newDrill.instructions,
        variations: newDrill.variations,
        tips: newDrill.tips,
        imageUrl: newDrill.imageUrl,
        videoUrl: newDrill.videoUrl,
      }

      setCustomDrills([...customDrills, customDrill])
      setShowNewDrillDialog(false)

      // Reset new drill form
      setNewDrill({
        name: "",
        description: "",
        duration: 15,
        category: "Passing",
        skillLevel: "All Levels", // Match database constraint
        players: "Any",
        equipment: [],
        sport: selectedSport,
        objectives: [""],
        type: "Drills", // Match database constraint
        isCustom: true,
      })

      toast({
        title: "Drill Created",
        description: `${customDrill.name} has been added to your library and saved to database`,
      })
    } catch (error) {
      console.error('Error creating activity:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create activity',
        variant: "destructive",
      })
    }
  }

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
              <Link href="/activities/new">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-gray-200 hover:bg-gray-300 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Activity/Drill
                </Button>
              </Link>

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

              {/* Export link - client-side only to prevent hydration errors */}
              <div id="export-link-container">
                {/* Will be replaced with actual link on client side */}
                <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium opacity-70" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  Export Plan
                </Button>
              </div>
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => {
                            setCustomDuration(practiceDuration);
                            setShowDurationDialog(true);
                          }}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
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
                      size="sm"
                      onClick={() => setShowNewDrillDialog(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Activity/Drill
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Activity Tagging Filter */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-white">Activity Tags</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/70">Show Sport-Specific Only</span>
                        <Switch
                          checked={showSportSpecificOnly}
                          onCheckedChange={setShowSportSpecificOnly}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>
                    {/* Group tags by classification */}
                    <div className="space-y-3">
                      {/* Process tags to group them by classification */}
                      {(() => {
                        // Define tag groups
                        const universalTags = ["Warm-up", "Cool Down", "Recovery", "Mental", "Strength", "Team Building"];
                        const sportSpecificMap: Record<string, string[]> = {
                          "soccer-football": ["Passing", "Shooting", "Defending", "Dribbling", "Ball Control"],
                          "basketball": ["Shooting", "Dribbling", "Defense", "Rebounding"],
                          "baseball": ["Batting", "Fielding", "Pitching", "Base Running"],
                        };
                        
                        // Group tags by classification
                        const sportSpecificTags: string[] = [];
                        const selectiveUniversalTags: string[] = [];
                        const universalTagsList: string[] = [];
                        
                        // Categorize each tag
                        activityTaggingOptions.forEach(tag => {
                          if (tag === "All") return; // Skip the "All" tag
                          
                          if (universalTags.includes(tag)) {
                            universalTagsList.push(tag);
                          } else if (sportSpecificMap[selectedSport]?.includes(tag)) {
                            sportSpecificTags.push(tag);
                          } else {
                            selectiveUniversalTags.push(tag);
                          }
                        });
                        
                        // Skip selective universal tags if toggle is on
                        const tagsToRender = showSportSpecificOnly ? 
                          [...sportSpecificTags, ...universalTagsList] : 
                          [...sportSpecificTags, ...selectiveUniversalTags, ...universalTagsList];
                        
                        // Add the "All" tag at the beginning
                        tagsToRender.unshift("All");
                        
                        // Render tag groups
                        return (
                          <div className="space-y-2">
                            {/* Sport-specific tags */}
                            {sportSpecificTags.length > 0 && (
                              <div>
                                <div className="flex items-center mb-1">
                                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                                  <span className="text-xs text-white/60">Sport-specific</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {sportSpecificTags.map(tag => (
                                    <Badge
                                      key={tag}
                                      variant={selectedCategory === tag ? "default" : "outline"}
                                      className={
                                        selectedCategory === tag
                                          ? `cursor-pointer bg-red-500 hover:bg-red-600 text-white border border-red-500 border-[1px]`
                                          : `cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-red-500 border-[1px]`
                                      }
                                      onClick={() => setSelectedCategory(tag)}
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Selective universal tags */}
                            {!showSportSpecificOnly && selectiveUniversalTags.length > 0 && (
                              <div>
                                <div className="flex items-center mb-1">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                                  <span className="text-xs text-white/60">Selective universal</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {selectiveUniversalTags.map(tag => (
                                    <Badge
                                      key={tag}
                                      variant={selectedCategory === tag ? "default" : "outline"}
                                      className={
                                        selectedCategory === tag
                                          ? `cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-black border border-yellow-500 border-[1px]`
                                          : `cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-yellow-500 border-[1px]`
                                      }
                                      onClick={() => setSelectedCategory(tag)}
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Universal tags */}
                            {universalTagsList.length > 0 && (
                              <div>
                                <div className="flex items-center mb-1">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                  <span className="text-xs text-white/60">Universal</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {universalTagsList.map(tag => (
                                    <Badge
                                      key={tag}
                                      variant={selectedCategory === tag ? "default" : "outline"}
                                      className={
                                        selectedCategory === tag
                                          ? `cursor-pointer bg-green-500 hover:bg-green-600 text-white border border-green-500 border-[1px]`
                                          : `cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-green-500 border-[1px]`
                                      }
                                      onClick={() => setSelectedCategory(tag)}
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* All tag */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge
                                key="All"
                                variant={selectedCategory === "All" ? "default" : "outline"}
                                className={
                                  selectedCategory === "All"
                                    ? `cursor-pointer bg-gray-500 hover:bg-gray-600 text-white border border-gray-500 border-[1px]`
                                    : `cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-gray-500 border-[1px]`
                                }
                                onClick={() => setSelectedCategory("All")}
                              >
                                All
                              </Badge>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

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
                        {activityTaggingOptions.map((tag: string) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
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
                                      <Badge className="bg-green-600/30 text-green-100 hover:bg-green-600/40 text-xs">
                                        {drill.type}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center text-xs text-white/50">
                                        <Users className="h-3 w-3 mr-1" />
                                        <span>{drill.players}</span>
                                        <Separator orientation="vertical" className="mx-2 h-3 bg-white/20" />
                                        <span>{drill.equipment.join(", ") || "No equipment"}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-7 px-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-colors"
                                          onClick={() => openDrillDetail(drill)}
                                        >
                                          <Info className="h-4 w-4" />
                                          <span className="ml-1 text-xs">View Details</span>
                                        </Button>
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
                      <Badge
                        className={
                          totalDuration > practiceDuration
                            ? "bg-red-600/30 text-red-100"
                            : totalDuration < practiceDuration
                              ? "bg-yellow-600/30 text-yellow-100"
                              : "bg-green-600/30 text-green-100"
                        }
                      >
                        {totalDuration > practiceDuration
                          ? `${totalDuration - practiceDuration} min over`
                          : totalDuration < practiceDuration
                            ? `${practiceDuration - totalDuration} min under`
                            : "Perfect!"}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-white/80">
                    Drag and drop to reorder drills in your plan
                  </CardDescription>
                  {currentPlan.drills.length > 0 && (
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
                        onClick={() => {
                          setAllExpanded(!allExpanded);
                          const newExpandedState: Record<string, boolean> = {};
                          currentPlan.drills.forEach(drill => {
                            newExpandedState[drill.id] = !allExpanded;
                          });
                          setExpandedDrills(newExpandedState);
                        }}
                      >
                        {allExpanded ? "Collapse All" : "Expand All"}
                      </Button>
                    </div>
                  )}
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
                            <div className="mb-3">
                              <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mx-auto opacity-70"
                              >
                                <path
                                  d="M12 2L2 7L12 12L22 7L12 2Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2 17L12 22L22 17"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2 12L12 17L22 12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
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
                                      {expandedDrills[drill.id] && (() => {
                                        // Find the full drill details from the original drill
                                        const fullDrill = findDrillById(drill.drillId);
                                        return (
                                          <div className="mt-3 p-3 bg-white/5 rounded-md border border-white/10">
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                              {fullDrill?.type && (
                                                <div className="flex items-center gap-1">
                                                  <span className="text-xs text-white/70">Type:</span>
                                                  <span className="text-xs text-white/90">{fullDrill.type}</span>
                                                </div>
                                              )}
                                              {fullDrill?.skillLevel && (
                                                <div className="flex items-center gap-1">
                                                  <span className="text-xs text-white/70">Level:</span>
                                                  <span className="text-xs text-white/90">{fullDrill.skillLevel}</span>
                                                </div>
                                              )}
                                              {fullDrill?.category && (
                                                <div className="flex items-center gap-1">
                                                  <span className="text-xs text-white/70">Category:</span>
                                                  <span className="text-xs text-white/90">{fullDrill.category}</span>
                                                </div>
                                              )}
                                              {fullDrill?.players && (
                                                <div className="flex items-center gap-1">
                                                  <span className="text-xs text-white/70">Players:</span>
                                                  <span className="text-xs text-white/90">{fullDrill.players}</span>
                                                </div>
                                              )}
                                            </div>
                                            
                                            {fullDrill?.equipment && fullDrill.equipment.length > 0 && (
                                              <div className="mb-3">
                                                <span className="text-xs text-white/70 mr-1">Equipment:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                  {fullDrill.equipment.map((item, i) => (
                                                    <Badge key={i} variant="outline" className="bg-white/5 text-white border-white/20 text-xs">
                                                      {item}
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                            
                                            {fullDrill?.objectives && fullDrill.objectives.length > 0 && (
                                              <div className="mb-3">
                                                <span className="text-xs text-white/70">Objectives:</span>
                                                <ul className="list-disc pl-5 mt-1">
                                                  {fullDrill.objectives.map((objective, i) => (
                                                    <li key={i} className="text-xs text-white/90">{objective}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                            
                                            {fullDrill?.setup && (
                                              <div className="mb-3">
                                                <span className="text-xs font-medium text-white/80">Setup:</span>
                                                <p className="text-xs text-white/90 mt-1 whitespace-pre-line">{fullDrill.setup}</p>
                                              </div>
                                            )}
                                            
                                            {fullDrill?.instructions && (
                                              <div className="mb-3">
                                                <span className="text-xs font-medium text-white/80">Instructions:</span>
                                                <p className="text-xs text-white/90 mt-1 whitespace-pre-line">{fullDrill.instructions}</p>
                                              </div>
                                            )}
                                            
                                            {fullDrill?.variations && (
                                              <div className="mb-3">
                                                <span className="text-xs font-medium text-white/80">Variations:</span>
                                                <p className="text-xs text-white/90 mt-1 whitespace-pre-line">{fullDrill.variations}</p>
                                              </div>
                                            )}
                                            
                                            {fullDrill?.tips && (
                                              <div className="mb-3">
                                                <span className="text-xs font-medium text-white/80">Coaching Tips:</span>
                                                <p className="text-xs text-white/90 mt-1 whitespace-pre-line">{fullDrill.tips}</p>
                                              </div>
                                            )}
                                            
                                            {drill.notes && (
                                              <div className="mb-3">
                                                <span className="text-xs font-medium text-white/80">Practice Notes:</span>
                                                <p className="text-xs text-white/90 mt-1">{drill.notes}</p>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                      <div className="mt-2 flex items-center">
                                        <Label htmlFor={`duration-${drill.id}`} className="text-xs text-white/70 mr-2">
                                          Duration:
                                        </Label>
                                        <div className="flex items-center">
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6 rounded-r-none border-white/20 bg-white/10"
                                            onClick={() =>
                                              updateDrillDuration(drill.id, Math.max(5, drill.duration - 5))
                                            }
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                          </Button>
                                          <Input
                                            id={`duration-${drill.id}`}
                                            type="number"
                                            value={drill.duration}
                                            onChange={(e) =>
                                              updateDrillDuration(drill.id, Number.parseInt(e.target.value) || 5)
                                            }
                                            className="h-6 w-16 rounded-none border-x-0 border-white/20 bg-white/10 text-center text-sm text-white"
                                            min={5}
                                            max={60}
                                            step={5}
                                          />
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6 rounded-l-none border-white/20 bg-white/10"
                                            onClick={() =>
                                              updateDrillDuration(drill.id, Math.min(60, drill.duration + 5))
                                            }
                                          >
                                            <ChevronUp className="h-3 w-3" />
                                          </Button>
                                          <span className="ml-1 text-xs text-white/70">min</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedDrills(prev => ({
                                            ...prev,
                                            [drill.id]: !prev[drill.id]
                                          }));
                                        }}
                                      >
                                        {expandedDrills[drill.id] ? "Collapse" : "View Details"}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
                                        onClick={() => {
                                          const fullDrill = findDrillById(drill.drillId)
                                          if (fullDrill) {
                                            openDrillDetail(fullDrill)
                                          }
                                        }}
                                      >
                                        <Info className="h-4 w-4" />
                                      </Button>
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
              {savedPlans.map((plan) => (
                <Card key={plan.id} className="bg-gray-800 border-white/20 text-white">
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge variant="outline" className="bg-blue-600/20 text-blue-100 border-blue-500/30">
                        {plan.sport.charAt(0).toUpperCase() + plan.sport.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex justify-between text-sm text-white/80">
                      <div>Duration: {plan.drills.reduce((total, drill) => total + drill.duration, 0)} min</div>
                      <div>Drills: {plan.drills.length}</div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {plan.drills.slice(0, 3).map((drill) => (
                        <Badge
                          key={drill.id}
                          variant="outline"
                          className="bg-white/10 text-white/90 border-white/30 text-xs"
                        >
                          {drill.name}
                        </Badge>
                      ))}
                      {plan.drills.length > 3 && (
                        <Badge variant="outline" className="bg-white/10 text-white/90 border-white/30 text-xs">
                          +{plan.drills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-xs text-white/70">
                        Last modified: {new Date(plan.lastModified).toLocaleDateString()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 hover:bg-white/10 text-white"
                        onClick={() => loadPlan(plan)}
                      >
                        Load Plan
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drill Detail Dialog */}
      <Dialog open={showDrillDetailDialog} onOpenChange={setShowDrillDetailDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-4xl max-h-[90vh] overflow-hidden">
          {selectedDrill && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl">{selectedDrill.name}</DialogTitle>
                    <DialogDescription className="text-white/80 mt-1">{selectedDrill.description}</DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600/30 text-blue-100">{selectedDrill.category}</Badge>
                    <Badge className="bg-purple-600/30 text-purple-100">{selectedDrill.skillLevel}</Badge>
                    <Badge className="bg-green-600/30 text-green-100">{selectedDrill.type}</Badge>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[calc(90vh-120px)]">
                <div className="py-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column - Details */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-400" />
                          <div>
                            <div className="text-xs text-white/70">Duration</div>
                            <div className="font-medium">{selectedDrill.duration} minutes</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                          <Users className="h-5 w-5 text-purple-400" />
                          <div>
                            <div className="text-xs text-white/70">Players</div>
                            <div className="font-medium">{selectedDrill.players}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-5 w-5 text-green-400" />
                          <h3 className="font-medium">Equipment</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDrill.equipment && selectedDrill.equipment.length > 0 ? (
                            selectedDrill.equipment.map((item, index) => (
                              <Badge key={index} variant="outline" className="bg-white/5 text-white border-white/20">
                                {item}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-white/70">No equipment needed</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-red-400" />
                          <h3 className="font-medium">Objectives</h3>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-white/90">
                          {selectedDrill.objectives &&
                            selectedDrill.objectives.map((objective, index) => <li key={index}>{objective}</li>)}
                        </ul>
                      </div>

                      {selectedDrill.setup && (
                        <div className="space-y-2">
                          <h3 className="font-medium">Setup</h3>
                          <p className="text-white/90 whitespace-pre-line">{selectedDrill.setup}</p>
                        </div>
                      )}

                      {selectedDrill.instructions && (
                        <div className="space-y-2">
                          <h3 className="font-medium">Instructions</h3>
                          <p className="text-white/90 whitespace-pre-line">{selectedDrill.instructions}</p>
                        </div>
                      )}
                    </div>

                    {/* Right column - Image, Video, Variations */}
                    <div className="space-y-6">
                      {selectedDrill.imageUrl && (
                        <div className="space-y-2">
                          <h3 className="font-medium">Diagram</h3>
                          <div className="rounded-lg overflow-hidden border border-white/10">
                            <Image
                              src={selectedDrill.imageUrl || "/placeholder.svg"}
                              alt={`Diagram for ${selectedDrill.name}`}
                              width={400}
                              height={300}
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      )}

                      {selectedDrill.videoUrl && (
                        <div className="space-y-2">
                          <h3 className="font-medium flex items-center gap-2">
                            <Video className="h-4 w-4 text-red-400" />
                            Video Demonstration
                          </h3>
                          <div className="flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10">
                            <Button
                              variant="outline"
                              className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 border-transparent"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Watch Video
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedDrill.variations && (
                        <div className="space-y-2">
                          <h3 className="font-medium">Variations</h3>
                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <p className="text-white/90 whitespace-pre-line">{selectedDrill.variations}</p>
                          </div>
                        </div>
                      )}

                      {selectedDrill.tips && (
                        <div className="space-y-2">
                          <h3 className="font-medium">Coaching Tips</h3>
                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <p className="text-white/90 whitespace-pre-line">{selectedDrill.tips}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/20 dark:text-white"
                    onClick={() => setShowDrillDetailDialog(false)}
                  >
                    Close
                  </Button>
                  <div className="flex gap-2">
                    {selectedDrill.isCustom && (
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:text-white">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Drill
                      </Button>
                    )}
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white dark:text-white"
                      onClick={() => {
                        addDrillToPlan(selectedDrill)
                        setShowDrillDetailDialog(false)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Plan
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Duration Dialog */}
      <Dialog open={showDurationDialog} onOpenChange={setShowDurationDialog}>
        <DialogContent className="bg-gray-900 text-white border-white/20 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Custom Duration</DialogTitle>
            <DialogDescription className="text-white/70">
              Enter a custom duration for your activity (in minutes).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="custom-duration" className="text-right">
                Minutes
              </Label>
              <Input
                id="custom-duration"
                type="number"
                min="0"
                value={customDuration}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value >= 0) {
                    setCustomDuration(value);
                  }
                }}
                className="col-span-3 bg-gray-800 border-white/20 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowDurationDialog(false)}
              className="text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setPracticeDuration(customDuration);
                setShowDurationDialog(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Drill Dialog */}
      <Dialog open={showNewDrillDialog} onOpenChange={setShowNewDrillDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Activity/Drill</DialogTitle>
            <DialogDescription className="text-white/80">Add a custom activity or drill to your personal library</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)]">
            <div className="py-4 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="activity-name" className="text-white">Activity Name</Label>
                  <Input
                    id="activity-name"
                    value={newDrill.name}
                    onChange={(e) => setNewDrill({ ...newDrill, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="e.g., Advanced Passing Drill"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-duration" className="text-white">Duration (minutes)</Label>
                  <Input
                    id="activity-duration"
                    type="number"
                    value={newDrill.duration}
                    onChange={(e) => setNewDrill({ ...newDrill, duration: Number(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="15"
                  />
                </div>
              </div>

              {/* Sport and Activity Tagging */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="activity-sport" className="text-white">Sport or Activity</Label>
                  <SportsActivitiesSelect
                    value={newDrill.sport || ""}
                    onValueChange={(value) => setNewDrill({ ...newDrill, sport: value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-tagging" className="text-white">Activity Tagging</Label>
                  <Select
                    value={newDrill.activity_tagging}
                    onValueChange={(value) => setNewDrill({ ...newDrill, activity_tagging: value })}
                  >
                    <SelectTrigger id="activity-focus" className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select activity tagging" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20 text-white">
                      {activityTaggingOptions
                        .filter((tag: string) => tag !== "All")
                        .map((tag: string) => (
                          <SelectItem key={tag} value={tag.toLowerCase()}>
                            {tag}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Skill Level and Tag Classification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="activity-skill" className="text-white">Skill Level</Label>
                  <Select
                    value={newDrill.skillLevel}
                    onValueChange={(value) => setNewDrill({ ...newDrill, skillLevel: value })}
                  >
                    <SelectTrigger id="activity-skill" className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20 text-white">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-classification" className="text-white">Tag Classification</Label>
                  <Select
                    value={newDrill.tagClassification}
                    onValueChange={(value: "sport-specific" | "selective-universal" | "universal") => 
                      setNewDrill({ ...newDrill, tagClassification: value })
                    }
                  >
                    <SelectTrigger 
                      id="activity-classification" 
                      className="bg-white/10 border-white/20 text-white"
                    >
                      <SelectValue placeholder="Select tag classification" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20 text-white">
                      <SelectItem value="sport-specific">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Sport-Specific (Red)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="selective-universal">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>Selective Universal (Yellow)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="universal">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Universal (Green)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-white/60 mt-1">
                    <span className="font-medium">Red:</span> Sport-specific activities<br/>
                    <span className="font-medium">Yellow:</span> Cross-sport with selective applicability<br/>
                    <span className="font-medium">Green:</span> Universal activities for all sports
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="activity-description" className="text-white">Description</Label>
                <textarea
                  id="activity-description"
                  value={newDrill.description}
                  onChange={(e) => setNewDrill({ ...newDrill, description: e.target.value })}
                  className="w-full h-32 bg-white/10 border-white/20 text-white rounded-md p-2 placeholder:text-white/50"
                  placeholder="Describe the activity and its objectives..."
                />
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="activity-video" className="text-white">Video URL</Label>
                <Input
                  id="activity-video"
                  value={newDrill.videoUrl || ""}
                  onChange={(e) => setNewDrill({ ...newDrill, videoUrl: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="e.g., YouTube or Vimeo URL"
                />
              </div>

              {/* Illustration or Court Diagram */}
              <div className="space-y-2">
                <Label className="text-white">Illustration or Court Diagram</Label>
                <div
                  className="border-2 border-dashed border-white/20 rounded-md p-8 text-center hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-white/50" />
                    <p className="text-white/70">Drag and drop an image, or click to select</p>
                  </div>
                </div>
              </div>

              {/* Additional fields */}
              <div className="space-y-2">
                <Label htmlFor="activity-players" className="text-white">Players</Label>
                <Input
                  id="activity-players"
                  value={newDrill.players}
                  onChange={(e) => setNewDrill({ ...newDrill, players: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="e.g., 6+, Any, 8-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Equipment (comma separated)</Label>
                <Input
                  value={newDrill.equipment?.join(", ") || ""}
                  onChange={(e) =>
                    setNewDrill({
                      ...newDrill,
                      equipment: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="e.g., Balls, Cones, Goals"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Objectives (comma separated)</Label>
                <Input
                  value={newDrill.objectives?.join(", ") || ""}
                  onChange={(e) =>
                    setNewDrill({
                      ...newDrill,
                      objectives: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="e.g., Improve passing, Enhance teamwork"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-setup" className="text-white">Setup Instructions</Label>
                <textarea
                  id="activity-setup"
                  value={newDrill.setup || ""}
                  onChange={(e) => setNewDrill({ ...newDrill, setup: e.target.value })}
                  className="w-full h-20 bg-white/10 border-white/20 text-white rounded-md p-2 placeholder:text-white/50"
                  placeholder="Describe how to set up the activity..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-instructions" className="text-white">Instructions</Label>
                <textarea
                  id="activity-instructions"
                  value={newDrill.instructions || ""}
                  onChange={(e) => setNewDrill({ ...newDrill, instructions: e.target.value })}
                  className="w-full h-32 bg-white/10 border-white/20 text-white rounded-md p-2 placeholder:text-white/50"
                  placeholder="Step-by-step instructions for running the activity..."
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowNewDrillDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={addNewDrill}
                disabled={!newDrill.name || !newDrill.description}
              >
                Create Activity/Drill
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

