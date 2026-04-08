'use client';

import { useAppState } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wrench, AlertTriangle, Plus, ClipboardList } from 'lucide-react';

export default function TenantOrdersPage() {
  const { currentUser, workOrders, profiles } = useAppState();

  const myOrders = workOrders.filter((wo) => wo.reported_by === currentUser.id);
  const openOrders = myOrders.filter((wo) => wo.status === 'open' || wo.status === 'in_progress');
  const closedOrders = myOrders.filter((wo) => wo.status === 'completed' || wo.status === 'closed');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            {openOrders.length} open · {closedOrders.length} resolved
          </p>
        </div>
        <Link href="/tenant/report">
          <Button>
            <Plus className="w-4 h-4" /> New Request
          </Button>
        </Link>
      </div>

      {myOrders.length === 0 ? (
        <Card className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Requests Yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Need something fixed? Report an issue and we&apos;ll get it handled.
          </p>
          <Link href="/tenant/report">
            <Button>Report an Issue</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Open Orders */}
          {openOrders.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Active
              </h2>
              {openOrders.map((wo) => {
                const assignee = profiles.find((p) => p.id === wo.assigned_to);
                return (
                  <Card
                    key={wo.id}
                    className="mb-3 border-l-4 border-l-amber-400"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            wo.priority === 'emergency'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-amber-100 text-amber-600'
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
                          <p className="text-xs text-gray-500 mt-0.5">
                            {wo.room} · {wo.category} · {new Date(wo.created_at).toLocaleDateString()}
                          </p>
                          {wo.issue_description && (
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{wo.issue_description}</p>
                          )}
                          {assignee && (
                            <p className="text-xs text-gray-400 mt-2">
                              Assigned to: {assignee.full_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge status={wo.status} />
                        <PriorityBadge priority={wo.priority} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Closed Orders */}
          {closedOrders.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">
                Resolved
              </h2>
              {closedOrders.map((wo) => (
                <Card key={wo.id} className="mb-3 opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">{wo.issue_title}</h3>
                      <p className="text-xs text-gray-500">
                        {wo.room} · Completed{' '}
                        {wo.completed_at
                          ? new Date(wo.completed_at).toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                    <StatusBadge status={wo.status} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
