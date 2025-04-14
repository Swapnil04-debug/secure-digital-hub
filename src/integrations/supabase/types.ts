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
      accounts: {
        Row: {
          account_id: string
          account_type: string | null
          balance: number | null
          opening_date: string | null
        }
        Insert: {
          account_id?: string
          account_type?: string | null
          balance?: number | null
          opening_date?: string | null
        }
        Update: {
          account_id?: string
          account_type?: string | null
          balance?: number | null
          opening_date?: string | null
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string | null
          branch_id: string
          branch_name: string
          city: string | null
          contact_no: string | null
          manager: string | null
        }
        Insert: {
          address?: string | null
          branch_id?: string
          branch_name: string
          city?: string | null
          contact_no?: string | null
          manager?: string | null
        }
        Update: {
          address?: string | null
          branch_id?: string
          branch_name?: string
          city?: string | null
          contact_no?: string | null
          manager?: string | null
        }
        Relationships: []
      }
      customer_account: {
        Row: {
          account_id: string
          branch_id: string | null
          cust_id: string
        }
        Insert: {
          account_id?: string
          branch_id?: string | null
          cust_id?: string
        }
        Update: {
          account_id?: string
          branch_id?: string | null
          cust_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_account_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "customer_account_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "customer_account_cust_id_fkey"
            columns: ["cust_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["cust_id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          contact_no: string | null
          cust_id: string
          name: string
        }
        Insert: {
          address?: string | null
          contact_no?: string | null
          cust_id?: string
          name: string
        }
        Update: {
          address?: string | null
          contact_no?: string | null
          cust_id?: string
          name?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          branch_id: string
          contact_no: string | null
          dept_id: string
          dept_name: string | null
        }
        Insert: {
          branch_id?: string
          contact_no?: string | null
          dept_id?: string
          dept_name?: string | null
        }
        Update: {
          branch_id?: string
          contact_no?: string | null
          dept_id?: string
          dept_name?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          contact_no: string | null
          designation: string | null
          emp_id: string
          name: string
          salary: number | null
        }
        Insert: {
          address?: string | null
          contact_no?: string | null
          designation?: string | null
          emp_id?: string
          name: string
          salary?: number | null
        }
        Update: {
          address?: string | null
          contact_no?: string | null
          designation?: string | null
          emp_id?: string
          name?: string
          salary?: number | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
