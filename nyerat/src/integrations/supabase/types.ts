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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          block_id: string | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          page_id: string
          parent_id: string | null
          resolved: boolean | null
          updated_at: string | null
        }
        Insert: {
          block_id?: string | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          page_id: string
          parent_id?: string | null
          resolved?: boolean | null
          updated_at?: string | null
        }
        Update: {
          block_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          page_id?: string
          parent_id?: string | null
          resolved?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      database_properties: {
        Row: {
          config: Json
          created_at: string | null
          database_id: string
          id: string
          is_primary: boolean
          name: string
          sort_order: number
          type: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          database_id: string
          id?: string
          is_primary?: boolean
          name: string
          sort_order?: number
          type: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          database_id?: string
          id?: string
          is_primary?: boolean
          name?: string
          sort_order?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "database_properties_database_id_fkey"
            columns: ["database_id"]
            isOneToOne: false
            referencedRelation: "databases"
            referencedColumns: ["id"]
          },
        ]
      }
      database_views: {
        Row: {
          config: Json
          created_at: string | null
          database_id: string
          id: string
          name: string
          sort_order: number
          type: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          database_id: string
          id?: string
          name?: string
          sort_order?: number
          type: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          database_id?: string
          id?: string
          name?: string
          sort_order?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "database_views_database_id_fkey"
            columns: ["database_id"]
            isOneToOne: false
            referencedRelation: "databases"
            referencedColumns: ["id"]
          },
        ]
      }
      databases: {
        Row: {
          created_at: string | null
          id: string
          page_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "databases_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          page_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          page_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      notebooks: {
        Row: {
          created_at: string | null
          created_by: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          sort_order: number
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notebooks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string | null
          id: string
          is_read: boolean
          link: string | null
          message: string
          page_id: string | null
          type: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          page_id?: string | null
          type: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          page_id?: string | null
          type?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: []
      }
      page_shares: {
        Row: {
          allow_comments: boolean | null
          created_at: string | null
          id: string
          is_public: boolean | null
          page_id: string
          share_token: string | null
        }
        Insert: {
          allow_comments?: boolean | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          page_id: string
          share_token?: string | null
        }
        Update: {
          allow_comments?: boolean | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          page_id?: string
          share_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_shares_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_tags: {
        Row: {
          page_id: string
          tag_id: string
        }
        Insert: {
          page_id: string
          tag_id: string
        }
        Update: {
          page_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_tags_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      page_versions: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string | null
          id: string
          label: string | null
          page_id: string
          title: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          label?: string | null
          page_id: string
          title?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          label?: string | null
          page_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: Json | null
          cover_position: number | null
          cover_url: string | null
          created_at: string | null
          created_by: string | null
          icon: string | null
          id: string
          is_archived: boolean | null
          is_pinned: boolean | null
          notebook_id: string | null
          parent_id: string | null
          reminder_at: string | null
          search_vector: unknown
          sort_order: number | null
          title: string
          type: string | null
          updated_at: string | null
          updated_by: string | null
          workspace_id: string
        }
        Insert: {
          content?: Json | null
          cover_position?: number | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean | null
          is_pinned?: boolean | null
          notebook_id?: string | null
          parent_id?: string | null
          reminder_at?: string | null
          search_vector?: unknown
          sort_order?: number | null
          title?: string
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          workspace_id: string
        }
        Update: {
          content?: Json | null
          cover_position?: number | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean | null
          is_pinned?: boolean | null
          notebook_id?: string | null
          parent_id?: string | null
          reminder_at?: string | null
          search_vector?: unknown
          sort_order?: number | null
          title?: string
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      prd_sessions: {
        Row: {
          created_at: string
          generated_prd: string | null
          id: string
          messages: Json
          title: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          generated_prd?: string | null
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          generated_prd?: string | null
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prd_sessions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          preferred_theme: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          preferred_theme?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          preferred_theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_values: {
        Row: {
          page_id: string
          property_id: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          page_id: string
          property_id: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          page_id?: string
          property_id?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "property_values_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_values_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "database_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string | null
          id: string
          is_done: boolean
          page_id: string
          remind_at: string
          repeat_interval: string | null
          title: string
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_done?: boolean
          page_id: string
          remind_at: string
          repeat_interval?: string | null
          title?: string
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_done?: boolean
          page_id?: string
          remind_at?: string
          repeat_interval?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          workspace_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          workspace_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_builtin: boolean
          name: string
          snapshot_data: Json
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_builtin?: boolean
          name: string
          snapshot_data?: Json
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_builtin?: boolean
          name?: string
          snapshot_data?: Json
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          owner_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          owner_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          owner_id?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      database_workspace_id: { Args: { _db: string }; Returns: string }
      is_workspace_admin: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      pages_content_text: { Args: { c: Json }; Returns: string }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
