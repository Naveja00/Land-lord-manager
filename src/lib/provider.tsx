'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { AppContext } from './store';
import type {
  Profile,
  Building,
  UnitTemplate,
  Unit,
  ResponsibilityMatrix,
  WorkOrder,
  BuildingStaff,
} from '@/types/database';
import {
  demoUsers,
  demoBuildings,
  demoTemplates,
  demoUnits,
  demoResponsibility,
  demoWorkOrders,
  demoBuildingStaff,
} from './demo-data';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(demoUsers[0]);
  const [profiles] = useState<Profile[]>(demoUsers);
  const [buildings, setBuildings] = useState<Building[]>(demoBuildings);
  const [templates, setTemplates] = useState<UnitTemplate[]>(demoTemplates);
  const [units, setUnits] = useState<Unit[]>(demoUnits);
  const [responsibilities, setResponsibilities] = useState<ResponsibilityMatrix[]>(demoResponsibility);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(demoWorkOrders);
  const [buildingStaff] = useState<BuildingStaff[]>(demoBuildingStaff);

  const addBuilding = useCallback((building: Building) => {
    setBuildings((prev) => [...prev, building]);
  }, []);

  const updateBuilding = useCallback((id: string, updates: Partial<Building>) => {
    setBuildings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b))
    );
  }, []);

  const deleteBuilding = useCallback((id: string) => {
    setBuildings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addTemplate = useCallback((template: UnitTemplate) => {
    setTemplates((prev) => [...prev, template]);
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<UnitTemplate>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addUnit = useCallback((unit: Unit) => {
    setUnits((prev) => [...prev, unit]);
  }, []);

  const addUnits = useCallback((newUnits: Unit[]) => {
    setUnits((prev) => [...prev, ...newUnits]);
  }, []);

  const updateUnit = useCallback((id: string, updates: Partial<Unit>) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u))
    );
  }, []);

  const deleteUnit = useCallback((id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const updateResponsibility = useCallback((buildingId: string, updates: Partial<ResponsibilityMatrix>) => {
    setResponsibilities((prev) => {
      const existing = prev.find((r) => r.building_id === buildingId);
      if (existing) {
        return prev.map((r) =>
          r.building_id === buildingId
            ? { ...r, ...updates, updated_at: new Date().toISOString() }
            : r
        );
      }
      const newResp: ResponsibilityMatrix = {
        id: `resp-${Date.now()}`,
        building_id: buildingId,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates,
      };
      return [...prev, newResp];
    });
  }, []);

  const addWorkOrder = useCallback((order: WorkOrder) => {
    setWorkOrders((prev) => [...prev, order]);
  }, []);

  const updateWorkOrder = useCallback((id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, ...updates, updated_at: new Date().toISOString() } : wo))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        profiles,
        buildings,
        templates,
        units,
        responsibilities,
        workOrders,
        buildingStaff,
        setCurrentUser,
        addBuilding,
        updateBuilding,
        deleteBuilding,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        addUnit,
        addUnits,
        updateUnit,
        deleteUnit,
        updateResponsibility,
        addWorkOrder,
        updateWorkOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
