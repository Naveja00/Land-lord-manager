'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/store';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import type { UnitTemplate, RoomSpec, ApplianceSpec } from '@/types/database';
import { Plus, Layers, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

function RoomEditor({
  rooms,
  onChange,
}: {
  rooms: RoomSpec[];
  onChange: (rooms: RoomSpec[]) => void;
}) {
  const [expandedRoom, setExpandedRoom] = useState<number | null>(null);

  const addRoom = () => {
    onChange([...rooms, { name: '', dimensions: '', appliances: [] }]);
    setExpandedRoom(rooms.length);
  };

  const updateRoom = (index: number, updates: Partial<RoomSpec>) => {
    const updated = rooms.map((r, i) => (i === index ? { ...r, ...updates } : r));
    onChange(updated);
  };

  const removeRoom = (index: number) => {
    onChange(rooms.filter((_, i) => i !== index));
  };

  const addAppliance = (roomIndex: number) => {
    const room = rooms[roomIndex];
    updateRoom(roomIndex, {
      appliances: [...room.appliances, { name: '', make: '', model: '' }],
    });
  };

  const updateAppliance = (roomIndex: number, appIndex: number, updates: Partial<ApplianceSpec>) => {
    const room = rooms[roomIndex];
    const appliances = room.appliances.map((a, i) => (i === appIndex ? { ...a, ...updates } : a));
    updateRoom(roomIndex, { appliances });
  };

  const removeAppliance = (roomIndex: number, appIndex: number) => {
    const room = rooms[roomIndex];
    updateRoom(roomIndex, {
      appliances: room.appliances.filter((_, i) => i !== appIndex),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Rooms</h4>
        <Button variant="outline" size="sm" type="button" onClick={addRoom}>
          <Plus className="w-3 h-3" /> Add Room
        </Button>
      </div>
      {rooms.map((room, ri) => (
        <div key={ri} className="border border-gray-200 rounded-lg">
          <div
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedRoom(expandedRoom === ri ? null : ri)}
          >
            <div className="flex items-center gap-2">
              {expandedRoom === ri ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{room.name || `Room ${ri + 1}`}</span>
              {room.dimensions && <Badge>{room.dimensions}</Badge>}
              {room.appliances.length > 0 && (
                <Badge variant="info">{room.appliances.length} appliances</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeRoom(ri);
              }}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </Button>
          </div>
          {expandedRoom === ri && (
            <div className="p-3 pt-0 border-t border-gray-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Room Name"
                  value={room.name}
                  onChange={(e) => updateRoom(ri, { name: e.target.value })}
                  placeholder="e.g. Kitchen"
                />
                <Input
                  label="Dimensions"
                  value={room.dimensions}
                  onChange={(e) => updateRoom(ri, { dimensions: e.target.value })}
                  placeholder="e.g. 10x12"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Appliances</span>
                  <Button variant="ghost" size="sm" type="button" onClick={() => addAppliance(ri)}>
                    <Plus className="w-3 h-3" /> Add
                  </Button>
                </div>
                {room.appliances.map((app, ai) => (
                  <div key={ai} className="grid grid-cols-4 gap-2 mb-2">
                    <Input
                      value={app.name}
                      onChange={(e) => updateAppliance(ri, ai, { name: e.target.value })}
                      placeholder="Name"
                    />
                    <Input
                      value={app.make}
                      onChange={(e) => updateAppliance(ri, ai, { make: e.target.value })}
                      placeholder="Make"
                    />
                    <Input
                      value={app.model}
                      onChange={(e) => updateAppliance(ri, ai, { model: e.target.value })}
                      placeholder="Model"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => removeAppliance(ri, ai)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TemplatesPage() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [editTemplate, setEditTemplate] = useState<UnitTemplate | null>(null);
  const [rooms, setRooms] = useState<RoomSpec[]>([]);
  const [viewTemplate, setViewTemplate] = useState<UnitTemplate | null>(null);

  const openNew = () => {
    setEditTemplate(null);
    setRooms([]);
    setShowForm(true);
  };

  const openEdit = (t: UnitTemplate) => {
    setEditTemplate(t);
    setRooms(t.rooms);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      description: (form.get('description') as string) || null,
      bedrooms: Number(form.get('bedrooms')) || 0,
      bathrooms: Number(form.get('bathrooms')) || 1,
      square_feet: form.get('square_feet') ? Number(form.get('square_feet')) : null,
      rooms,
    };

    if (editTemplate) {
      updateTemplate(editTemplate.id, data);
    } else {
      addTemplate({
        id: `template-${Date.now()}`,
        landlord_id: 'landlord-001',
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unit Templates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create reusable layouts for your units — define rooms, dimensions, and appliance specs once
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" /> New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <Card key={t.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-navy-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  {t.description && <CardDescription>{t.description}</CardDescription>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-3">
              <Badge variant="info">{t.bedrooms} BR</Badge>
              <Badge variant="info">{t.bathrooms} BA</Badge>
              {t.square_feet && <Badge>{t.square_feet} sqft</Badge>}
            </div>

            <p className="text-xs text-gray-500 mb-4">
              {t.rooms.length} rooms · {t.rooms.reduce((sum, r) => sum + r.appliances.length, 0)} appliances
            </p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewTemplate(t)}>
                View Details
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Delete this template?')) deleteTemplate(t.id);
                }}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Template Modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editTemplate ? 'Edit Template' : 'Create Unit Template'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            label="Template Name"
            defaultValue={editTemplate?.name || ''}
            placeholder="e.g. 3-BR Classic Chicago"
            required
          />
          <Input
            name="description"
            label="Description"
            defaultValue={editTemplate?.description || ''}
            placeholder="Standard Chicago 3-flat unit..."
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              name="bedrooms"
              label="Bedrooms"
              type="number"
              defaultValue={editTemplate?.bedrooms ?? 1}
              min="0"
            />
            <Input
              name="bathrooms"
              label="Bathrooms"
              type="number"
              defaultValue={editTemplate?.bathrooms ?? 1}
              min="0"
              step="0.5"
            />
            <Input
              name="square_feet"
              label="Square Feet"
              type="number"
              defaultValue={editTemplate?.square_feet || ''}
            />
          </div>

          <RoomEditor rooms={rooms} onChange={setRooms} />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">{editTemplate ? 'Save Changes' : 'Create Template'}</Button>
          </div>
        </form>
      </Modal>

      {/* View Template Details Modal */}
      <Modal
        open={!!viewTemplate}
        onClose={() => setViewTemplate(null)}
        title={viewTemplate?.name || ''}
        size="lg"
      >
        {viewTemplate && (
          <div className="space-y-4">
            {viewTemplate.description && (
              <p className="text-sm text-gray-600">{viewTemplate.description}</p>
            )}
            <div className="flex gap-3">
              <Badge variant="info">{viewTemplate.bedrooms} BR</Badge>
              <Badge variant="info">{viewTemplate.bathrooms} BA</Badge>
              {viewTemplate.square_feet && <Badge>{viewTemplate.square_feet} sqft</Badge>}
            </div>
            <div className="space-y-3">
              {viewTemplate.rooms.map((room, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{room.name}</h4>
                    <Badge>{room.dimensions}</Badge>
                  </div>
                  {room.appliances.length > 0 && (
                    <div className="space-y-1">
                      {room.appliances.map((app, j) => (
                        <p key={j} className="text-sm text-gray-600">
                          {app.name} — {app.make} {app.model}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
