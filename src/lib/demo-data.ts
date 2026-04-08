import type {
  Profile,
  Building,
  UnitTemplate,
  Unit,
  ResponsibilityMatrix,
  WorkOrder,
  BuildingStaff,
  RoomOption,
} from '@/types/database';

// =============================================
// Demo Users
// =============================================
export const demoUsers: Profile[] = [
  {
    id: 'landlord-001',
    email: 'mike@landlord.com',
    full_name: 'Mike Naveja',
    role: 'landlord',
    phone: '(312) 555-0100',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tenant-001',
    email: 'sarah@tenant.com',
    full_name: 'Sarah Johnson',
    role: 'tenant',
    phone: '(312) 555-0201',
    avatar_url: null,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'tenant-002',
    email: 'james@tenant.com',
    full_name: 'James Williams',
    role: 'tenant',
    phone: '(312) 555-0202',
    avatar_url: null,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'staff-001',
    email: 'carlos@maintenance.com',
    full_name: 'Carlos Rivera',
    role: 'maintenance_staff',
    phone: '(312) 555-0301',
    avatar_url: null,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
];

// =============================================
// Demo Buildings
// =============================================
export const demoBuildings: Building[] = [
  {
    id: 'building-001',
    landlord_id: 'landlord-001',
    name: 'Oakwood 3-Flat',
    address: '4521 N Oakwood Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60640',
    pin_number: '14-08-123-045-0000',
    building_type: '3-flat',
    year_built: 1922,
    total_units: 3,
    exterior_brick_color: 'Red Chicago Common',
    roof_type: 'Flat - Modified Bitumen',
    roof_age_years: 8,
    boiler_make: 'Weil-McLain',
    boiler_model: 'CGa-4',
    boiler_serial: 'WM-2019-88432',
    boiler_install_date: '2019-10-15',
    hvac_filter_size: '16x25x1',
    paint_code_interior: 'SW 7012 Creamy',
    paint_code_exterior: 'SW 6119 Antique Red',
    notes: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'building-002',
    landlord_id: 'landlord-001',
    name: 'Lakeview Apartments',
    address: '3200 N Sheffield Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60657',
    pin_number: '14-21-456-078-0000',
    building_type: 'apartment',
    year_built: 1985,
    total_units: 12,
    exterior_brick_color: 'Tan Face Brick',
    roof_type: 'Flat - EPDM Rubber',
    roof_age_years: 3,
    boiler_make: 'Burnham',
    boiler_model: 'Series 2',
    boiler_serial: 'BN-2021-55219',
    boiler_install_date: '2021-09-20',
    hvac_filter_size: '20x25x1',
    paint_code_interior: 'BM OC-17 White Dove',
    paint_code_exterior: null,
    notes: {},
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
];

// =============================================
// Demo Unit Templates
// =============================================
export const demoTemplates: UnitTemplate[] = [
  {
    id: 'template-001',
    landlord_id: 'landlord-001',
    name: '3-BR Classic Chicago',
    description: 'Standard Chicago 3-flat unit with railroad layout',
    bedrooms: 3,
    bathrooms: 1,
    square_feet: 1100,
    rooms: [
      {
        name: 'Kitchen',
        dimensions: '10x12',
        appliances: [
          { name: 'Refrigerator', make: 'LG', model: 'LRFXS2503S' },
          { name: 'Stove', make: 'GE', model: 'JB645RKSS' },
          { name: 'Dishwasher', make: 'Bosch', model: 'SHPM88Z75N' },
        ],
      },
      { name: 'Living Room', dimensions: '14x16', appliances: [] },
      { name: 'Bedroom 1', dimensions: '12x14', appliances: [] },
      { name: 'Bedroom 2', dimensions: '10x12', appliances: [] },
      { name: 'Bedroom 3', dimensions: '10x10', appliances: [] },
      {
        name: 'Bathroom',
        dimensions: '6x8',
        appliances: [
          { name: 'Water Heater', make: 'Rheem', model: 'XE40M06ST45U1' },
        ],
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'template-002',
    landlord_id: 'landlord-001',
    name: 'Studio Modern',
    description: 'Compact studio with updated finishes',
    bedrooms: 0,
    bathrooms: 1,
    square_feet: 450,
    rooms: [
      {
        name: 'Main Room',
        dimensions: '18x20',
        appliances: [
          { name: 'Refrigerator', make: 'Samsung', model: 'RT18M6215SG' },
          { name: 'Microwave', make: 'GE', model: 'JES1095SMSS' },
        ],
      },
      {
        name: 'Kitchenette',
        dimensions: '6x8',
        appliances: [
          { name: 'Stove', make: 'GE', model: 'JAS640RMSS' },
        ],
      },
      { name: 'Bathroom', dimensions: '5x7', appliances: [] },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'template-003',
    landlord_id: 'landlord-001',
    name: '1-BR Garden',
    description: 'Garden-level one bedroom unit',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 700,
    rooms: [
      {
        name: 'Kitchen',
        dimensions: '8x10',
        appliances: [
          { name: 'Refrigerator', make: 'Whirlpool', model: 'WRT318FZDW' },
          { name: 'Stove', make: 'Whirlpool', model: 'WFG320M0BW' },
        ],
      },
      { name: 'Living Room', dimensions: '12x14', appliances: [] },
      { name: 'Bedroom', dimensions: '12x12', appliances: [] },
      { name: 'Bathroom', dimensions: '6x8', appliances: [] },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// =============================================
// Demo Units
// =============================================
export const demoUnits: Unit[] = [
  {
    id: 'unit-001',
    building_id: 'building-001',
    template_id: 'template-001',
    unit_number: '1',
    floor: 1,
    tenant_id: 'tenant-001',
    rent_amount: 1800,
    lease_start: '2024-03-01',
    lease_end: '2025-02-28',
    is_occupied: true,
    notes: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'unit-002',
    building_id: 'building-001',
    template_id: 'template-001',
    unit_number: '2',
    floor: 2,
    tenant_id: 'tenant-002',
    rent_amount: 1900,
    lease_start: '2024-06-01',
    lease_end: '2025-05-31',
    is_occupied: true,
    notes: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'unit-003',
    building_id: 'building-001',
    template_id: 'template-001',
    unit_number: '3',
    floor: 3,
    tenant_id: null,
    rent_amount: 2000,
    lease_start: null,
    lease_end: null,
    is_occupied: false,
    notes: 'Recently renovated',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// =============================================
// Demo Responsibility Matrix
// =============================================
export const demoResponsibility: ResponsibilityMatrix[] = [
  {
    id: 'resp-001',
    building_id: 'building-001',
    landlord_pays_plumbing: true,
    landlord_pays_electrical: true,
    landlord_pays_hvac: true,
    landlord_pays_appliance: false,
    landlord_pays_pest_control: true,
    landlord_pays_locks: true,
    landlord_pays_painting: false,
    landlord_pays_flooring: false,
    tenant_pays_lightbulbs: true,
    tenant_pays_filters: true,
    tenant_pays_minor_repairs: true,
    notes: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// =============================================
// Demo Building Staff
// =============================================
export const demoBuildingStaff: BuildingStaff[] = [
  {
    id: 'bs-001',
    building_id: 'building-001',
    staff_id: 'staff-001',
    role: 'maintenance',
    created_at: '2024-01-15T00:00:00Z',
  },
];

// =============================================
// Demo Work Orders
// =============================================
export const demoWorkOrders: WorkOrder[] = [
  {
    id: 'wo-001',
    building_id: 'building-001',
    unit_id: 'unit-001',
    reported_by: 'tenant-001',
    assigned_to: 'staff-001',
    room: 'Kitchen',
    category: 'plumbing',
    issue_title: 'Leaking faucet',
    issue_description: 'Kitchen sink faucet drips constantly, even when fully closed.',
    troubleshooting_completed: true,
    troubleshooting_steps: 'Tightened handle - still leaks',
    status: 'in_progress',
    priority: 'medium',
    estimated_cost: 150,
    actual_cost: null,
    receipt_image_url: null,
    expense_category: null,
    landlord_responsible: true,
    completed_at: null,
    created_at: '2024-11-15T10:00:00Z',
    updated_at: '2024-11-16T08:00:00Z',
  },
  {
    id: 'wo-002',
    building_id: 'building-001',
    unit_id: 'unit-002',
    reported_by: 'tenant-002',
    assigned_to: 'staff-001',
    room: 'Bathroom',
    category: 'plumbing',
    issue_title: 'Clogged drain',
    issue_description: 'Bathtub drains very slowly.',
    troubleshooting_completed: true,
    troubleshooting_steps: 'Used plunger - no improvement',
    status: 'completed',
    priority: 'low',
    estimated_cost: 100,
    actual_cost: 85,
    receipt_image_url: '/receipts/wo-002.jpg',
    expense_category: 'repairs',
    landlord_responsible: true,
    completed_at: '2024-10-20T14:00:00Z',
    created_at: '2024-10-18T09:00:00Z',
    updated_at: '2024-10-20T14:00:00Z',
  },
  {
    id: 'wo-003',
    building_id: 'building-001',
    unit_id: 'unit-001',
    reported_by: 'tenant-001',
    assigned_to: null,
    room: 'Bedroom 1',
    category: 'electrical',
    issue_title: 'Outlet not working',
    issue_description: 'The outlet on the north wall of bedroom 1 has no power.',
    troubleshooting_completed: true,
    troubleshooting_steps: 'Checked breaker - all breakers in ON position',
    status: 'open',
    priority: 'high',
    estimated_cost: null,
    actual_cost: null,
    receipt_image_url: null,
    expense_category: null,
    landlord_responsible: true,
    completed_at: null,
    created_at: '2024-12-01T11:00:00Z',
    updated_at: '2024-12-01T11:00:00Z',
  },
  {
    id: 'wo-004',
    building_id: 'building-002',
    unit_id: 'unit-001',
    reported_by: 'tenant-001',
    assigned_to: 'landlord-001',
    room: 'Kitchen',
    category: 'appliance',
    issue_title: 'Dishwasher not draining',
    issue_description: 'Dishwasher fills with water but does not drain after cycle.',
    troubleshooting_completed: true,
    troubleshooting_steps: 'Cleaned filter, ran rinse cycle - still not draining',
    status: 'completed',
    priority: 'medium',
    estimated_cost: 200,
    actual_cost: 175,
    receipt_image_url: '/receipts/wo-004.jpg',
    expense_category: 'repairs',
    landlord_responsible: false,
    completed_at: '2024-09-15T16:00:00Z',
    created_at: '2024-09-12T10:00:00Z',
    updated_at: '2024-09-15T16:00:00Z',
  },
  {
    id: 'wo-005',
    building_id: 'building-001',
    unit_id: 'unit-002',
    reported_by: 'tenant-002',
    assigned_to: 'staff-001',
    room: 'Living Room',
    category: 'hvac',
    issue_title: 'Radiator not heating',
    issue_description: 'The radiator in the living room stays cold even with valve fully open.',
    troubleshooting_completed: true,
    troubleshooting_steps: 'Bled radiator - some air came out but still cold',
    status: 'completed',
    priority: 'high',
    estimated_cost: 300,
    actual_cost: 250,
    receipt_image_url: '/receipts/wo-005.jpg',
    expense_category: 'repairs',
    landlord_responsible: true,
    completed_at: '2024-11-05T15:00:00Z',
    created_at: '2024-11-01T08:00:00Z',
    updated_at: '2024-11-05T15:00:00Z',
  },
];

// =============================================
// Logic Tree for Issue Reporting
// =============================================
export const issueLogicTree: RoomOption[] = [
  {
    name: 'Kitchen',
    icon: 'ChefHat',
    categories: [
      {
        name: 'Plumbing',
        icon: 'Droplets',
        issues: [
          {
            title: 'Leaking faucet',
            description: 'Faucet drips when turned off',
            troubleshooting: [
              { instruction: 'Make sure both handles are turned completely off.' },
              { instruction: 'Check under the sink for visible water pooling.' },
            ],
          },
          {
            title: 'Clogged sink',
            description: 'Water drains slowly or not at all',
            troubleshooting: [
              { instruction: 'Try using a plunger on the drain for 30 seconds.' },
              { instruction: 'Remove and clean the drain strainer/stopper.' },
            ],
          },
          {
            title: 'No hot water',
            description: 'Only cold water comes from the tap',
            troubleshooting: [
              { instruction: 'Check if hot water works in other rooms/faucets.' },
              { instruction: 'If no hot water anywhere, check the water heater pilot light.' },
            ],
          },
        ],
      },
      {
        name: 'Electrical',
        icon: 'Zap',
        issues: [
          {
            title: 'No power to outlet',
            description: 'Outlet has no electricity',
            troubleshooting: [
              { instruction: 'Check your breaker panel. Look for any tripped breakers (switch in middle position). Flip it fully OFF, then ON.' },
              { instruction: 'Try plugging a known working device into the outlet to confirm.' },
              { instruction: 'Check if any GFCI outlets (with TEST/RESET buttons) need to be reset.' },
            ],
          },
          {
            title: 'Flickering lights',
            description: 'Lights flicker or dim intermittently',
            troubleshooting: [
              { instruction: 'Try tightening or replacing the light bulb.' },
              { instruction: 'Test if the issue happens with different bulbs.' },
            ],
          },
        ],
      },
      {
        name: 'Appliance',
        icon: 'Refrigerator',
        issues: [
          {
            title: 'Refrigerator not cooling',
            description: 'Food is warm or spoiling',
            troubleshooting: [
              { instruction: 'Check that the temperature dial is set correctly (not turned to OFF).' },
              { instruction: 'Make sure the vents inside are not blocked by food items.' },
              { instruction: 'Check that the fridge is plugged in and the outlet works.' },
            ],
          },
          {
            title: 'Dishwasher not draining',
            description: 'Water remains after cycle completes',
            troubleshooting: [
              { instruction: 'Check and clean the dishwasher filter at the bottom of the tub.' },
              { instruction: 'Run a rinse-only cycle to test.' },
            ],
          },
          {
            title: 'Stove burner not lighting',
            description: 'Gas or electric burner won\'t turn on',
            troubleshooting: [
              { instruction: 'For gas: clean the burner cap and igniter with a dry cloth.' },
              { instruction: 'For electric: make sure the burner element is seated properly.' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Bathroom',
    icon: 'Bath',
    categories: [
      {
        name: 'Plumbing',
        icon: 'Droplets',
        issues: [
          {
            title: 'Toilet running',
            description: 'Toilet continuously runs after flushing',
            troubleshooting: [
              { instruction: 'Jiggle the flush handle. If it stops, the flapper may need adjustment.' },
              { instruction: 'Remove the tank lid and check if the flapper is seated properly.' },
            ],
          },
          {
            title: 'Clogged toilet',
            description: 'Toilet will not flush properly',
            troubleshooting: [
              { instruction: 'Use a plunger with firm, steady pumps for 15-20 seconds.' },
              { instruction: 'Wait 10 minutes and try flushing again.' },
            ],
          },
          {
            title: 'Slow drain (tub/shower)',
            description: 'Water pools during shower',
            troubleshooting: [
              { instruction: 'Remove the drain cover and clear any visible hair/debris.' },
              { instruction: 'Try pouring boiling water down the drain.' },
            ],
          },
          {
            title: 'Leaking faucet',
            description: 'Faucet drips when turned off',
            troubleshooting: [
              { instruction: 'Make sure the handle is turned completely off.' },
            ],
          },
        ],
      },
      {
        name: 'Electrical',
        icon: 'Zap',
        issues: [
          {
            title: 'GFCI outlet tripped',
            description: 'Bathroom outlet has no power',
            troubleshooting: [
              { instruction: 'Press the RESET button on the outlet firmly.' },
              { instruction: 'If it trips again immediately, unplug all devices first, then reset.' },
            ],
          },
          {
            title: 'Exhaust fan not working',
            description: 'Bathroom fan does not turn on',
            troubleshooting: [
              { instruction: 'Check if the fan switch is on.' },
              { instruction: 'Check the breaker panel for a tripped breaker.' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Living Room',
    icon: 'Sofa',
    categories: [
      {
        name: 'Electrical',
        icon: 'Zap',
        issues: [
          {
            title: 'No power to outlet',
            description: 'Wall outlet has no electricity',
            troubleshooting: [
              { instruction: 'Check the breaker panel for tripped breakers.' },
              { instruction: 'Some outlets are switch-controlled — check all wall switches.' },
            ],
          },
          {
            title: 'Light fixture not working',
            description: 'Ceiling light or fixture won\'t turn on',
            troubleshooting: [
              { instruction: 'Replace the bulb with a known working one.' },
              { instruction: 'Check the wall switch and breaker panel.' },
            ],
          },
        ],
      },
      {
        name: 'HVAC',
        icon: 'Thermometer',
        issues: [
          {
            title: 'Radiator not heating',
            description: 'Radiator stays cold',
            troubleshooting: [
              { instruction: 'Make sure the radiator valve is fully open (turn counterclockwise).' },
              { instruction: 'Bleed the radiator: use a radiator key to open the bleed valve until water comes out.' },
            ],
          },
          {
            title: 'Room too cold',
            description: 'Temperature significantly below thermostat setting',
            troubleshooting: [
              { instruction: 'Check that all windows are fully closed and locked.' },
              { instruction: 'Check the thermostat batteries if applicable.' },
            ],
          },
        ],
      },
      {
        name: 'Pest Control',
        icon: 'Bug',
        issues: [
          {
            title: 'Insect sighting',
            description: 'Roaches, ants, or other insects spotted',
          },
          {
            title: 'Rodent sighting',
            description: 'Mouse or rat evidence found',
          },
        ],
      },
    ],
  },
  {
    name: 'Bedroom',
    icon: 'Bed',
    categories: [
      {
        name: 'Electrical',
        icon: 'Zap',
        issues: [
          {
            title: 'No power to outlet',
            description: 'Wall outlet has no electricity',
            troubleshooting: [
              { instruction: 'Check the breaker panel for tripped breakers.' },
              { instruction: 'Some outlets are switch-controlled — check all wall switches.' },
            ],
          },
        ],
      },
      {
        name: 'HVAC',
        icon: 'Thermometer',
        issues: [
          {
            title: 'Radiator not heating',
            description: 'Radiator stays cold',
            troubleshooting: [
              { instruction: 'Make sure the radiator valve is fully open.' },
              { instruction: 'Bleed the radiator using a radiator key.' },
            ],
          },
        ],
      },
      {
        name: 'Locks & Doors',
        icon: 'Lock',
        issues: [
          {
            title: 'Door lock not working',
            description: 'Lock jams or key doesn\'t turn',
            troubleshooting: [
              { instruction: 'Try spraying WD-40 or graphite lubricant into the keyhole.' },
            ],
          },
          {
            title: 'Window won\'t close',
            description: 'Window stuck open or won\'t latch',
            troubleshooting: [
              { instruction: 'Check if paint or debris is blocking the track.' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Common Area',
    icon: 'DoorOpen',
    categories: [
      {
        name: 'Electrical',
        icon: 'Zap',
        issues: [
          { title: 'Hallway light out', description: 'Common area lighting not working' },
          { title: 'Buzzer/intercom broken', description: 'Entry system not functioning' },
        ],
      },
      {
        name: 'Plumbing',
        icon: 'Droplets',
        issues: [
          { title: 'Water leak in hallway', description: 'Water coming from ceiling/walls' },
        ],
      },
      {
        name: 'Other',
        icon: 'AlertTriangle',
        issues: [
          { title: 'Front door doesn\'t lock', description: 'Building entry door security issue' },
          { title: 'Mailbox issue', description: 'Mailbox damaged or lock broken' },
        ],
      },
    ],
  },
];
