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
          activity_tagging: string | null
          description: string
          video_url: string | null
          image_url: string | null
          setup_instructions: string | null
          coaching_points: string | null
          duration: number
          equipment: string[] | null
          participants: number | null
          user_id: string
          skill_level: string
          objectives: string[] | null
          variations: string | null
          tips: string | null
          is_custom: boolean
          updated_at: string | null
          owner_id: string | null
          privacy_level: 'private' | 'team' | 'public' | null
          team_id: string | null
          copied_from: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          sport: string
          activity_tagging?: string | null
          description: string
          video_url?: string | null
          image_url?: string | null
          setup_instructions?: string | null
          coaching_points?: string | null
          duration: number
          equipment?: string[] | null
          participants?: number | null
          user_id: string
          skill_level: string
          objectives?: string[] | null
          variations?: string | null
          tips?: string | null
          is_custom?: boolean
          updated_at?: string | null
          owner_id?: string | null
          privacy_level?: 'private' | 'team' | 'public' | null
          team_id?: string | null
          copied_from?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          sport?: string
          activity_tagging?: string | null
          description?: string
          video_url?: string | null
          image_url?: string | null
          setup_instructions?: string | null
          coaching_points?: string | null
          duration?: number
          equipment?: string[] | null
          participants?: number | null
          user_id?: string
          skill_level?: string
          objectives?: string[] | null
          variations?: string | null
          tips?: string | null
          is_custom?: boolean
          updated_at?: string | null
          owner_id?: string | null
          privacy_level?: 'private' | 'team' | 'public' | null
          team_id?: string | null
          copied_from?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drills_copied_from_fkey"
            columns: ["copied_from"]
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drills_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drills_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      team_drill_access: {
        Row: {
          id: string
          team_id: string
          drill_id: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          drill_id: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          drill_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_drill_access_drill_id_fkey"
            columns: ["drill_id"]
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_drill_access_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_training_plan_access: {
        Row: {
          id: string
          team_id: string
          training_plan_id: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          training_plan_id: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          training_plan_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_training_plan_access_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_training_plan_access_training_plan_id_fkey"
            columns: ["training_plan_id"]
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string | null
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string | null
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string | null
          created_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      training_plan_items: {
        Row: {
          id: string
          training_plan_id: string
          drill_id: string
          position: number
          created_at: string
          updated_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          training_plan_id: string
          drill_id: string
          position: number
          created_at?: string
          updated_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          training_plan_id?: string
          drill_id?: string
          position?: number
          created_at?: string
          updated_at?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_plan_items_drill_id_fkey"
            columns: ["drill_id"]
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plan_items_training_plan_id_fkey"
            columns: ["training_plan_id"]
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      training_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string | null
          owner_id: string | null
          privacy_level: 'private' | 'team' | 'public' | null
          team_id: string | null
          copied_from: string | null
          duration: number | null
          sport: string | null
          skill_level: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string | null
          owner_id?: string | null
          privacy_level?: 'private' | 'team' | 'public' | null
          team_id?: string | null
          copied_from?: string | null
          duration?: number | null
          sport?: string | null
          skill_level?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string | null
          owner_id?: string | null
          privacy_level?: 'private' | 'team' | 'public' | null
          team_id?: string | null
          copied_from?: string | null
          duration?: number | null
          sport?: string | null
          skill_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_plans_copied_from_fkey"
            columns: ["copied_from"]
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string | null
          is_subscribed: boolean | null
          name: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string | null
          is_subscribed?: boolean | null
          name?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string | null
          is_subscribed?: boolean | null
          name?: string | null
        }
        Relationships: []
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
          invitation_token: string
        }
        Update: {
          id?: string
          team_id?: string
          email?: string
          created_at?: string
          expires_at?: string
          invitation_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_invitations_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      privacy_level: 'private' | 'team' | 'public'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
