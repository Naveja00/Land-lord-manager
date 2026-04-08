'use client';

import { useAppState } from '@/lib/store';
import { Card, CardTitle } from '@/components/ui/card';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import {
  Building2,
  Home,
  Wrench,
  AlertTriangle,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { buildings, units, workOrders } = useAppState();

  const openOrders = workOrders.filter((wo) => wo.status === 'open' || wo.status === 'in_progress');
  const occupiedUnits = units.filter((u) => u.is_occupied);
  const totalRevenue = units.reduce((sum, u) => sum + (u.rent_amount || 0), 0);
  const completedOrders = workOrders.filter((wo) => wo.status === 'completed' || wo.status === 'closed');
  const totalExpenses = completedOrders.reduce((sum, wo) => sum + (wo.actual_cost || 0), 0);

  const stats = [
    {
      label: 'Buildings',
      value: buildings.length,
      icon: Building2,
      color: 'bg-navy-50 text-navy-600',
      href: '/dashboard/buildings',
    },
    {
      label: 'Units',
      value: `${occupiedUnits.length}/${units.length}`,
      subtitle: 'occupied',
      icon: Home,
      color: 'bg-emerald-50 text-emerald-600',
      href: '/dashboard/units',
    },
    {
      label: 'Open Orders',
      value: openOrders.length,
      icon: Wrench,
      color: 'bg-amber-50 text-amber-600',
      href: '/dashboard/work-orders',
    },
    {
      label: 'Monthly Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-600',
      href: '/dashboard/accounting',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your property portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-400">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Work Orders */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Recent Work Orders</CardTitle>
          <Link
            href="/dashboard/work-orders"
            className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {workOrders.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No work orders yet</p>
        ) : (
          <div className="space-y-3">
            {workOrders.slice(0, 5).map((wo) => {
              const building = buildings.find((b) => b.id === wo.building_id);
              const unit = units.find((u) => u.id === wo.unit_id);
              return (
                <div
                  key={wo.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
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
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {wo.issue_title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {building?.name} — Unit {unit?.unit_number} — {wo.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={wo.priority} />
                    <StatusBadge status={wo.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buildings Summary */}
        <Card>
          <CardTitle>Buildings</CardTitle>
          <div className="mt-4 space-y-3">
            {buildings.map((b) => {
              const buildingUnits = units.filter((u) => u.building_id === b.id);
              const occupied = buildingUnits.filter((u) => u.is_occupied).length;
              return (
                <Link
                  key={b.id}
                  href="/dashboard/buildings"
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {occupied}/{buildingUnits.length}
                    </p>
                    <p className="text-xs text-gray-500">occupied</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Expense Summary */}
        <Card>
          <CardTitle>Expense Summary</CardTitle>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Repairs</span>
              <span className="text-sm font-semibold text-gray-900">
                ${totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Open Estimates</span>
              <span className="text-sm font-semibold text-gray-900">
                $
                {openOrders
                  .reduce((sum, wo) => sum + (wo.estimated_cost || 0), 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <Link
                href="/dashboard/accounting"
                className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
              >
                View full ledger <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
