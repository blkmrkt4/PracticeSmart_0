import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ClubIcon as Football,
  Timer,
  Library,
  MoveHorizontal,
  Settings,
  FileText,
  ChevronRight,
  Menu,
  PenLine,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <img src="/coaching-beast-icon.svg" alt="Coaching Beast Icon" className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold">Coaching Beast</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/build" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Create a Plan
            </Link>
            <Link href="/activities/new" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              New Activity/Drill
            </Link>
            <Link
              href="/build?view=saved"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              My Plans
            </Link>
            <Link href="/invite" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Invite a Friend
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:inline-flex h-9 items-center justify-center rounded-md border border-white/20 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Log in
            </Link>
            <Link href="/build">
              <Button className="bg-white text-black hover:bg-white/90">Start Free Trial</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(50,50,50,0.2)_0%,rgba(0,0,0,0)_70%)]"></div>
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-l from-green-500/20 to-blue-500/20 blur-3xl"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1 text-sm mb-4 w-fit">
                Coaching Simplified
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Craft Perfect <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                  Practice Plans
                </span>
              </h1>
              <p className="max-w-[600px] text-white/70 md:text-xl">
                Transform your coaching workflow with our intuitive drag-and-drop practice planner. Design efficient
                sessions for any sport, any team, any skill level.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/build">
                  <Button className="bg-white text-black hover:bg-white/90 h-12 px-6">Start Building Plans</Button>
                </Link>
                <Button variant="outline" className="border-white/20 h-12 px-6 hover:bg-white/10 text-white">
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-white/50 pt-2">No credit card required • Free 14-day trial</p>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  width={800}
                  height={600}
                  alt="Coaching Beast interface showing a practice plan builder"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Soccer Practice Plan • 90 minutes • Advanced</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-gradient-to-tr from-green-500/30 to-blue-500/30 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Icons Section */}
      <section id="sports" className="py-12 border-t border-white/10">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tighter">Create Training Plans for any Sport or Activity</h2>
            <p className="mt-2 text-white/70">
              Create training plans for a wide range of sports and training activities
            </p>
          </div>

          {/* Team Sports Row */}
          <div className="mb-10">
            <h3 className="text-center text-lg font-medium text-white/80 mb-6">Individual or Team Sports</h3>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {/* Soccer */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                    <path
                      d="M7 7L10 10M17 7L14 10M7 17L10 14M17 17L14 14"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Soccer</span>
              </div>

              {/* Basketball */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                    <path d="M4.5 4.5C7 7 8.5 12 8.5 12C8.5 12 7 17 4.5 19.5" stroke="white" strokeWidth="1.5" />
                    <path d="M19.5 4.5C17 7 15.5 12 15.5 12C15.5 12 17 17 19.5 19.5" stroke="white" strokeWidth="1.5" />
                    <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />
                    <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Basketball</span>
              </div>

              {/* Volleyball */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                    <path d="M12 2C8 5 7 9 7 12C7 15 8 19 12 22" stroke="white" strokeWidth="1.5" />
                    <path d="M12 2C16 5 17 9 17 12C17 15 16 19 12 22" stroke="white" strokeWidth="1.5" />
                    <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Volleyball</span>
              </div>

              {/* Rugby - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 6C7 6 9 4 12 7C15 10 16 14 16 14"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path d="M16 14L18 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7 6L4 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <ellipse
                      cx="12"
                      cy="12"
                      rx="9"
                      ry="6"
                      transform="rotate(45 12 12)"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Rugby</span>
              </div>

              {/* Football (American) - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="12" cy="12" rx="10" ry="6" stroke="white" strokeWidth="1.5" />
                    <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />
                    <line x1="7" y1="6" x2="17" y2="18" stroke="white" strokeWidth="1.5" />
                    <line x1="17" y1="6" x2="7" y2="18" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Football</span>
              </div>

              {/* Hockey - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 16L10 6L12 10"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 10L16 16"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M4 16H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="18" cy="16" r="2" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Hockey</span>
              </div>

              {/* Handball - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="6" r="2" stroke="white" strokeWidth="1.5" />
                    <path
                      d="M9 8L14 10L16 14L12 16L8 14"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M14 10L18 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Handball</span>
              </div>
            </div>
          </div>

          {/* Individual Sports Row */}
          <div>
            <h3 className="text-center text-lg font-medium text-white/80 mb-6"></h3>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {/* Running - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="5" r="2" stroke="white" strokeWidth="1.5" />
                    <path
                      d="M14 8L11 12L13 16L16 18"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M11 12L7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M13 16L9 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Running</span>
              </div>

              {/* Weight Training */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 7H2C1.44772 7 1 7.44772 1 8V16C1 16.5523 1.44772 17 2 17H6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 7H22C22.5523 7 23 7.44772 23 8V16C23 16.5523 22.5523 17 22 17H18"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6 6V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M18 6V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Weight Training</span>
              </div>

              {/* Triathlon - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 6C4 6 6 4 8 6C10 8 10 10 10 10"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 10C10 10 12 12 14 10C16 8 18 10 18 10"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 10C18 10 20 12 20 14C20 16 18 18 18 18"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="6" cy="4" r="1.5" stroke="white" strokeWidth="1.5" />
                    <circle cx="14" cy="10" r="1.5" stroke="white" strokeWidth="1.5" />
                    <circle cx="18" cy="16" r="1.5" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Triathlon</span>
              </div>

              {/* Swimming - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 16C4 16 8 13 12 13C16 13 20 16 20 16"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 20C4 20 8 17 12 17C16 17 20 20 20 20"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path d="M16 8L12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="18" cy="6" r="2" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Swimming</span>
              </div>

              {/* CrossFit - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="7" r="2" stroke="white" strokeWidth="1.5" />
                    <path
                      d="M8 10L12 14L16 10"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M5 17H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M5 17L7 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M19 17L17 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">CrossFit</span>
              </div>

              {/* Yoga - Updated */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="5" r="2" stroke="white" strokeWidth="1.5" />
                    <path d="M12 7V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path
                      d="M8 20L12 12L16 20"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M8 16H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Yoga</span>
              </div>

              {/* Cycling */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="17" cy="17" r="4" stroke="white" strokeWidth="1.5" />
                    <circle cx="7" cy="17" r="4" stroke="white" strokeWidth="1.5" />
                    <path d="M7 17L11 9H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M11 9L17 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path
                      d="M15 5C16.1046 5 17 4.10457 17 3C17 1.89543 16.1046 1 15 1C13.8954 1 13 1.89543 13 3C13 4.10457 13.8954 5 15 5Z"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80">Cycling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(50,50,50,0.2)_0%,rgba(0,0,0,0)_70%)]"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Streamlined Workflow</h2>
            <p className="mt-4 text-xl text-white/70 max-w-3xl mx-auto">
              Build complete training plans in minutes with our intuitive process
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50 hidden md:block" />

            {/* Timeline steps */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
              {[
                {
                  icon: <Football className="h-6 w-6" />,
                  title: "Select Sport or Activity",
                  description: "Choose from a wide range of sports and activities with specialized libraries",
                },
                {
                  icon: <Timer className="h-6 w-6" />,
                  title: "Choose Duration",
                  description: "Set your training length and automatically divide into optimal segments",
                },
                {
                  icon: <PenLine className="h-6 w-6" />,
                  title: "Create New Activity/Drill",
                  description: "Design custom activities tailored to your team's specific needs",
                },
                {
                  icon: <Library className="h-6 w-6" />,
                  title: "Browse Activity Library",
                  description: "Access hundreds of professionally designed activities for any skill level",
                },
                {
                  icon: <MoveHorizontal className="h-6 w-6" />,
                  title: "Drag into Timeline",
                  description: "Easily arrange activities with our intuitive drag-and-drop interface",
                },
                {
                  icon: <Settings className="h-6 w-6" />,
                  title: "Customize Parameters",
                  description: "Adjust each activity to match your team's size, skill level, and equipment",
                },
                {
                  icon: <FileText className="h-6 w-6" />,
                  title: "Generate Plan",
                  description: "Create printable, shareable training plans for your team and assistants",
                },
              ].map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {/* Circle with icon */}
                  <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black border-2 border-white/20 shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-white/70">{step.description}</p>
                </div>
              ))}
            </div>


          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Core Application Features</h2>
            <p className="mt-4 text-xl text-white/70 max-w-3xl mx-auto">
              Everything you need to create perfect practice plans
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold">Modular Time Segmentation</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Flexible total practice duration from 30 minutes to X hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Adjustable segment lengths to focus on specific skills</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Drag-and-drop segment organization for easy planning</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold">Activity Library</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Sport-specific activity categories organized by skill type</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Searchable and filterable activity database with visual previews</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>User-submitted and professionally curated activities with ratings</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold">Customization Options</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Skill level adaptation for beginners through advanced players</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Team size considerations with automatic scaling options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Equipment availability filters to match your resources</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-24">
                <div className="relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
                  <div className="p-1">
                    <div className="rounded-lg border border-white/10 bg-black/80 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs text-white/50">Soccer Practice Builder</div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded bg-white/5 p-3">
                          <div className="text-sm font-medium mb-2">Practice Duration: 90 minutes</div>
                          <div className="flex gap-1">
                            {[20, 15, 20, 25, 10].map((duration, i) => (
                              <div
                                key={i}
                                className="h-6 rounded flex-1 flex items-center justify-center text-xs font-medium"
                                style={{
                                  backgroundColor: [
                                    "rgba(59, 130, 246, 0.3)",
                                    "rgba(139, 92, 246, 0.3)",
                                    "rgba(16, 185, 129, 0.3)",
                                    "rgba(239, 68, 68, 0.3)",
                                    "rgba(245, 158, 11, 0.3)",
                                  ][i % 5],
                                }}
                              >
                                {duration}m
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Activity Timeline</div>
                          {[
                            { name: "Warm-up Passing", duration: 20, color: "rgba(59, 130, 246, 0.3)" },
                            { name: "Dribbling Skills", duration: 15, color: "rgba(139, 92, 246, 0.3)" },
                            { name: "Small-sided Game", duration: 20, color: "rgba(16, 185, 129, 0.3)" },
                            { name: "Shooting Practice", duration: 25, color: "rgba(239, 68, 68, 0.3)" },
                            { name: "Cool Down", duration: 10, color: "rgba(245, 158, 11, 0.3)" },
                          ].map((drill, i) => (
                            <div
                              key={i}
                              className="rounded p-2 flex justify-between items-center"
                              style={{ backgroundColor: drill.color }}
                            >
                              <span className="text-sm">{drill.name}</span>
                              <span className="text-xs font-medium">{drill.duration}m</span>
                            </div>
                          ))}
                        </div>

                        <div className="rounded bg-white/5 p-3">
                          <div className="text-sm font-medium mb-2">Current Activity: Shooting Practice</div>
                          <div className="space-y-2 text-xs text-white/70">
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span>25 minutes</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Skill Level:</span>
                              <span>Intermediate</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Players:</span>
                              <span>12-16</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Equipment:</span>
                              <span>Balls, Cones, Goals</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-gradient-to-tr from-green-500/20 to-blue-500/20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Template Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(50,50,50,0.2)_0%,rgba(0,0,0,0)_70%)]"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Activity Template Structure</h2>
            <p className="mt-4 text-xl text-white/70 max-w-3xl mx-auto">
              Each activity is carefully structured to provide all the information you need
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Passing Triangle Activity</h3>
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">Soccer</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-white/50">Duration</div>
                    <div className="font-medium">15 minutes</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-white/50">Skill Level</div>
                    <div className="font-medium">Intermediate</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-white/50">Players</div>
                    <div className="font-medium">9-12</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-white/50">Equipment</div>
                    <div className="font-medium">Balls, Cones</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-white/50">Objectives</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Improve passing accuracy</li>
                    <li>Develop movement off the ball</li>
                    <li>Enhance communication</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-white/50">Instructions</div>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Set up three cones in a triangle, 10 yards apart</li>
                    <li>Place three players at each cone</li>
                    <li>Player passes to the next cone and follows their pass</li>
                    <li>Receiver controls the ball and passes to the next cone</li>
                    <li>Continue rotation for specified duration</li>
                  </ol>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-white/50">Modifications</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Add defensive pressure for advanced groups</li>
                    <li>Reduce distance for beginners</li>
                    <li>Limit touches to increase difficulty</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">Benefits of Structured Templates</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Consistent format across all sports and activity types</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Easy to customize and adapt to your team's needs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Printable format with clear instructions for assistants</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Coaching?
              </h2>
              <p className="text-xl text-white/70">
                Join thousands of coaches who are saving time and improving their sessions
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/build">
                  <Button className="bg-white text-black hover:bg-white/90 h-12 px-6">Start Free Trial</Button>
                </Link>
                <Button variant="outline" className="border-white/20 h-12 px-6 hover:bg-white/10 text-white">
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-white/50">No credit card required • Free 14-day trial • Cancel anytime</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                      <path
                        d="M12 6V12L16 14"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Save Time</h3>
                    <p className="text-white/70">Create practice plans in minutes, not hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7.5 12L10.5 15L16.5 9"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Improve Quality</h3>
                    <p className="text-white/70">Access professionally designed activities and templates</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L12 12L16 10M16 10L20 10L20 20L16 20M16 10V20M16 20L12 18L8 20"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path d="M12 4L14 6L12 8L10 6L12 4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Stay Organized</h3>
                    <p className="text-white/70">Keep all your practice plans in one place</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <path d="M3 12H8M16 12H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M12 3V8M12 16V21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Customize Everything</h3>
                    <p className="text-white/70">Adapt activities to your team's specific needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 text-white"
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
                <span className="text-xl font-bold">Coaching Beast</span>
              </div>
              <p className="text-sm text-white/70">
                The ultimate practice planning tool for coaches of all sports and levels.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Sports
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/70 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-white/50">&copy; {new Date().getFullYear()} Coaching Beast. All rights reserved.</p>
            <p className="text-xs text-white/50 mt-2 md:mt-0">Designed for coaches, by coaches</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

