// AUTO-GENERATED from the Supabase schema. Do not edit by hand.
// Regenerate after every migration (see docs/ARCHITECTURE.md).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string
          equipment: string
          id: string
          instructions: string
          level: string
          location: string
          muscle_group: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          equipment: string
          id?: string
          instructions: string
          level: string
          location: string
          muscle_group: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          equipment?: string
          id?: string
          instructions?: string
          level?: string
          location?: string
          muscle_group?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      meal_logs: {
        Row: {
          calories: number
          carbs_g: number
          created_at: string
          fat_g: number
          id: string
          logged_on: string
          meal_type: string
          name: string
          portion: string | null
          protein_g: number
          user_id: string
        }
        Insert: {
          calories: number
          carbs_g?: number
          created_at?: string
          fat_g?: number
          id?: string
          logged_on?: string
          meal_type: string
          name: string
          portion?: string | null
          protein_g?: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs_g?: number
          created_at?: string
          fat_g?: number
          id?: string
          logged_on?: string
          meal_type?: string
          name?: string
          portion?: string | null
          protein_g?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          goal_weight_kg: number | null
          id: string
          onboarding_completed: boolean
          updated_at: string
          water_goal_ml: number
          calorie_goal: number
          step_goal: number
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          goal_weight_kg?: number | null
          id: string
          onboarding_completed?: boolean
          updated_at?: string
          water_goal_ml?: number
          calorie_goal?: number
          step_goal?: number
        }
        Update: {
          created_at?: string
          display_name?: string | null
          goal_weight_kg?: number | null
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          water_goal_ml?: number
          calorie_goal?: number
          step_goal?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          notifications_enabled: boolean
          unit_system: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          notifications_enabled?: boolean
          unit_system?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          notifications_enabled?: boolean
          unit_system?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      water_logs: {
        Row: {
          amount_ml: number
          created_at: string
          id: string
          logged_at: string
          user_id: string
        }
        Insert: {
          amount_ml: number
          created_at?: string
          id?: string
          logged_at?: string
          user_id: string
        }
        Update: {
          amount_ml?: number
          created_at?: string
          id?: string
          logged_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weight_logs: {
        Row: {
          created_at: string
          id: string
          logged_on: string
          updated_at: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          logged_on?: string
          updated_at?: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: string
          logged_on?: string
          updated_at?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      workout_plan_exercises: {
        Row: {
          duration_seconds: number | null
          exercise_id: string
          id: string
          plan_id: string
          position: number
          reps: number | null
          rest_seconds: number
          sets: number
        }
        Insert: {
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          plan_id: string
          position: number
          reps?: number | null
          rest_seconds: number
          sets: number
        }
        Update: {
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          plan_id?: string
          position?: number
          reps?: number | null
          rest_seconds?: number
          sets?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_plan_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plan_exercises_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string
          description: string
          estimated_minutes: number
          id: string
          level: string
          location: string
          muscle_group: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description: string
          estimated_minutes: number
          id?: string
          level: string
          location: string
          muscle_group: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_minutes?: number
          id?: string
          level?: string
          location?: string
          muscle_group?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      workout_session_exercises: {
        Row: {
          completed_at: string | null
          duration_seconds: number | null
          exercise_id: string
          id: string
          position: number
          reps: number | null
          rest_seconds: number
          session_id: string
          sets: number
        }
        Insert: {
          completed_at?: string | null
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          position: number
          reps?: number | null
          rest_seconds: number
          session_id: string
          sets: number
        }
        Update: {
          completed_at?: string | null
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          position?: number
          reps?: number | null
          rest_seconds?: number
          session_id?: string
          sets?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_session_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_session_exercises_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          plan_id: string | null
          plan_name: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          plan_id?: string | null
          plan_name: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          plan_id?: string | null
          plan_name?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      start_workout_session: { Args: { p_plan_id: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
