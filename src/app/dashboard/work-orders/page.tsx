'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import type { WorkOrder } from '@/types/database';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  Upload,
  User,
  Filter,
} from 'lucide-react';

export default function WorkOrdersPage() {
  const {
    workOrders,
    buildings,
    units,
    profiles,
    buildingStaff,
    updateWorkOrder,
  } = useAppState();
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBuilding, setFilterBuilding] = useState<string>('all');
  const [showCloseModal, setShowCloseModal] = useState<WorkOrder | null>(null);

  const filteredOrders = workOrders.filter((wo) => {
    if (filterStatus !== 'all' && wo.status !== filterStatus) return false;
    if (filterBuilding !== 'all' && wo.building_id !== filterBuilding) return false;
    return true;
  });

  const handleCloseOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showCloseModal) return;
    const form = new FormData(e.currentTarget);
    updateWorkOrder(showCloseModal.id, {
      status: 'completed',
      actual_cost: form.get('actual_cost') ? Number(form.get('actual_cost')) : null,
      expense_category: (form.get('expense_category') as WorkOrder['expense_category']) || null,
      receipt_image_url: (form.get('receipt_url') as string) || null,
      completed_at: new Date().toISOString(),
    });
    setShowCloseModal(null);
  };

  const statusCounts = {
    all: workOrders.length,
    open: workOrders.filter((wo) => wo.status === 'open').length,
    in_progress: workOrders.filter((wo) => wo.status === 'in_progress').length,
    completed: workOrders.filter((wo) => wo.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage maintenance requests</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All', icon: Filter },
          { key: 'open', label: 'Open', icon: AlertTriangle },
          { key: 'in_progress', label: 'In Progress', icon: Clock },
          { key: 'completed', label: 'Completed', icon: CheckCircle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === key
                ? 'bg-navy-100 text-navy-700'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
              {statusCounts[key as keyof typeof statusCounts] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Building Filter */}
      <div className="max-w-xs">
        <Select
          value={filterBuilding}
          onChange={(e) => setFilterBuilding(e.target.value)}
          options={[
            { value: 'all', label: 'All Buildings' },
            ...buildings.map((b) => ({ value: b.id, label: b.name })),
          ]}
        />
      </div>

      {/* Work Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">No work orders found</p>
          </Card>
        ) : (
          filteredOrders.map((wo) => {
            const building = buildings.find((b) => b.id === wo.building_id);
            const unit = units.find((u) => u.id === wo.unit_id);
            const reporter = profiles.find((p) => p.id === wo.reported_by);
            const assignee = profiles.find((p) => p.id === wo.assigned_to);

            return (
              <Card
                key={wo.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(wo)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        wo.priority === 'emergency'
                          ? 'bg-red-100 text-red-600'
                          : wo.priority === 'high'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {wo.priority === 'emergency' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Wrench className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{wo.issue_title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {building?.name} · Unit {unit?.unit_number} · {wo.room} · {wo.category}
                      </p>
                      {wo.issue_description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">{wo.issue_description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>Reported by {reporter?.full_name || 'Unknown'}</span>
                        {assignee && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {assignee.full_name}
                          </span>
                        )}
                        <span>{new Date(wo.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={wo.priority} />
                    <StatusBadge status={wo.status} />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Work Order Detail Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder?.issue_title || ''}
        size="lg"
      >
        {selectedOrder && (() => {
          const building = buildings.find((b) => b.id === selectedOrder.building_id);
          const unit = units.find((u) => u.id === selectedOrder.unit_id);
          const reporter = profiles.find((p) => p.id === selectedOrder.reported_by);
          const assignee = profiles.find((p) => p.id === selectedOrder.assigned_to);
          const staff = buildingStaff.filter((bs) => bs.building_id === selectedOrder.building_id);
          const staffProfiles = staff.map((s) => profiles.find((p) => p.id === s.staff_id)).filter(Boolean);

          return (
            <div className="space-y-6">
              <div className="flex gap-2">
                <StatusBadge status={selectedOrder.status} />
                <PriorityBadge priority={selectedOrder.priority} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Building</span>
                  <p className="font-medium">{building?.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Unit</span>
                  <p className="font-medium">#{unit?.unit_number}</p>
                </div>
                <div>
                  <span className="text-gray-500">Room</span>
                  <p className="font-medium">{selectedOrder.room}</p>
                </div>
                <div>
                  <span className="text-gray-500">Category</span>
                  <p className="font-medium capitalize">{selectedOrder.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Reported By</span>
                  <p className="font-medium">{reporter?.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Assigned To</span>
                  <p className="font-medium">{assignee?.full_name || 'Unassigned'}</p>
                </div>
              </div>

              {selectedOrder.issue_description && (
                <div>
                  <span className="text-sm text-gray-500">Description</span>
                  <p className="text-sm mt-1">{selectedOrder.issue_description}</p>
                </div>
              )}

              {selectedOrder.troubleshooting_steps && (
                <div className="bg-amber-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-amber-700">Troubleshooting Attempted</span>
                  <p className="text-sm text-amber-600 mt-1">{selectedOrder.troubleshooting_steps}</p>
                </div>
              )}

              {(selectedOrder.estimated_cost || selectedOrder.actual_cost) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Estimated Cost</span>
                    <p className="font-medium">{selectedOrder.estimated_cost ? `$${selectedOrder.estimated_cost}` : '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Actual Cost</span>
                    <p className="font-medium">{selectedOrder.actual_cost ? `$${selectedOrder.actual_cost}` : '—'}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {selectedOrder.status === 'open' && (
                  <>
                    <Select
                      value={selectedOrder.assigned_to || ''}
                      onChange={(e) => {
                        updateWorkOrder(selectedOrder.id, {
                          assigned_to: e.target.value || null,
                          status: e.target.value ? 'in_progress' : 'open',
                        });
                        setSelectedOrder({
                          ...selectedOrder,
                          assigned_to: e.target.value || null,
                          status: e.target.value ? 'in_progress' : 'open',
                        });
                      }}
                      options={[
                        { value: '', label: 'Assign to...' },
                        { value: 'landlord-001', label: 'Self (DIY)' },
                        ...staffProfiles.map((p) => ({
                          value: p!.id,
                          label: p!.full_name,
                        })),
                      ]}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateWorkOrder(selectedOrder.id, { status: 'in_progress' });
                        setSelectedOrder({ ...selectedOrder, status: 'in_progress' });
                      }}
                    >
                      Start Work
                    </Button>
                  </>
                )}
                {(selectedOrder.status === 'in_progress' || selectedOrder.status === 'open') && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowCloseModal(selectedOrder);
                      setSelectedOrder(null);
                    }}
                  >
                    <CheckCircle className="w-4 h-4" /> Complete & Close
                  </Button>
                )}
                <Select
                  value={selectedOrder.priority}
                  onChange={(e) => {
                    const priority = e.target.value as WorkOrder['priority'];
                    updateWorkOrder(selectedOrder.id, { priority });
                    setSelectedOrder({ ...selectedOrder, priority });
                  }}
                  options={[
                    { value: 'low', label: 'Low Priority' },
                    { value: 'medium', label: 'Medium Priority' },
                    { value: 'high', label: 'High Priority' },
                    { value: 'emergency', label: 'Emergency' },
                  ]}
                />
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Close/Complete Work Order Modal */}
      <Modal
        open={!!showCloseModal}
        onClose={() => setShowCloseModal(null)}
        title="Complete Work Order"
        size="md"
      >
        {showCloseModal && (
          <form onSubmit={handleCloseOrder} className="space-y-4">
            <p className="text-sm text-gray-600">
              To close this ticket, please provide the cost and upload a receipt.
            </p>
            <Input
              name="actual_cost"
              label="Actual Cost"
              type="number"
              step="0.01"
              defaultValue={showCloseModal.estimated_cost || ''}
              required
            />
            <Select
              name="expense_category"
              label="Expense Category"
              options={[
                { value: '', label: 'Select category...' },
                { value: 'repairs', label: 'Repairs' },
                { value: 'supplies', label: 'Supplies' },
                { value: 'improvement', label: 'Improvement (Depreciable)' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-navy-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Upload receipt photo</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                <input type="file" name="receipt" accept="image/*" className="hidden" />
                <Input name="receipt_url" placeholder="Or paste image URL" className="mt-3" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setShowCloseModal(null)}>
                Cancel
              </Button>
              <Button type="submit">
                <CheckCircle className="w-4 h-4" /> Complete Order
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
