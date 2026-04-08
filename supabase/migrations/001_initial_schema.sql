-- =============================================
-- Property Management App - Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('landlord', 'tenant', 'maintenance_staff')) DEFAULT 'tenant',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- BUILDINGS
-- =============================================
CREATE TABLE public.buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Chicago',
  state TEXT NOT NULL DEFAULT 'IL',
  zip TEXT NOT NULL,
  pin_number TEXT, -- Property Index Number (Cook County)
  building_type TEXT NOT NULL CHECK (building_type IN ('3-flat', 'apartment', 'other')) DEFAULT '3-flat',
  year_built INTEGER,
  total_units INTEGER NOT NULL DEFAULT 3,
  -- Global Specs (Building Vault)
  exterior_brick_color TEXT,
  roof_type TEXT,
  roof_age_years INTEGER,
  boiler_make TEXT,
  boiler_model TEXT,
  boiler_serial TEXT,
  boiler_install_date DATE,
  hvac_filter_size TEXT,
  paint_code_interior TEXT,
  paint_code_exterior TEXT,
  notes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- UNIT TEMPLATES (Library of layouts)
-- =============================================
CREATE TABLE public.unit_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Studio", "3-BR Luxury"
  description TEXT,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms NUMERIC(3,1) NOT NULL DEFAULT 1.0,
  square_feet INTEGER,
  rooms JSONB NOT NULL DEFAULT '[]',
  -- rooms: [{ name: "Kitchen", dimensions: "10x12", appliances: [{name: "Refrigerator", make: "LG", model: "LRFXS2503S"}] }]
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- UNITS
-- =============================================
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.unit_templates(id) ON DELETE SET NULL,
  unit_number TEXT NOT NULL,
  floor INTEGER,
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rent_amount NUMERIC(10,2),
  lease_start DATE,
  lease_end DATE,
  is_occupied BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(building_id, unit_number)
);

-- =============================================
-- RESPONSIBILITY MATRIX
-- =============================================
CREATE TABLE public.responsibility_matrix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE UNIQUE,
  landlord_pays_plumbing BOOLEAN NOT NULL DEFAULT true,
  landlord_pays_electrical BOOLEAN NOT NULL DEFAULT true,
  landlord_pays_hvac BOOLEAN NOT NULL DEFAULT true,
  landlord_pays_appliance BOOLEAN NOT NULL DEFAULT false,
  landlord_pays_pest_control BOOLEAN NOT NULL DEFAULT true,
  landlord_pays_locks BOOLEAN NOT NULL DEFAULT true,
  landlord_pays_painting BOOLEAN NOT NULL DEFAULT false,
  landlord_pays_flooring BOOLEAN NOT NULL DEFAULT false,
  tenant_pays_lightbulbs BOOLEAN NOT NULL DEFAULT true,
  tenant_pays_filters BOOLEAN NOT NULL DEFAULT true,
  tenant_pays_minor_repairs BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- BUILDING STAFF ASSIGNMENTS
-- =============================================
CREATE TABLE public.building_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'maintenance',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(building_id, staff_id)
);

-- =============================================
-- WORK ORDERS
-- =============================================
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.profiles(id),
  assigned_to UUID REFERENCES public.profiles(id),
  -- Issue details (from logic tree)
  room TEXT NOT NULL,
  category TEXT NOT NULL, -- plumbing, electrical, hvac, appliance, pest, locks, painting, flooring, other
  issue_title TEXT NOT NULL,
  issue_description TEXT,
  -- Troubleshooting
  troubleshooting_completed BOOLEAN NOT NULL DEFAULT false,
  troubleshooting_steps TEXT,
  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'pending_parts', 'completed', 'closed')) DEFAULT 'open',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
  -- Cost & receipts
  estimated_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  receipt_image_url TEXT,
  expense_category TEXT CHECK (expense_category IN ('repairs', 'supplies', 'improvement', 'maintenance', NULL)),
  -- Responsibility
  landlord_responsible BOOLEAN NOT NULL DEFAULT true,
  -- Timestamps
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_buildings_landlord ON public.buildings(landlord_id);
CREATE INDEX idx_units_building ON public.units(building_id);
CREATE INDEX idx_units_tenant ON public.units(tenant_id);
CREATE INDEX idx_work_orders_building ON public.work_orders(building_id);
CREATE INDEX idx_work_orders_unit ON public.work_orders(unit_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_work_orders_assigned ON public.work_orders(assigned_to);
CREATE INDEX idx_building_staff_building ON public.building_staff(building_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsibility_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.building_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Buildings: landlords can CRUD their buildings, tenants/staff can view assigned buildings
CREATE POLICY "Landlords manage buildings" ON public.buildings FOR ALL USING (auth.uid() = landlord_id);
CREATE POLICY "Tenants view assigned buildings" ON public.buildings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.units WHERE units.building_id = buildings.id AND units.tenant_id = auth.uid())
);
CREATE POLICY "Staff view assigned buildings" ON public.buildings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.building_staff WHERE building_staff.building_id = buildings.id AND building_staff.staff_id = auth.uid())
);

-- Unit templates: landlords manage their own
CREATE POLICY "Landlords manage templates" ON public.unit_templates FOR ALL USING (auth.uid() = landlord_id);

-- Units: landlords manage, tenants view their own
CREATE POLICY "Landlords manage units" ON public.units FOR ALL USING (
  EXISTS (SELECT 1 FROM public.buildings WHERE buildings.id = units.building_id AND buildings.landlord_id = auth.uid())
);
CREATE POLICY "Tenants view own unit" ON public.units FOR SELECT USING (tenant_id = auth.uid());

-- Responsibility matrix: landlords manage
CREATE POLICY "Landlords manage responsibility" ON public.responsibility_matrix FOR ALL USING (
  EXISTS (SELECT 1 FROM public.buildings WHERE buildings.id = responsibility_matrix.building_id AND buildings.landlord_id = auth.uid())
);

-- Building staff: landlords manage
CREATE POLICY "Landlords manage staff" ON public.building_staff FOR ALL USING (
  EXISTS (SELECT 1 FROM public.buildings WHERE buildings.id = building_staff.building_id AND buildings.landlord_id = auth.uid())
);
CREATE POLICY "Staff view own assignments" ON public.building_staff FOR SELECT USING (staff_id = auth.uid());

-- Work orders: complex access rules
CREATE POLICY "Landlords manage work orders" ON public.work_orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.buildings WHERE buildings.id = work_orders.building_id AND buildings.landlord_id = auth.uid())
);
CREATE POLICY "Tenants create work orders" ON public.work_orders FOR INSERT WITH CHECK (reported_by = auth.uid());
CREATE POLICY "Tenants view own work orders" ON public.work_orders FOR SELECT USING (reported_by = auth.uid());
CREATE POLICY "Staff view assigned work orders" ON public.work_orders FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "Staff update assigned work orders" ON public.work_orders FOR UPDATE USING (assigned_to = auth.uid());

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_unit_templates_updated_at BEFORE UPDATE ON public.unit_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_responsibility_matrix_updated_at BEFORE UPDATE ON public.responsibility_matrix FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
