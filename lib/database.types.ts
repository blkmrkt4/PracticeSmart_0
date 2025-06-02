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
      teams: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          created_at?: string
        }
      }
      pending_invitations: {
        Row: {
          id: string
          team_id: string
          email: string
          created_at: string
          expires_at: string
          invitation_token: string
        }
        Insert: {
          id?: string
          team_id: string
          email: string
          created_at?: string
          expires_at?: string
          invitation_token?: string
        }
        Update: {
          id?: string
          team_id?: string
          email?: string
          created_at?: string
          expires_at?: string
          invitation_token?: string
        }
      }
      drills: {
        Row: {
          id: string
          created_at: string
          title: string
          sport: string
          activity_tagging: string
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
          type: 'Drills' | 'Scrimmage' | 'Conditioning' | 'Stretching' | 'Instructions' | 'Weights' | 'Plyometrics' | 'Hand-Eye' | 'Footwork' | 'Cooldown' | 'Meditation'
          objectives: string[]
          variations: string | null
          tips: string | null
          is_custom: boolean
          privacy_level: 'private' | 'team' | 'public'
          team_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          sport: string
          activity_tagging: string
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
          privacy_level?: 'private' | 'team' | 'public'
          team_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          sport?: string
          activity_tagging?: string
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
          privacy_level?: 'private' | 'team' | 'public'
          team_id?: string | null
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
          privacy_level: 'private' | 'team' | 'public'
          team_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          user_id: string
          sport: string
          duration: number
          privacy_level: 'private' | 'team' | 'public'
          team_id: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          user_id?: string
          sport?: string
          duration?: number
          privacy_level?: 'private' | 'team' | 'public'
          team_id?: string | null
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
