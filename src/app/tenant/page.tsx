'use client';

import { useAppState } from '@/lib/store';
import { Card, CardTitle } from '@/components/ui/card';
import { StatusBadge, PriorityBadge, Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Home,
  ClipboardList,
  Wrench,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';

export default function TenantHomePage() {
  const { currentUser, units, buildings, templates, workOrders, profiles } = useAppState();

  const myUnit = units.find((u) => u.tenant_id === currentUser.id);
  const myBuilding = myUnit ? buildings.find((b) => b.id === myUnit.building_id) : null;
  const myTemplate = myUnit?.template_id ? templates.find((t) => t.id === myUnit.template_id) : null;
  const myOrders = workOrders.filter((wo) => wo.reported_by === currentUser.id);
  const openOrders = myOrders.filter((wo) => wo.status === 'open' || wo.status === 'in_progress');
  const landlord = myBuilding ? profiles.find((p) => p.id === myBuilding.landlord_id) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.full_name.split(' ')[0]}</h1>
        <p className="text-sm text-gray-500 mt-1">Your tenant dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unit Info */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center">
              <Home className="w-6 h-6 text-navy-600" />
            </div>
            <div>
              <CardTitle>My Unit</CardTitle>
              {myUnit && myBuilding && (
                <p className="text-sm text-gray-500">
                  Unit #{myUnit.unit_number} · {myBuilding.name}
                </p>
              )}
            </div>
          </div>

          {myUnit && myBuilding ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Address</span>
                  <p className="font-medium">{myBuilding.address}, {myBuilding.city}, {myBuilding.state} {myBuilding.zip}</p>
                </div>
                <div>
                  <span className="text-gray-500">Floor</span>
                  <p className="font-medium">{myUnit.floor || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Monthly Rent</span>
                  <p className="font-medium">{myUnit.rent_amount ? `$${myUnit.rent_amount.toLocaleString()}` : '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Lease Period</span>
                  <p className="font-medium">
                    {myUnit.lease_start && myUnit.lease_end
                      ? `${new Date(myUnit.lease_start).toLocaleDateString()} - ${new Date(myUnit.lease_end).toLocaleDateString()}`
                      : '—'}
                  </p>
                </div>
              </div>

              {myTemplate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Unit Layout: {myTemplate.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="info">{myTemplate.bedrooms} BR</Badge>
                    <Badge variant="info">{myTemplate.bathrooms} BA</Badge>
                    {myTemplate.square_feet && <Badge>{myTemplate.square_feet} sqft</Badge>}
                    <Badge>{myTemplate.rooms.length} rooms</Badge>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No unit assigned yet. Please contact your landlord.</p>
          )}
        </Card>

        {/* Contact Card */}
        <Card>
          <CardTitle>Landlord Contact</CardTitle>
          {landlord ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-gray-900">{landlord.full_name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                {landlord.email}
              </div>
              {landlord.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {landlord.phone}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-4">Contact info unavailable</p>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/tenant/report">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-navy-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-navy-50 flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-navy-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Report an Issue</h3>
                <p className="text-sm text-gray-500">Submit a maintenance request</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </Card>
        </Link>
        <Link href="/tenant/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-navy-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center">
                <Wrench className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Requests</h3>
                <p className="text-sm text-gray-500">{openOrders.length} open · {myOrders.length} total</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      {myOrders.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Requests</CardTitle>
            <Link
              href="/tenant/orders"
              className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {myOrders.slice(0, 3).map((wo) => (
              <div key={wo.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{wo.issue_title}</p>
                  <p className="text-xs text-gray-500">
                    {wo.room} · {wo.category} · {new Date(wo.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <PriorityBadge priority={wo.priority} />
                  <StatusBadge status={wo.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
