'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import type { Building, ResponsibilityMatrix } from '@/types/database';
import {
  Plus,
  Building2,
  MapPin,
  Settings,
  Trash2,
  Edit2,
  Shield,
  Thermometer,
  Paintbrush,
} from 'lucide-react';

export default function BuildingsPage() {
  const {
    buildings,
    units,
    responsibilities,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    updateResponsibility,
  } = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [editBuilding, setEditBuilding] = useState<Building | null>(null);
  const [showVault, setShowVault] = useState<Building | null>(null);
  const [showResponsibility, setShowResponsibility] = useState<string | null>(null);

  const handleAddBuilding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newBuilding: Building = {
      id: `building-${Date.now()}`,
      landlord_id: 'landlord-001',
      name: form.get('name') as string,
      address: form.get('address') as string,
      city: form.get('city') as string || 'Chicago',
      state: 'IL',
      zip: form.get('zip') as string,
      pin_number: form.get('pin_number') as string || null,
      building_type: (form.get('building_type') as Building['building_type']) || '3-flat',
      year_built: form.get('year_built') ? Number(form.get('year_built')) : null,
      total_units: Number(form.get('total_units')) || 3,
      exterior_brick_color: null,
      roof_type: null,
      roof_age_years: null,
      boiler_make: null,
      boiler_model: null,
      boiler_serial: null,
      boiler_install_date: null,
      hvac_filter_size: null,
      paint_code_interior: null,
      paint_code_exterior: null,
      notes: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addBuilding(newBuilding);
    setShowAdd(false);
  };

  const handleUpdateVault = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showVault) return;
    const form = new FormData(e.currentTarget);
    updateBuilding(showVault.id, {
      exterior_brick_color: form.get('exterior_brick_color') as string || null,
      roof_type: form.get('roof_type') as string || null,
      roof_age_years: form.get('roof_age_years') ? Number(form.get('roof_age_years')) : null,
      boiler_make: form.get('boiler_make') as string || null,
      boiler_model: form.get('boiler_model') as string || null,
      boiler_serial: form.get('boiler_serial') as string || null,
      boiler_install_date: form.get('boiler_install_date') as string || null,
      hvac_filter_size: form.get('hvac_filter_size') as string || null,
      paint_code_interior: form.get('paint_code_interior') as string || null,
      paint_code_exterior: form.get('paint_code_exterior') as string || null,
    });
    setShowVault(null);
  };

  const currentResponsibility = showResponsibility
    ? responsibilities.find((r) => r.building_id === showResponsibility)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your property portfolio</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Add Building
        </Button>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {buildings.map((building) => {
          const buildingUnits = units.filter((u) => u.building_id === building.id);
          const occupied = buildingUnits.filter((u) => u.is_occupied).length;
          return (
            <Card key={building.id} className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-navy-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{building.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {building.address}, {building.city}
                    </div>
                  </div>
                </div>
                <Badge>{building.building_type}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{buildingUnits.length}</p>
                  <p className="text-xs text-gray-500">Units</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-emerald-600">{occupied}</p>
                  <p className="text-xs text-gray-500">Occupied</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{building.year_built || '—'}</p>
                  <p className="text-xs text-gray-500">Built</p>
                </div>
              </div>

              {building.pin_number && (
                <p className="text-xs text-gray-400 mb-4">PIN: {building.pin_number}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVault(building)}
                >
                  <Settings className="w-3.5 h-3.5" /> Building Vault
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResponsibility(building.id)}
                >
                  <Shield className="w-3.5 h-3.5" /> Responsibility
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditBuilding(building)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('Delete this building?')) deleteBuilding(building.id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Building Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Building" size="lg">
        <form onSubmit={handleAddBuilding} className="space-y-4">
          <Input name="name" label="Building Name" placeholder="e.g. Oakwood 3-Flat" required />
          <Input name="address" label="Address" placeholder="e.g. 4521 N Oakwood Ave" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="city" label="City" defaultValue="Chicago" />
            <Input name="zip" label="ZIP Code" placeholder="60640" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="pin_number" label="Property PIN" placeholder="14-08-123-045-0000" />
            <Select
              name="building_type"
              label="Building Type"
              options={[
                { value: '3-flat', label: '3-Flat' },
                { value: 'apartment', label: 'Apartment Building' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="year_built" label="Year Built" type="number" placeholder="1922" />
            <Input name="total_units" label="Total Units" type="number" defaultValue="3" required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Building</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Building Modal */}
      <Modal
        open={!!editBuilding}
        onClose={() => setEditBuilding(null)}
        title="Edit Building"
        size="lg"
      >
        {editBuilding && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              updateBuilding(editBuilding.id, {
                name: form.get('name') as string,
                address: form.get('address') as string,
                city: form.get('city') as string,
                zip: form.get('zip') as string,
                pin_number: form.get('pin_number') as string || null,
                building_type: form.get('building_type') as Building['building_type'],
                year_built: form.get('year_built') ? Number(form.get('year_built')) : null,
                total_units: Number(form.get('total_units')),
              });
              setEditBuilding(null);
            }}
            className="space-y-4"
          >
            <Input name="name" label="Building Name" defaultValue={editBuilding.name} required />
            <Input name="address" label="Address" defaultValue={editBuilding.address} required />
            <div className="grid grid-cols-2 gap-4">
              <Input name="city" label="City" defaultValue={editBuilding.city} />
              <Input name="zip" label="ZIP Code" defaultValue={editBuilding.zip} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input name="pin_number" label="Property PIN" defaultValue={editBuilding.pin_number || ''} />
              <Select
                name="building_type"
                label="Building Type"
                defaultValue={editBuilding.building_type}
                options={[
                  { value: '3-flat', label: '3-Flat' },
                  { value: 'apartment', label: 'Apartment Building' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input name="year_built" label="Year Built" type="number" defaultValue={editBuilding.year_built || ''} />
              <Input name="total_units" label="Total Units" type="number" defaultValue={editBuilding.total_units} required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setEditBuilding(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Building Vault Modal */}
      <Modal
        open={!!showVault}
        onClose={() => setShowVault(null)}
        title={`Building Vault — ${showVault?.name || ''}`}
        size="lg"
      >
        {showVault && (
          <form onSubmit={handleUpdateVault} className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Paintbrush className="w-4 h-4" /> Exterior & Interior
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input name="exterior_brick_color" label="Brick Color" defaultValue={showVault.exterior_brick_color || ''} placeholder="e.g. Red Chicago Common" />
                <Input name="paint_code_interior" label="Interior Paint Code" defaultValue={showVault.paint_code_interior || ''} placeholder="e.g. SW 7012 Creamy" />
                <Input name="paint_code_exterior" label="Exterior Paint Code" defaultValue={showVault.paint_code_exterior || ''} placeholder="e.g. SW 6119 Antique Red" />
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Building2 className="w-4 h-4" /> Roof
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input name="roof_type" label="Roof Type" defaultValue={showVault.roof_type || ''} placeholder="e.g. Flat - Modified Bitumen" />
                <Input name="roof_age_years" label="Roof Age (years)" type="number" defaultValue={showVault.roof_age_years || ''} />
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Thermometer className="w-4 h-4" /> Boiler / HVAC
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input name="boiler_make" label="Boiler Make" defaultValue={showVault.boiler_make || ''} placeholder="e.g. Weil-McLain" />
                <Input name="boiler_model" label="Boiler Model" defaultValue={showVault.boiler_model || ''} placeholder="e.g. CGa-4" />
                <Input name="boiler_serial" label="Serial Number" defaultValue={showVault.boiler_serial || ''} />
                <Input name="boiler_install_date" label="Install Date" type="date" defaultValue={showVault.boiler_install_date || ''} />
                <Input name="hvac_filter_size" label="HVAC Filter Size" defaultValue={showVault.hvac_filter_size || ''} placeholder="e.g. 16x25x1" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => setShowVault(null)}>Cancel</Button>
              <Button type="submit">Save Vault</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Responsibility Matrix Modal */}
      <Modal
        open={!!showResponsibility}
        onClose={() => setShowResponsibility(null)}
        title="Responsibility Matrix"
        size="md"
      >
        {showResponsibility && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Landlord Pays For:</h4>
              <div className="space-y-3">
                {[
                  { key: 'landlord_pays_plumbing', label: 'Plumbing' },
                  { key: 'landlord_pays_electrical', label: 'Electrical' },
                  { key: 'landlord_pays_hvac', label: 'HVAC / Heating' },
                  { key: 'landlord_pays_appliance', label: 'Appliance Repairs' },
                  { key: 'landlord_pays_pest_control', label: 'Pest Control' },
                  { key: 'landlord_pays_locks', label: 'Locks & Security' },
                  { key: 'landlord_pays_painting', label: 'Painting' },
                  { key: 'landlord_pays_flooring', label: 'Flooring' },
                ].map(({ key, label }) => (
                  <Toggle
                    key={key}
                    label={label}
                    checked={
                      currentResponsibility
                        ? (currentResponsibility[key as keyof ResponsibilityMatrix] as boolean)
                        : key !== 'landlord_pays_appliance' && key !== 'landlord_pays_painting' && key !== 'landlord_pays_flooring'
                    }
                    onChange={(checked) =>
                      updateResponsibility(showResponsibility, { [key]: checked })
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Tenant Pays For:</h4>
              <div className="space-y-3">
                {[
                  { key: 'tenant_pays_lightbulbs', label: 'Light Bulbs' },
                  { key: 'tenant_pays_filters', label: 'Air Filters' },
                  { key: 'tenant_pays_minor_repairs', label: 'Minor Repairs (under $50)' },
                ].map(({ key, label }) => (
                  <Toggle
                    key={key}
                    label={label}
                    checked={
                      currentResponsibility
                        ? (currentResponsibility[key as keyof ResponsibilityMatrix] as boolean)
                        : true
                    }
                    onChange={(checked) =>
                      updateResponsibility(showResponsibility, { [key]: checked })
                    }
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setShowResponsibility(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
