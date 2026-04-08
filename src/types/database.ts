// =============================================
// Database Types for Property Management App
// =============================================

export type UserRole = 'landlord' | 'tenant' | 'maintenance_staff';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: string;
  landlord_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  pin_number: string | null;
  building_type: '3-flat' | 'apartment' | 'other';
  year_built: number | null;
  total_units: number;
  exterior_brick_color: string | null;
  roof_type: string | null;
  roof_age_years: number | null;
  boiler_make: string | null;
  boiler_model: string | null;
  boiler_serial: string | null;
  boiler_install_date: string | null;
  hvac_filter_size: string | null;
  paint_code_interior: string | null;
  paint_code_exterior: string | null;
  notes: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface RoomSpec {
  name: string;
  dimensions: string;
  appliances: ApplianceSpec[];
}

export interface ApplianceSpec {
  name: string;
  make: string;
  model: string;
}

export interface UnitTemplate {
  id: string;
  landlord_id: string;
  name: string;
  description: string | null;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  rooms: RoomSpec[];
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  building_id: string;
  template_id: string | null;
  unit_number: string;
  floor: number | null;
  tenant_id: string | null;
  rent_amount: number | null;
  lease_start: string | null;
  lease_end: string | null;
  is_occupied: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  building?: Building;
  template?: UnitTemplate;
  tenant?: Profile;
}

export interface ResponsibilityMatrix {
  id: string;
  building_id: string;
  landlord_pays_plumbing: boolean;
  landlord_pays_electrical: boolean;
  landlord_pays_hvac: boolean;
  landlord_pays_appliance: boolean;
  landlord_pays_pest_control: boolean;
  landlord_pays_locks: boolean;
  landlord_pays_painting: boolean;
  landlord_pays_flooring: boolean;
  tenant_pays_lightbulbs: boolean;
  tenant_pays_filters: boolean;
  tenant_pays_minor_repairs: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuildingStaff {
  id: string;
  building_id: string;
  staff_id: string;
  role: string;
  created_at: string;
  staff?: Profile;
}

export type WorkOrderStatus = 'open' | 'in_progress' | 'pending_parts' | 'completed' | 'closed';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'emergency';
export type ExpenseCategory = 'repairs' | 'supplies' | 'improvement' | 'maintenance';

export interface WorkOrder {
  id: string;
  building_id: string;
  unit_id: string;
  reported_by: string;
  assigned_to: string | null;
  room: string;
  category: string;
  issue_title: string;
  issue_description: string | null;
  troubleshooting_completed: boolean;
  troubleshooting_steps: string | null;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  estimated_cost: number | null;
  actual_cost: number | null;
  receipt_image_url: string | null;
  expense_category: ExpenseCategory | null;
  landlord_responsible: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  building?: Building;
  unit?: Unit;
  reporter?: Profile;
  assignee?: Profile;
}

// =============================================
// Logic Tree Types
// =============================================

export interface TroubleshootingStep {
  instruction: string;
  image_url?: string;
}

export interface IssueOption {
  title: string;
  description: string;
  troubleshooting?: TroubleshootingStep[];
}

export interface CategoryOption {
  name: string;
  icon: string;
  issues: IssueOption[];
}

export interface RoomOption {
  name: string;
  icon: string;
  categories: CategoryOption[];
}
