'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import type { Unit } from '@/types/database';
import { Plus, Home, Trash2, Edit2, Users, Copy } from 'lucide-react';

export default function UnitsPage() {
  const {
    buildings,
    templates,
    units,
    profiles,
    addUnit,
    addUnits,
    updateUnit,
    deleteUnit,
  } = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  const [filterBuilding, setFilterBuilding] = useState<string>('all');

  const filteredUnits =
    filterBuilding === 'all'
      ? units
      : units.filter((u) => u.building_id === filterBuilding);

  const tenants = profiles.filter((p) => p.role === 'tenant');

  const handleAddUnit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      building_id: form.get('building_id') as string,
      template_id: (form.get('template_id') as string) || null,
      unit_number: form.get('unit_number') as string,
      floor: form.get('floor') ? Number(form.get('floor')) : null,
      tenant_id: (form.get('tenant_id') as string) || null,
      rent_amount: form.get('rent_amount') ? Number(form.get('rent_amount')) : null,
      lease_start: (form.get('lease_start') as string) || null,
      lease_end: (form.get('lease_end') as string) || null,
      is_occupied: !!(form.get('tenant_id') as string),
      notes: (form.get('notes') as string) || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addUnit(newUnit);
    setShowAdd(false);
  };

  const handleBulkInsert = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const buildingId = form.get('building_id') as string;
    const templateId = (form.get('template_id') as string) || null;
    const startNumber = Number(form.get('start_number')) || 1;
    const endNumber = Number(form.get('end_number')) || 10;
    const rentAmount = form.get('rent_amount') ? Number(form.get('rent_amount')) : null;

    const newUnits: Unit[] = [];
    for (let i = startNumber; i <= endNumber; i++) {
      newUnits.push({
        id: `unit-${Date.now()}-${i}`,
        building_id: buildingId,
        template_id: templateId,
        unit_number: String(i),
        floor: null,
        tenant_id: null,
        rent_amount: rentAmount,
        lease_start: null,
        lease_end: null,
        is_occupied: false,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    addUnits(newUnits);
    setShowBulk(false);
  };

  const handleEditUnit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editUnit) return;
    const form = new FormData(e.currentTarget);
    const tenantId = (form.get('tenant_id') as string) || null;
    updateUnit(editUnit.id, {
      unit_number: form.get('unit_number') as string,
      floor: form.get('floor') ? Number(form.get('floor')) : null,
      template_id: (form.get('template_id') as string) || null,
      tenant_id: tenantId,
      rent_amount: form.get('rent_amount') ? Number(form.get('rent_amount')) : null,
      lease_start: (form.get('lease_start') as string) || null,
      lease_end: (form.get('lease_end') as string) || null,
      is_occupied: !!tenantId,
      notes: (form.get('notes') as string) || null,
    });
    setEditUnit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Units</h1>
          <p className="text-sm text-gray-500 mt-1">Manage individual units across your buildings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulk(true)}>
            <Copy className="w-4 h-4" /> Bulk Insert
          </Button>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> Add Unit
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select
          label="Filter by Building"
          value={filterBuilding}
          onChange={(e) => setFilterBuilding(e.target.value)}
          options={[
            { value: 'all', label: 'All Buildings' },
            ...buildings.map((b) => ({ value: b.id, label: b.name })),
          ]}
        />
      </div>

      {/* Units Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Unit</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Building</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Template</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Tenant</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Rent</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUnits.map((unit) => {
                const building = buildings.find((b) => b.id === unit.building_id);
                const template = templates.find((t) => t.id === unit.template_id);
                const tenant = profiles.find((p) => p.id === unit.tenant_id);
                return (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">#{unit.unit_number}</span>
                        {unit.floor && <span className="text-xs text-gray-400">Floor {unit.floor}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{building?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{template?.name || '—'}</td>
                    <td className="px-6 py-4">
                      {tenant ? (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{tenant.full_name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Vacant</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {unit.rent_amount ? `$${unit.rent_amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={unit.is_occupied ? 'success' : 'warning'}>
                        {unit.is_occupied ? 'Occupied' : 'Vacant'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditUnit(unit)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this unit?')) deleteUnit(unit.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Unit Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Unit" size="md">
        <form onSubmit={handleAddUnit} className="space-y-4">
          <Select
            name="building_id"
            label="Building"
            options={buildings.map((b) => ({ value: b.id, label: b.name }))}
            required
          />
          <Select
            name="template_id"
            label="Unit Template"
            options={[{ value: '', label: 'None' }, ...templates.map((t) => ({ value: t.id, label: t.name }))]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input name="unit_number" label="Unit Number" placeholder="e.g. 1A" required />
            <Input name="floor" label="Floor" type="number" />
          </div>
          <Select
            name="tenant_id"
            label="Assign Tenant"
            options={[{ value: '', label: 'Vacant' }, ...tenants.map((t) => ({ value: t.id, label: t.full_name }))]}
          />
          <Input name="rent_amount" label="Monthly Rent" type="number" step="0.01" placeholder="1800.00" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="lease_start" label="Lease Start" type="date" />
            <Input name="lease_end" label="Lease End" type="date" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit">Add Unit</Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Insert Modal */}
      <Modal open={showBulk} onClose={() => setShowBulk(false)} title="Bulk Insert Units" size="md">
        <form onSubmit={handleBulkInsert} className="space-y-4">
          <p className="text-sm text-gray-600">
            Quickly add multiple units to a building with the same template applied.
          </p>
          <Select
            name="building_id"
            label="Building"
            options={buildings.map((b) => ({ value: b.id, label: b.name }))}
            required
          />
          <Select
            name="template_id"
            label="Apply Template"
            options={[{ value: '', label: 'None' }, ...templates.map((t) => ({ value: t.id, label: t.name }))]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input name="start_number" label="Start Unit #" type="number" defaultValue="1" required />
            <Input name="end_number" label="End Unit #" type="number" defaultValue="10" required />
          </div>
          <Input name="rent_amount" label="Default Rent" type="number" step="0.01" placeholder="1800.00" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowBulk(false)}>Cancel</Button>
            <Button type="submit">Insert Units</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Unit Modal */}
      <Modal open={!!editUnit} onClose={() => setEditUnit(null)} title="Edit Unit" size="md">
        {editUnit && (
          <form onSubmit={handleEditUnit} className="space-y-4">
            <Select
              name="template_id"
              label="Unit Template"
              defaultValue={editUnit.template_id || ''}
              options={[{ value: '', label: 'None' }, ...templates.map((t) => ({ value: t.id, label: t.name }))]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input name="unit_number" label="Unit Number" defaultValue={editUnit.unit_number} required />
              <Input name="floor" label="Floor" type="number" defaultValue={editUnit.floor || ''} />
            </div>
            <Select
              name="tenant_id"
              label="Assign Tenant"
              defaultValue={editUnit.tenant_id || ''}
              options={[{ value: '', label: 'Vacant' }, ...tenants.map((t) => ({ value: t.id, label: t.full_name }))]}
            />
            <Input name="rent_amount" label="Monthly Rent" type="number" step="0.01" defaultValue={editUnit.rent_amount || ''} />
            <div className="grid grid-cols-2 gap-4">
              <Input name="lease_start" label="Lease Start" type="date" defaultValue={editUnit.lease_start || ''} />
              <Input name="lease_end" label="Lease End" type="date" defaultValue={editUnit.lease_end || ''} />
            </div>
            <Input name="notes" label="Notes" defaultValue={editUnit.notes || ''} />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setEditUnit(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
