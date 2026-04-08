-- Digital Twin Property Manager schema
create extension if not exists "pgcrypto";

create type user_role as enum ('Landlord', 'Tenant', 'Maintenance_Staff');
create type work_order_status as enum ('Open', 'In_Progress', 'Waiting_On_Parts', 'Completed', 'Closed');
create type expense_category as enum ('Repairs', 'Supplies', 'Improvement');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  role user_role not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references users(id),
  name text not null,
  address text not null,
  pin_number text not null,
  global_specs jsonb not null default '{}'::jsonb,
  building_vault jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists unit_templates (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references users(id),
  template_name text not null,
  bedroom_count int not null default 0,
  bathroom_count int not null default 0,
  room_dimensions jsonb not null,
  appliance_models jsonb not null,
  paint_codes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (landlord_id, template_name)
);

create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references buildings(id) on delete cascade,
  unit_template_id uuid not null references unit_templates(id),
  unit_label text not null,
  floor text,
  occupied boolean not null default false,
  created_at timestamptz not null default now(),
  unique (building_id, unit_label)
);

create table if not exists responsibility_matrix (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null unique references buildings(id) on delete cascade,
  landlord_pays_plumbing boolean not null default true,
  landlord_pays_electrical boolean not null default true,
  landlord_pays_appliances boolean not null default true,
  tenant_pays_light_bulbs boolean not null default true,
  tenant_pays_clog_from_misuse boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists work_orders (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references buildings(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  reported_by_user_id uuid not null references users(id),
  assigned_to_user_id uuid references users(id),
  room_location text not null,
  category expense_category not null,
  issue_type text not null,
  troubleshooting_acknowledged boolean not null default false,
  status work_order_status not null default 'Open',
  cost numeric(12,2),
  receipt_image_url text,
  tax_year int generated always as (extract(year from created_at)::int) stored,
  notes text,
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  check (
    status not in ('Completed', 'Closed')
    or receipt_image_url is not null
  )
);

create index if not exists idx_work_orders_building_year on work_orders(building_id, tax_year);
create index if not exists idx_units_building on units(building_id);

-- deterministic automatic routing helper
create or replace function route_work_order_assignee(p_building_id uuid)
returns uuid
language sql
stable
as $$
  select u.id
  from users u
  join buildings b on b.id = p_building_id
  where u.role = 'Maintenance_Staff'
    and exists (
      select 1 from units un where un.building_id = b.id
    )
  limit 1;
$$;

-- schedule e summary view
create or replace view schedule_e_expense_summary as
select
  building_id,
  tax_year,
  sum(case when category = 'Repairs' then coalesce(cost, 0) else 0 end) as tax_deductible_repairs,
  sum(case when category = 'Improvement' then coalesce(cost, 0) else 0 end) as depreciable_improvements,
  sum(case when category = 'Supplies' then coalesce(cost, 0) else 0 end) as supplies_total
from work_orders
group by building_id, tax_year;
