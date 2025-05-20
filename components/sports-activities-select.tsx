"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { sportsActivitiesStructure, SportActivity, SportActivityCategory } from "@/lib/sports-activities"

interface SportsActivitiesSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  availableSports?: string[] // Optional array of sport values that should be shown
}

export function SportsActivitiesSelect({
  value,
  onValueChange,
  placeholder = "Select a sport or activity",
  availableSports,
}: SportsActivitiesSelectProps) {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Find the selected activity
  const findSelectedActivity = (): { category: SportActivityCategory; activity: SportActivity } | null => {
    for (const category of sportsActivitiesStructure) {
      const activity = category.activities.find(a => a.value === value)
      if (activity) {
        return { category, activity }
      }
    }
    return null
  }

  const selectedInfo = findSelectedActivity()
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {value ? (
            <>
              <span className="text-white">{selectedInfo?.activity.name}</span>
              <span className="ml-2 text-xs text-white/60">{selectedInfo?.category.name}</span>
            </>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-gray-900 border-white/20 text-white">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search sports and activities..." className="bg-transparent text-white" />
          <CommandEmpty>No sport or activity found.</CommandEmpty>
          <CommandList className="max-h-[300px]">
            {selectedCategory ? (
              <>
                <div className="p-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-white/70 hover:text-white"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                    Back to categories
                  </Button>
                </div>
                <CommandGroup heading={selectedCategory}>
                  {sportsActivitiesStructure
                    .find(category => category.name === selectedCategory)?.activities
                    .filter(activity => !availableSports || availableSports.includes(activity.value))
                    .map(activity => (
                      <CommandItem
                        key={activity.value}
                        value={activity.value}
                        onSelect={(currentValue) => {
                          onValueChange(currentValue)
                          setOpen(false)
                        }}
                        className="text-white hover:bg-white/10"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === activity.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {activity.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            ) : (
              <>
                <CommandGroup heading="Special Options">
                  <CommandItem
                    value="all"
                    onSelect={(currentValue) => {
                      onValueChange(currentValue)
                      setOpen(false)
                    }}
                    className="text-white hover:bg-white/10"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All Sports & Activities
                  </CommandItem>
                </CommandGroup>
                
                {sportsActivitiesStructure
                  .map(category => {
                    // If availableSports is provided, filter activities to only those in the list
                    const filteredActivities = availableSports
                      ? category.activities.filter(activity => availableSports.includes(activity.value))
                      : category.activities;
                      
                    // Only show categories that have at least one available activity
                    return filteredActivities.length > 0 
                      ? { ...category, activities: filteredActivities }
                      : null;
                  })
                  .filter((category): category is SportActivityCategory => category !== null) // Remove null categories with type guard
                  .map(category => (
                    <CommandGroup key={category.name} heading={category.name}>
                      <CommandItem 
                        onSelect={() => setSelectedCategory(category.name)}
                        className="text-white hover:bg-white/10"
                      >
                        <span className="flex-1">{category.name}</span>
                        <ChevronRight className="h-4 w-4" />
                      </CommandItem>
                    </CommandGroup>
                  ))
                }
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
