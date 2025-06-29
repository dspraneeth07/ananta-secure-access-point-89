export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      case_history: {
        Row: {
          action: string
          case_id: string | null
          created_at: string
          description: string | null
          id: string
          updated_by: string | null
        }
        Insert: {
          action: string
          case_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          updated_by?: string | null
        }
        Update: {
          action?: string
          case_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_history_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_history_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          aadhar_number: string | null
          accused_photo_url: string | null
          address: string | null
          age: number | null
          area_of_operation: string | null
          case_description: string | null
          case_id: string
          countries_visited: string | null
          country: string | null
          created_at: string
          district: string | null
          driving_license: string | null
          drug_category: Database["public"]["Enums"]["drug_category"] | null
          drug_type: string | null
          education: string | null
          father_name: string | null
          fir_generated_at: string | null
          fir_number: string | null
          gender: string | null
          id: string
          imei: string | null
          languages_known: string | null
          name: string
          occupation: string | null
          passport_number: string | null
          phone_number: string | null
          police_station: string | null
          registered_by: string | null
          social_media_platforms: Json | null
          state: string | null
          station_code: Database["public"]["Enums"]["station_code"]
          status: Database["public"]["Enums"]["case_status"] | null
          submitted_at: string | null
          updated_at: string
          voter_id: string | null
        }
        Insert: {
          aadhar_number?: string | null
          accused_photo_url?: string | null
          address?: string | null
          age?: number | null
          area_of_operation?: string | null
          case_description?: string | null
          case_id: string
          countries_visited?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          driving_license?: string | null
          drug_category?: Database["public"]["Enums"]["drug_category"] | null
          drug_type?: string | null
          education?: string | null
          father_name?: string | null
          fir_generated_at?: string | null
          fir_number?: string | null
          gender?: string | null
          id?: string
          imei?: string | null
          languages_known?: string | null
          name: string
          occupation?: string | null
          passport_number?: string | null
          phone_number?: string | null
          police_station?: string | null
          registered_by?: string | null
          social_media_platforms?: Json | null
          state?: string | null
          station_code: Database["public"]["Enums"]["station_code"]
          status?: Database["public"]["Enums"]["case_status"] | null
          submitted_at?: string | null
          updated_at?: string
          voter_id?: string | null
        }
        Update: {
          aadhar_number?: string | null
          accused_photo_url?: string | null
          address?: string | null
          age?: number | null
          area_of_operation?: string | null
          case_description?: string | null
          case_id?: string
          countries_visited?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          driving_license?: string | null
          drug_category?: Database["public"]["Enums"]["drug_category"] | null
          drug_type?: string | null
          education?: string | null
          father_name?: string | null
          fir_generated_at?: string | null
          fir_number?: string | null
          gender?: string | null
          id?: string
          imei?: string | null
          languages_known?: string | null
          name?: string
          occupation?: string | null
          passport_number?: string | null
          phone_number?: string | null
          police_station?: string | null
          registered_by?: string | null
          social_media_platforms?: Json | null
          state?: string | null
          station_code?: Database["public"]["Enums"]["station_code"]
          status?: Database["public"]["Enums"]["case_status"] | null
          submitted_at?: string | null
          updated_at?: string
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_registered_by_fkey"
            columns: ["registered_by"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          password: string
          station_code: Database["public"]["Enums"]["station_code"] | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          username: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          password: string
          station_code?: Database["public"]["Enums"]["station_code"] | null
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
          username: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          password?: string
          station_code?: Database["public"]["Enums"]["station_code"] | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          username?: string
        }
        Relationships: []
      }
      criminal_case_associations: {
        Row: {
          case_id: string | null
          created_at: string
          criminal_profile_id: string | null
          id: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          criminal_profile_id?: string | null
          id?: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          criminal_profile_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "criminal_case_associations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criminal_case_associations_criminal_profile_id_fkey"
            columns: ["criminal_profile_id"]
            isOneToOne: false
            referencedRelation: "criminal_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      criminal_profiles: {
        Row: {
          aadhar_number: string | null
          address: string | null
          age: number | null
          created_at: string
          father_name: string | null
          id: string
          name: string
          phone_number: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          age?: number | null
          created_at?: string
          father_name?: string | null
          id?: string
          name: string
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          age?: number | null
          created_at?: string
          father_name?: string | null
          id?: string
          name?: string
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fir_documents: {
        Row: {
          case_id: string | null
          content: string
          fir_number: string
          generated_at: string
          generated_by: string | null
          id: string
          is_submitted: boolean | null
          submitted_at: string | null
        }
        Insert: {
          case_id?: string | null
          content: string
          fir_number: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          is_submitted?: boolean | null
          submitted_at?: string | null
        }
        Update: {
          case_id?: string | null
          content?: string
          fir_number?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          is_submitted?: boolean | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fir_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fir_documents_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          session_token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          session_token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          session_token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_case_id: {
        Args: { station_code: string }
        Returns: string
      }
      generate_fir_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_credentials: {
        Args: { user_id: string }
        Returns: {
          station_code: string
          user_type: string
        }[]
      }
    }
    Enums: {
      case_status:
        | "draft"
        | "registered"
        | "fir_generated"
        | "submitted"
        | "under_investigation"
        | "closed"
      drug_category:
        | "cannabis"
        | "cocaine"
        | "heroin"
        | "mdma"
        | "methamphetamine"
        | "opium"
        | "synthetic"
        | "other"
      station_code: "wnptps" | "nrptps" | "mbnrps"
      user_type: "headquarters" | "police_station"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      case_status: [
        "draft",
        "registered",
        "fir_generated",
        "submitted",
        "under_investigation",
        "closed",
      ],
      drug_category: [
        "cannabis",
        "cocaine",
        "heroin",
        "mdma",
        "methamphetamine",
        "opium",
        "synthetic",
        "other",
      ],
      station_code: ["wnptps", "nrptps", "mbnrps"],
      user_type: ["headquarters", "police_station"],
    },
  },
} as const
