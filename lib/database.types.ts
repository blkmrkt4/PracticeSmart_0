export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      drills: {
        Row: {
          id: string
          created_at: string
          title: string
          sport: string
          focus_area: string
          description: string
          video_url: string
          image_url: string
          setup_instructions: string
          coaching_points: string
          duration: number
          equipment: string[]
          participants: string
          user_id: string
          skill_level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced'
          category: string
          type: 'Drills' | 'Scrimmage' | 'Conditioning' | 'Stretching' | 'Instructions' | 'Weights' | 'Plyometrics' | 'Hand-Eye' | 'Footwork' | 'Cooldown' | 'Meditation'
          objectives: string[]
          variations: string | null
          tips: string | null
          is_custom: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          sport: string
          focus_area: string
          description: string
          video_url: string
          image_url: string
          setup_instructions: string
          coaching_points: string
          duration: number
          equipment: string[]
          participants: string
          user_id: string
          skill_level?: 'all' | 'beginner' | 'intermediate' | 'advanced'
          category?: string
          type?: 'Drills' | 'Scrimmage' | 'Conditioning' | 'Stretching' | 'Instructions' | 'Weights' | 'Plyometrics' | 'Hand-Eye' | 'Footwork' | 'Cooldown' | 'Meditation'
          objectives?: string[]
          variations?: string
          tips?: string
          is_custom?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          sport?: string
          focus_area?: string
          description?: string
          video_url?: string
          image_url?: string
          setup_instructions?: string
          coaching_points?: string
          duration?: number
          equipment?: string[]
          participants?: string
          user_id?: string
          skill_level?: 'all' | 'beginner' | 'intermediate' | 'advanced'
          category?: string
          type?: 'Drills' | 'Scrimmage' | 'Conditioning' | 'Stretching' | 'Instructions' | 'Weights' | 'Plyometrics' | 'Hand-Eye' | 'Footwork' | 'Cooldown' | 'Meditation'
          objectives?: string[]
          variations?: string
          tips?: string
          is_custom?: boolean
        }
      }
      training_plans: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          user_id: string
          sport: string
          duration: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          user_id: string
          sport: string
          duration: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          user_id?: string
          sport?: string
          duration?: number
        }
      }
      training_plan_items: {
        Row: {
          id: string
          training_plan_id: string
          drill_id: string
          position: number
          duration: number
        }
        Insert: {
          id?: string
          training_plan_id: string
          drill_id: string
          position: number
          duration: number
        }
        Update: {
          id?: string
          training_plan_id?: string
          drill_id?: string
          position?: number
          duration?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
