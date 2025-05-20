// Sports and Activities Categorization for Coaching Beast

export interface SportActivity {
  name: string;
  value: string;
}

export interface SportActivityCategory {
  name: string;
  activities: SportActivity[];
}

export const sportsActivitiesStructure: SportActivityCategory[] = [
  {
    name: "Team Sports",
    activities: [
      { name: "Soccer/Football", value: "soccer-football" },
      { name: "Basketball", value: "basketball" },
      { name: "Volleyball", value: "volleyball" },
      { name: "Baseball/Softball", value: "baseball-softball" },
      { name: "Hockey (Ice)", value: "hockey-ice" },
      { name: "Hockey (Field)", value: "hockey-field" },
      { name: "Rugby", value: "rugby" },
      { name: "American Football", value: "american-football" },
      { name: "Cricket", value: "cricket" },
      { name: "Lacrosse", value: "lacrosse" },
      { name: "Handball", value: "handball" },
      { name: "Water Polo", value: "water-polo" },
      { name: "Ultimate Frisbee", value: "ultimate-frisbee" },
      { name: "Netball", value: "netball" },
      { name: "Other Team Sport", value: "other-team-sport" }
    ]
  },
  {
    name: "Individual Sports",
    activities: [
      { name: "Tennis", value: "tennis" },
      { name: "Golf", value: "golf" },
      { name: "Swimming", value: "swimming" },
      { name: "Track and Field", value: "track-field" },
      { name: "Gymnastics", value: "gymnastics" },
      { name: "Martial Arts", value: "martial-arts" },
      { name: "Boxing", value: "boxing" },
      { name: "Wrestling", value: "wrestling" },
      { name: "Figure Skating", value: "figure-skating" },
      { name: "Diving", value: "diving" },
      { name: "Cycling", value: "cycling" },
      { name: "Skiing/Snowboarding", value: "skiing-snowboarding" },
      { name: "Surfing", value: "surfing" },
      { name: "Skateboarding", value: "skateboarding" },
      { name: "Rowing/Kayaking", value: "rowing-kayaking" },
      { name: "Archery", value: "archery" },
      { name: "Fencing", value: "fencing" },
      { name: "Triathlon", value: "triathlon" },
      { name: "Other Individual Sport", value: "other-individual-sport" }
    ]
  },
  {
    name: "Fitness Activities",
    activities: [
      { name: "CrossFit", value: "crossfit" },
      { name: "Weightlifting/Powerlifting", value: "weightlifting" },
      { name: "Yoga", value: "yoga" },
      { name: "Pilates", value: "pilates" },
      { name: "HIIT", value: "hiit" },
      { name: "Running/Jogging", value: "running" },
      { name: "Dance", value: "dance" },
      { name: "Aerobics", value: "aerobics" },
      { name: "Calisthenics", value: "calisthenics" },
      { name: "Personal Training", value: "personal-training" },
      { name: "Other Fitness Activity", value: "other-fitness" }
    ]
  },
  {
    name: "Outdoor Recreation",
    activities: [
      { name: "Rock Climbing", value: "rock-climbing" },
      { name: "Parkour", value: "parkour" },
      { name: "Hiking/Backpacking", value: "hiking" },
      { name: "Sailing", value: "sailing" },
      { name: "Windsurfing", value: "windsurfing" },
      { name: "Kayaking", value: "kayaking" },
      { name: "Mountain Biking", value: "mountain-biking" },
      { name: "Disc Golf", value: "disc-golf" },
      { name: "Orienteering", value: "orienteering" },
      { name: "Other Outdoor Activity", value: "other-outdoor" }
    ]
  },
  {
    name: "Equestrian",
    activities: [
      { name: "Horseback Riding", value: "horseback-riding" },
      { name: "Dressage", value: "dressage" },
      { name: "Show Jumping", value: "show-jumping" },
      { name: "Eventing", value: "eventing" },
      { name: "Other Equestrian", value: "other-equestrian" }
    ]
  },
  {
    name: "Mind Sports",
    activities: [
      { name: "Chess", value: "chess" },
      { name: "Poker", value: "poker" },
      { name: "Debate", value: "debate" },
      { name: "Quiz Competitions", value: "quiz" },
      { name: "E-Sports/Competitive Gaming", value: "esports" },
      { name: "Other Mind Sport", value: "other-mind-sport" }
    ]
  },
  {
    name: "Group Activities",
    activities: [
      { name: "Boot Camps", value: "boot-camps" },
      { name: "Spin Classes", value: "spin-classes" },
      { name: "Group Fitness", value: "group-fitness" },
      { name: "Team Building", value: "team-building" },
      { name: "Cheerleading", value: "cheerleading" },
      { name: "Other Group Activity", value: "other-group" }
    ]
  }
];

// Helper function to get all activities as a flat array
export const getAllActivities = (): SportActivity[] => {
  return sportsActivitiesStructure.flatMap(category => category.activities);
};

// Helper function to find a category by activity value
export const getCategoryByActivityValue = (value: string): string | undefined => {
  for (const category of sportsActivitiesStructure) {
    if (category.activities.some(activity => activity.value === value)) {
      return category.name;
    }
  }
  return undefined;
};
