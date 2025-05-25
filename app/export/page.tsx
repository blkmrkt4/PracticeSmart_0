"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, FileText, Download, Copy, Check, ExternalLink } from "lucide-react"

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
  type: string
  isCustom?: boolean
  setup?: string
  instructions?: string
  variations?: string
  tips?: string
  imageUrl?: string
  videoUrl?: string
}

type PracticeDrill = {
  id: string
  drillId: string
  name: string
  duration: number
  description: string
  notes?: string
  type?: string
  skillLevel?: string
  category?: string
  players?: string
  equipment?: string[]
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

// Sample saved plans for demo
const sampleSavedPlans: PracticePlan[] = [
  {
    id: "plan-1",
    name: "Standard Training Session",
    sport: "soccer",
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
    sport: "soccer",
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

// Sample drills data to match the build page
const sampleDrills: Drill[] = [
  {
    id: "drill-1",
    name: "Passing Triangle",
    description: "Players form triangles and practice passing and movement",
    duration: 15,
    activity_tagging: "Passing",
    skillLevel: "Intermediate",
    players: "9+",
    equipment: ["Balls", "Cones"],
    sport: "soccer",
    objectives: ["Improve passing accuracy", "Develop movement off the ball"],
    type: "Drills",
    setup: "Set up three cones in a triangle formation, approximately 10 yards apart. Place three players at each cone.",
    instructions: `1. Player A passes to Player B and then runs to take B's position
2. Player B receives the ball, passes to Player C, and runs to take C's position
3. Player C receives the ball, passes to Player A's replacement, and runs to take the new position
4. Continue this pattern, focusing on accurate passes and proper receiving technique`,
    variations: `- Limit touches to one or two
- Add defensive pressure
- Change the size of the triangle based on skill level
- Add a fourth cone to create a diamond pattern`,
    tips: `- Emphasize communication between players
- Focus on proper weight of passes
- Encourage players to check to the ball when receiving`,
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "drill-2",
    name: "Shooting Practice",
    description: "Players take turns shooting at goal from various positions",
    duration: 20,
    activity_tagging: "Shooting",
    skillLevel: "All Levels",
    players: "6+",
    equipment: ["Balls", "Goals"],
    sport: "soccer",
    objectives: ["Improve shooting accuracy", "Practice different shooting techniques"],
    type: "Drills",
    setup: "Set up a goal with a goalkeeper. Place cones at various distances and angles from the goal to mark shooting positions.",
    instructions: `1. Players line up at the first cone position
2. Each player takes a shot on goal
3. After shooting, players retrieve their ball and move to the next position
4. Continue rotating through all positions`,
    variations: `- Add a defender
- Limit to one-touch finishing
- Add a passing combination before shooting
- Time-based challenges`,
    tips: `- Focus on proper shooting technique
- Encourage players to aim for the corners
- Vary the shooting distance based on age and ability`,
    imageUrl: "/placeholder.svg?height=300&width=400",
    videoUrl: "https://www.youtube.com/watch?v=example",
  },
  {
    id: "drill-3",
    name: "1v1 Defending",
    description: "Players practice 1v1 defending techniques in a confined space",
    duration: 15,
    activity_tagging: "Defending",
    skillLevel: "Intermediate",
    players: "8+",
    equipment: ["Balls", "Cones", "Pinnies"],
    sport: "soccer",
    objectives: ["Improve defensive positioning", "Practice containment and tackling"],
    type: "Drills",
  },
  {
    id: "drill-4",
    name: "Small-Sided Game",
    description: "4v4 small-sided game with focus on quick transitions",
    duration: 25,
    activity_tagging: "Game Play",
    skillLevel: "All Levels",
    players: "8+",
    equipment: ["Balls", "Cones", "Pinnies"],
    sport: "soccer",
    objectives: ["Apply skills in game situations", "Develop decision making"],
    type: "Scrimmage",
  },
  {
    id: "drill-5",
    name: "Dribbling Relay",
    duration: 10,
    activity_tagging: "Dribbling",
    skillLevel: "Beginner",
    players: "6+",
    equipment: ["Balls", "Cones"],
    sport: "soccer",
    objectives: ["Improve dribbling control", "Add competitive element"],
    type: "Drills",
    description: "Teams compete in a dribbling relay race through cones",
  },
  {
    id: "drill-7",
    name: "Warm-up Jog & Stretch",
    duration: 10,
    activity_tagging: "Warm-up",
    skillLevel: "All Levels",
    players: "Any",
    equipment: [],
    sport: "soccer",
    objectives: ["Prepare body for activity", "Prevent injuries"],
    type: "Stretching",
    description: "Light jogging followed by dynamic stretching routine",
  },
  {
    id: "drill-8",
    name: "Cool Down & Stretch",
    duration: 10,
    activity_tagging: "Cool Down",
    skillLevel: "All Levels",
    players: "Any",
    equipment: [],
    sport: "soccer",
    objectives: ["Gradually lower heart rate", "Improve flexibility"],
    type: "Cooldown",
    description: "Light activity followed by static stretching",
  },
  {
    id: "drill-11",
    name: "Defensive Shape",
    duration: 20,
    activity_tagging: "Defending",
    skillLevel: "Intermediate",
    players: "11+",
    equipment: ["Balls", "Cones", "Pinnies"],
    sport: "soccer",
    objectives: ["Improve team defensive organization", "Practice shifting and covering"],
    type: "Drills",
    description: "Team works on maintaining defensive shape against attackers",
  },
];

// Helper function to find the full drill details
const findDrillById = (drillId: string): Drill | undefined => {
  return sampleDrills.find(drill => drill.id === drillId);
};

export default function ExportPage() {
  const searchParams = useSearchParams()
  const planId = searchParams.get("id")
  const [plan, setPlan] = useState<PracticePlan | null>(null)
  
  // Function to find a drill by its ID from the sample drills
  const findDrillById = (drillId: string) => {
    return sampleDrills.find(drill => drill.id === drillId)
  }
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("graphic-email")
  const [copiedHTML, setCopiedHTML] = useState(false)
  const [mailtoUrl, setMailtoUrl] = useState("")
  const [expandedDrills, setExpandedDrills] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // First try to find the plan in saved plans
    if (planId) {
      const foundPlan = sampleSavedPlans.find((p) => p.id === planId)

      // If not found in saved plans, check localStorage for current plan
      if (!foundPlan) {
        try {
          const storedPlan = localStorage.getItem("currentPlan")
          if (storedPlan) {
            const parsedPlan = JSON.parse(storedPlan)
            // Check if this is the plan we're looking for
            if (parsedPlan.id === planId) {
              setPlan(parsedPlan)
              return
            }
          }
        } catch (error) {
          console.error("Error retrieving plan from localStorage:", error)
        }
      } else {
        setPlan(foundPlan)
      }
    }

    // If no plan ID or plan not found, try to use the most recent plan from localStorage
    if (!plan) {
      try {
        const storedPlan = localStorage.getItem("currentPlan")
        if (storedPlan) {
          setPlan(JSON.parse(storedPlan))
        }
      } catch (error) {
        console.error("Error retrieving plan from localStorage:", error)
      }
    }
  }, [planId])

  // Update mailto URL when plan changes
  useEffect(() => {
    if (plan) {
      // Create mailto URL for the graphic email
      const subject = encodeURIComponent(`Training Plan: ${plan.name}`)
      const htmlBody = encodeURIComponent(generateHTML())
      const plainTextBody = encodeURIComponent(generatePlainText())

      // For the graphic email tab
      if (activeTab === "graphic-email") {
        setMailtoUrl(`mailto:?subject=${subject}&body=${plainTextBody}`)
      }
      // For the plain text email tab
      else if (activeTab === "plain-email") {
        setMailtoUrl(`mailto:?subject=${subject}&body=${plainTextBody}`)
      }
    }
  }, [plan, activeTab])

  // Generate plain text version of the plan
  const generatePlainText = () => {
    if (!plan) return ""

    let text = `TRAINING PLAN: ${plan.name.toUpperCase()}\n`
    text += `Sport: ${plan.sport.charAt(0).toUpperCase() + plan.sport.slice(1)}\n`
    text += `Total Duration: ${plan.duration} minutes\n`
    text += `Created: ${new Date(plan.createdAt).toLocaleDateString()}\n\n`
    text += `DRILL SEQUENCE:\n\n`

    plan.drills.forEach((drill, index) => {
      // Find the full drill details
      const fullDrill = findDrillById(drill.drillId);
      
      text += `${index + 1}. ${drill.name} (${drill.duration} minutes)\n`
      text += `   ${drill.description}\n`
      
      // Add activity tagging, skill level, type, and players if available
      if (fullDrill?.activity_tagging || fullDrill?.skillLevel || fullDrill?.type || fullDrill?.players) {
        text += `   `
        if (fullDrill?.activity_tagging) text += `Activity Tagging: ${fullDrill.activity_tagging} | `
        if (fullDrill?.skillLevel) text += `Level: ${fullDrill.skillLevel} | `
        if (fullDrill?.type) text += `Type: ${fullDrill.type} | `
        if (fullDrill?.players) text += `Players: ${fullDrill.players}`
        text += `\n`
      }
      
      // Add equipment if available
      if (fullDrill?.equipment && fullDrill.equipment.length > 0) {
        text += `   Equipment: ${fullDrill.equipment.join(", ")}\n`
      }
      
      // Add objectives if available
      if (fullDrill?.objectives && fullDrill.objectives.length > 0) {
        text += `   Objectives:\n`
        fullDrill.objectives.forEach(objective => {
          text += `     - ${objective}\n`
        })
      }
      
      // Add setup if available
      if (fullDrill?.setup) {
        text += `   Setup: ${fullDrill.setup}\n`
      }
      
      // Add instructions if available
      if (fullDrill?.instructions) {
        text += `   Instructions:\n${fullDrill.instructions.split('\n').map(line => `     ${line}`).join('\n')}\n`
      }
      
      // Add notes if available
      if (drill.notes) {
        text += `   Notes: ${drill.notes}\n`
      }
      
      text += `\n`
    })

    text += `Generated with Coaching Beast - The Ultimate Training Planning Tool`

    return text
  }

  // Generate HTML version of the plan
  const generateHTML = () => {
    if (!plan) return ""

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${plan.name} - Training Plan</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .subtitle { font-size: 16px; color: #666; margin-bottom: 20px; }
    .drill-section { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; background-color: #f9f9f9; }
    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
    .drill-item { background-color: white; border-radius: 6px; padding: 12px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .drill-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
    .drill-title { font-weight: bold; display: flex; align-items: center; }
    .drill-number { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background-color: #3b82f6; color: white; border-radius: 50%; font-size: 12px; margin-right: 8px; }
    .drill-duration { color: #3b82f6; font-weight: bold; }
    .drill-description { font-size: 14px; color: #555; }
    .drill-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; font-size: 12px; color: #666; }
    .drill-equipment, .drill-objectives, .drill-setup, .drill-instructions, .drill-notes { margin-top: 8px; font-size: 12px; color: #666; }
    .drill-objectives ul { margin-top: 4px; margin-bottom: 0; padding-left: 20px; }
    .drill-instructions div { white-space: pre-line; margin-top: 4px; }
    .footer { background-color: #f0f7ff; border-radius: 8px; padding: 12px; font-size: 14px; color: #3b82f6; }
    .footer-note { font-size: 12px; color: #999; margin-top: 5px; }
    .logo { text-align: right; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">${plan.name}</div>
      <div class="subtitle">${plan.sport.charAt(0).toUpperCase() + plan.sport.slice(1)} • ${plan.duration} minutes</div>
    </div>
    
    <div class="drill-section">
      <div class="section-title">Drill Sequence</div>
      `

    plan.drills.forEach((drill, index) => {
      html += `
      <div class="drill-item">
        <div class="drill-header">
          <div class="drill-title"><span class="drill-number">${index + 1}</span>${drill.name}</div>
          <div class="drill-duration">${drill.duration} min</div>
        </div>
        <div class="drill-description">${drill.description}</div>
        
        ${(() => {
          // Find the full drill details
          const fullDrill = findDrillById(drill.drillId);
          let detailsHtml = '';
          
          // Add activity tagging, skill level, type, and players if available
          if (fullDrill?.activity_tagging || fullDrill?.skillLevel || fullDrill?.type || fullDrill?.players) {
            detailsHtml += '<div class="drill-meta" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; font-size: 12px; color: #666;">';
            if (fullDrill?.activity_tagging) detailsHtml += `<div><strong>Activity Tagging:</strong> ${fullDrill.activity_tagging}</div>`;
            if (fullDrill?.skillLevel) detailsHtml += `<div><strong>Level:</strong> ${fullDrill.skillLevel}</div>`;
            if (fullDrill?.type) detailsHtml += `<div><strong>Type:</strong> ${fullDrill.type}</div>`;
            if (fullDrill?.players) detailsHtml += `<div><strong>Players:</strong> ${fullDrill.players}</div>`;
            detailsHtml += '</div>';
          }
          
          // Add equipment if available
          if (fullDrill?.equipment && fullDrill.equipment.length > 0) {
            detailsHtml += `<div class="drill-equipment" style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Equipment:</strong> ${fullDrill.equipment.join(", ")}</div>`;
          }
          
          // Add objectives if available
          if (fullDrill?.objectives && fullDrill.objectives.length > 0) {
            detailsHtml += '<div class="drill-objectives" style="margin-top: 8px; font-size: 12px; color: #666;">';
            detailsHtml += '<strong>Objectives:</strong>';
            detailsHtml += '<ul style="margin-top: 4px; margin-bottom: 0; padding-left: 20px;">';
            fullDrill.objectives.forEach(objective => {
              detailsHtml += `<li>${objective}</li>`;
            });
            detailsHtml += '</ul></div>';
          }
          
          // Add setup if available
          if (fullDrill?.setup) {
            detailsHtml += `<div class="drill-setup" style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Setup:</strong> ${fullDrill.setup}</div>`;
          }
          
          // Add instructions if available
          if (fullDrill?.instructions) {
            detailsHtml += '<div class="drill-instructions" style="margin-top: 8px; font-size: 12px; color: #666;">';
            detailsHtml += '<strong>Instructions:</strong>';
            detailsHtml += `<div style="white-space: pre-line; margin-top: 4px;">${fullDrill.instructions}</div>`;
            detailsHtml += '</div>';
          }
          
          // Add notes if available
          if (drill.notes) {
            detailsHtml += `<div class="drill-notes" style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Notes:</strong> ${drill.notes}</div>`;
          }
          
          return detailsHtml;
        })()}
      </div>
    `
    })

    html += `
    </div>
    
    <div class="footer">
      <div><strong>Total Duration:</strong> ${plan.duration} minutes</div>
      <div class="footer-note">Generated with Coaching Beast - The Ultimate Training Planning Tool</div>
    </div>
  </div>
</body>
</html>
  `

    return html
  }

  // Generate MIME formatted email with both HTML and plain text versions
  const generateMIMEEmail = () => {
    if (!plan) return ""

    const boundary = "==CoachingBeast_Boundary_" + Math.random().toString(36).substring(2)
    const subject = `Training Plan: ${plan.name}`
    const plainText = generatePlainText()
    const html = generateHTML()

    const mimeEmail = `MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="${boundary}"
Subject: ${subject}
X-Unsent: 1

--${boundary}
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: quoted-printable

${plainText.replace(/([=])/g, "=$1").replace(/\n/g, "=0A")}

--${boundary}
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: quoted-printable

${html.replace(/([=])/g, "=$1").replace(/\n/g, "=0A")}

--${boundary}--
`

    return mimeEmail
  }

  // Copy HTML to clipboard
  const copyHTMLToClipboard = () => {
    const mimeEmail = generateMIMEEmail()
    navigator.clipboard.writeText(mimeEmail)
    setCopiedHTML(true)
    setTimeout(() => setCopiedHTML(false), 2000)
  }

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle download as text file
  const downloadTextFile = () => {
    const text = generatePlainText()
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${plan?.name.replace(/\s+/g, "-").toLowerCase() || "training-plan"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle download as .eml file
  const downloadEMLFile = () => {
    const mimeEmail = generateMIMEEmail()
    const blob = new Blob([mimeEmail], { type: "message/rfc822" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${plan?.name.replace(/\s+/g, "-").toLowerCase() || "training-plan"}.eml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-white/10 bg-black/80 backdrop-blur-md">
          <div className="container flex h-16 items-center px-4 md:px-6">
            <Link href="/build" className="flex items-center gap-2 text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Builder</span>
            </Link>
          </div>
        </header>
        <main className="container px-4 py-12 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight">Plan Not Found</h1>
            <p className="mt-4 text-lg text-white/70">
              The training plan you're looking for could not be found. Please go back to the builder and try again.
            </p>
            <Link href="/build">
              <Button className="mt-6 bg-white text-black hover:bg-white/90">Return to Builder</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href={`/build?id=${plan.id}`} className="flex items-center gap-2 text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Builder</span>
          </Link>
          <h1 className="text-lg font-semibold">{plan.name}</h1>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Export Training Plan</h1>
            <p className="mt-2 text-white/70">Choose how you want to share or save your training plan</p>
          </div>

          <Tabs defaultValue="graphic-email" className="space-y-8" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-1 bg-gray-900 border border-white/10 rounded-lg">
              <TabsTrigger
                value="graphic-email"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Mail className="h-4 w-4 mr-2" />
                Graphic Email
              </TabsTrigger>
              <TabsTrigger
                value="plain-email"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                Plain Text Email
              </TabsTrigger>
              <TabsTrigger
                value="pdf"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF Save
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                Plain Text Save
              </TabsTrigger>
            </TabsList>

            {/* Graphic Email Option */}
            <TabsContent value="graphic-email" className="space-y-4">
              <Card className="border-white/10 bg-gray-900/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-400" />
                    Graphic Email Format
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Send a visually appealing email with your training plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-white/10 bg-black/50 p-6">
                    <div className="mb-6 space-y-2 text-center">
                      <h2 className="text-2xl font-bold">{plan.name}</h2>
                      <p className="text-white/70">
                        {plan.sport.charAt(0).toUpperCase() + plan.sport.slice(1)} • {plan.duration} minutes
                      </p>
                    </div>

                    <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
                      <h3 className="mb-3 font-semibold text-white">Drill Sequence</h3>
                      <div className="space-y-3">
                        {plan.drills.map((drill, index) => (
                          <div key={drill.id} className="rounded-md bg-white/10 p-3">
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium">
                                  {index + 1}
                                </div>
                                <h4 className="font-medium text-white">{drill.name}</h4>
                              </div>
                              <div className="text-sm font-medium text-blue-400">{drill.duration} min</div>
                            </div>
                            <p className="mt-1 text-sm text-white/80">{drill.description}</p>
                            
                            {/* Find the full drill details */}
                            {(() => {
                              const fullDrill = findDrillById(drill.drillId);
                              if (!fullDrill) return null;
                              
                              return (
                                <div className="mt-3 space-y-2 border-t border-white/10 pt-2">
                                  {/* Basic info grid */}
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {fullDrill.activity_tagging && (
                                      <div className="text-white/70">
                                        <span className="font-medium text-white/90">Activity Tagging:</span> {fullDrill.activity_tagging}
                                      </div>
                                    )}
                                    {fullDrill.skillLevel && (
                                      <div className="text-white/70">
                                        <span className="font-medium text-white/90">Level:</span> {fullDrill.skillLevel}
                                      </div>
                                    )}
                                    {fullDrill.type && (
                                      <div className="text-white/70">
                                        <span className="font-medium text-white/90">Type:</span> {fullDrill.type}
                                      </div>
                                    )}
                                    {fullDrill.players && (
                                      <div className="text-white/70">
                                        <span className="font-medium text-white/90">Players:</span> {fullDrill.players}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Equipment */}
                                  {fullDrill.equipment && fullDrill.equipment.length > 0 && (
                                    <div className="text-xs text-white/70">
                                      <span className="font-medium text-white/90">Equipment:</span> {fullDrill.equipment.join(", ")}
                                    </div>
                                  )}
                                  
                                  {/* Objectives */}
                                  {fullDrill.objectives && fullDrill.objectives.length > 0 && (
                                    <div className="text-xs text-white/70">
                                      <span className="font-medium text-white/90">Objectives:</span>
                                      <ul className="mt-1 list-inside list-disc pl-2">
                                        {fullDrill.objectives.map((objective, i) => (
                                          <li key={i}>{objective}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {/* Setup */}
                                  {fullDrill.setup && (
                                    <div className="text-xs text-white/70">
                                      <span className="font-medium text-white/90">Setup:</span> {fullDrill.setup}
                                    </div>
                                  )}
                                  
                                  {/* Instructions */}
                                  {fullDrill.instructions && (
                                    <div className="text-xs text-white/70">
                                      <span className="font-medium text-white/90">Instructions:</span>
                                      <div className="mt-1 whitespace-pre-line pl-2">{fullDrill.instructions}</div>
                                    </div>
                                  )}
                                  
                                  {/* Notes */}
                                  {drill.notes && (
                                    <div className="text-xs text-white/70">
                                      <span className="font-medium text-white/90">Notes:</span> {drill.notes}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-blue-950/30 p-4 text-sm">
                      <div>
                        <p className="font-medium text-blue-300">Total Duration: {plan.duration} minutes</p>
                        <p className="text-white/70">Created with Coaching Beast</p>
                      </div>
                      <div className="h-10 w-10">
                        <img src="/coaching-beast-icon.svg" alt="Coaching Beast Icon" className="h-10 w-10" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <a href={mailtoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-white/20 bg-gray-200 hover:bg-gray-300 text-black">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Email Client
                    </Button>
                  </a>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={copyHTMLToClipboard}>
                      {copiedHTML ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Email
                        </>
                      )}
                    </Button>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={downloadEMLFile}>
                      <Download className="mr-2 h-4 w-4" />
                      Download .eml
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Plain Text Email Option */}
            <TabsContent value="plain-email" className="space-y-4">
              <Card className="border-white/10 bg-gray-900/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-green-400" />
                    Plain Text Email Format
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Simple text format that works with any email client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-white/10 bg-black/50 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-white/90">{generatePlainText()}</pre>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <a href={mailtoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-white/20 bg-gray-200 hover:bg-gray-300 text-black">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Email Client
                    </Button>
                  </a>
                  <Button
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => copyToClipboard(generatePlainText())}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Text
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* PDF Save Option */}
            <TabsContent value="pdf" className="space-y-4">
              <Card className="border-white/10 bg-gray-900/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-400" />
                    PDF Format
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Download a professional PDF document of your training plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[3/4] rounded-lg border border-white/10 bg-white p-8">
                    <div className="flex h-full flex-col">
                      <div className="mb-8 flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-black">{plan.name}</h2>
                          <p className="text-gray-600">
                            {plan.sport.charAt(0).toUpperCase() + plan.sport.slice(1)} • {plan.duration} minutes
                          </p>
                        </div>
                        <div className="h-10 w-10">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-10 w-10 text-blue-600"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
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
                      </div>

                      <div className="flex-1">
                        <h3 className="mb-4 text-lg font-semibold text-black">Drill Sequence</h3>
                        <div className="space-y-4">
                          {plan.drills.slice(0, 3).map((drill, index) => {
                            // Find the full drill details
                            const fullDrill = findDrillById(drill.drillId);
                            return (
                              <div key={drill.id} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                                <div className="flex justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                                      {index + 1}
                                    </div>
                                    <h4 className="font-medium text-black">{drill.name}</h4>
                                  </div>
                                  <div className="text-sm font-medium text-blue-600">{drill.duration} min</div>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">{drill.description}</p>
                                
                                {/* Additional drill details */}
                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                                  {fullDrill?.activity_tagging && (
                                    <div>
                                      <span className="font-medium">Activity Tagging:</span> {fullDrill.activity_tagging}
                                    </div>
                                  )}
                                  {fullDrill?.skillLevel && (
                                    <div>
                                      <span className="font-medium">Level:</span> {fullDrill.skillLevel}
                                    </div>
                                  )}
                                  {fullDrill?.type && (
                                    <div>
                                      <span className="font-medium">Type:</span> {fullDrill.type}
                                    </div>
                                  )}
                                  {fullDrill?.players && (
                                    <div>
                                      <span className="font-medium">Players:</span> {fullDrill.players}
                                    </div>
                                  )}
                                </div>
                                
                                {fullDrill?.equipment && fullDrill.equipment.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="font-medium">Equipment:</span> {fullDrill.equipment.join(", ")}
                                  </div>
                                )}
                                
                                {fullDrill?.objectives && fullDrill.objectives.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="font-medium">Objectives:</span>
                                    <ul className="list-disc pl-5 mt-1">
                                      {fullDrill.objectives.map((objective, i) => (
                                        <li key={i}>{objective}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {fullDrill?.setup && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="font-medium">Setup:</span>
                                    <p className="mt-1">{fullDrill.setup}</p>
                                  </div>
                                )}
                                
                                {fullDrill?.instructions && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="font-medium">Instructions:</span>
                                    <p className="mt-1 whitespace-pre-line">{fullDrill.instructions}</p>
                                  </div>
                                )}
                                
                                {drill.notes && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="font-medium">Practice Notes:</span>
                                    <p className="mt-1">{drill.notes}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {plan.drills.length > 3 && (
                            <div className="text-center text-gray-400">
                              + {plan.drills.length - 3} more drills (preview only)
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                        <p>
                          <span className="font-medium">Total Duration:</span> {plan.duration} minutes
                        </p>
                        <p className="text-xs text-gray-500">
                          Generated with Coaching Beast - The Ultimate Training Planning Tool
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button className="bg-red-600 text-white hover:bg-red-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Plain Text Save Option */}
            <TabsContent value="text" className="space-y-4">
              <Card className="border-white/10 bg-gray-900/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Plain Text Format
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Download a simple text file of your training plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-white/10 bg-black/50 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-white/90">{generatePlainText()}</pre>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-white/20 bg-gray-200 hover:bg-gray-300 text-black"
                    onClick={() => copyToClipboard(generatePlainText())}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Text
                      </>
                    )}
                  </Button>
                  <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={downloadTextFile}>
                    <Download className="mr-2 h-4 w-4" />
                    Download .txt
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

