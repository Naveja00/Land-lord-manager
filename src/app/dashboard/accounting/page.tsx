'use client';

import { useState, useMemo } from 'react';
import { useAppState } from '@/lib/store';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccountingPage() {
  const { workOrders, buildings } = useAppState();
  const [filterBuilding, setFilterBuilding] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());

  const completedOrders = useMemo(() => {
    return workOrders.filter((wo) => {
      if (wo.status !== 'completed' && wo.status !== 'closed') return false;
      if (!wo.actual_cost) return false;
      if (filterBuilding !== 'all' && wo.building_id !== filterBuilding) return false;
      if (wo.completed_at) {
        const year = new Date(wo.completed_at).getFullYear().toString();
        if (year !== filterYear) return false;
      }
      return true;
    });
  }, [workOrders, filterBuilding, filterYear]);

  const totalExpenses = completedOrders.reduce((sum, wo) => sum + (wo.actual_cost || 0), 0);

  const repairsTotal = completedOrders
    .filter((wo) => wo.expense_category === 'repairs')
    .reduce((sum, wo) => sum + (wo.actual_cost || 0), 0);

  const suppliesTotal = completedOrders
    .filter((wo) => wo.expense_category === 'supplies')
    .reduce((sum, wo) => sum + (wo.actual_cost || 0), 0);

  const improvementTotal = completedOrders
    .filter((wo) => wo.expense_category === 'improvement')
    .reduce((sum, wo) => sum + (wo.actual_cost || 0), 0);

  const maintenanceTotal = completedOrders
    .filter((wo) => wo.expense_category === 'maintenance')
    .reduce((sum, wo) => sum + (wo.actual_cost || 0), 0);

  const taxDeductible = repairsTotal + suppliesTotal + maintenanceTotal;
  const depreciable = improvementTotal;

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Building', 'Unit', 'Category', 'Description', 'Amount', 'Tax Type'];
    const rows = completedOrders.map((wo) => {
      const building = buildings.find((b) => b.id === wo.building_id);
      return [
        wo.completed_at ? new Date(wo.completed_at).toLocaleDateString() : '',
        building?.name || '',
        wo.room,
        wo.expense_category || '',
        wo.issue_title,
        wo.actual_cost?.toFixed(2) || '',
        wo.expense_category === 'improvement' ? 'Depreciable' : 'Deductible',
      ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-e-${filterYear}-${filterBuilding === 'all' ? 'all-buildings' : filterBuilding}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax-Ready Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">
            Schedule E expense tracking — filter by building and year
          </p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="w-64">
          <Select
            label="Building"
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            options={[
              { value: 'all', label: 'All Buildings' },
              ...buildings.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />
        </div>
        <div className="w-40">
          <Select
            label="Tax Year"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            options={years}
          />
        </div>
      </div>

      {/* Schedule E Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tax Deductible Repairs</p>
              <p className="text-2xl font-bold text-emerald-600">${taxDeductible.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Repairs + Supplies + Maintenance</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Depreciable Improvements</p>
              <p className="text-2xl font-bold text-blue-600">${depreciable.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Capital improvements (27.5 yr depreciation)</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{completedOrders.length} completed orders</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardTitle>Expense Breakdown by Category</CardTitle>
        <CardDescription>IRS Schedule E categorization</CardDescription>
        <div className="mt-4 space-y-3">
          {[
            { label: 'Repairs', amount: repairsTotal, type: 'Deductible', color: 'bg-emerald-500' },
            { label: 'Supplies', amount: suppliesTotal, type: 'Deductible', color: 'bg-teal-500' },
            { label: 'Maintenance', amount: maintenanceTotal, type: 'Deductible', color: 'bg-cyan-500' },
            { label: 'Improvements', amount: improvementTotal, type: 'Depreciable', color: 'bg-blue-500' },
          ].map((cat) => {
            const pct = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
            return (
              <div key={cat.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{cat.label}</span>
                    <Badge variant={cat.type === 'Deductible' ? 'success' : 'info'}>{cat.type}</Badge>
                  </div>
                  <span className="font-semibold text-gray-900">${cat.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${cat.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Expense Detail Table */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-gray-200">
          <CardTitle>Expense Details</CardTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Building</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Description</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Category</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {completedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No expenses found for the selected period
                  </td>
                </tr>
              ) : (
                completedOrders.map((wo) => {
                  const building = buildings.find((b) => b.id === wo.building_id);
                  return (
                    <tr key={wo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {wo.completed_at ? new Date(wo.completed_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{building?.name}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{wo.issue_title}</p>
                        <p className="text-xs text-gray-500">{wo.room} — {wo.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={wo.expense_category === 'improvement' ? 'info' : 'success'}>
                          {wo.expense_category || 'Uncategorized'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        ${wo.actual_cost?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {wo.receipt_image_url ? (
                          <Badge variant="success">
                            <Receipt className="w-3 h-3 mr-1" /> Uploaded
                          </Badge>
                        ) : (
                          <Badge variant="warning">Missing</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
