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
          category: string
          skill_level: string
          type: string
          players: number
          equipment: string[]
          objectives: string
          setup: string
          instructions: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          category: string
          skill_level: string
          type: string
          players: number
          equipment: string[]
          objectives: string
          setup: string
          instructions: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          category?: string
          skill_level?: string
          type?: string
          players?: number
          equipment?: string[]
          objectives?: string
          setup?: string
          instructions?: string
          user_id?: string
        }
      }
      training_plans: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          user_id?: string
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
