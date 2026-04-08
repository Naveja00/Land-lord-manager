'use client';

import { createContext, useContext } from 'react';
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

// =============================================
// App State
// =============================================
export interface AppState {
  currentUser: Profile;
  profiles: Profile[];
  buildings: Building[];
  templates: UnitTemplate[];
  units: Unit[];
  responsibilities: ResponsibilityMatrix[];
  workOrders: WorkOrder[];
  buildingStaff: BuildingStaff[];
  // Actions
  setCurrentUser: (user: Profile) => void;
  addBuilding: (building: Building) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  addTemplate: (template: UnitTemplate) => void;
  updateTemplate: (id: string, updates: Partial<UnitTemplate>) => void;
  deleteTemplate: (id: string) => void;
  addUnit: (unit: Unit) => void;
  addUnits: (units: Unit[]) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  updateResponsibility: (buildingId: string, updates: Partial<ResponsibilityMatrix>) => void;
  addWorkOrder: (order: WorkOrder) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
}

// =============================================
// Default state with demo data
// =============================================
export const defaultState: AppState = {
  currentUser: demoUsers[0], // landlord by default
  profiles: demoUsers,
  buildings: demoBuildings,
  templates: demoTemplates,
  units: demoUnits,
  responsibilities: demoResponsibility,
  workOrders: demoWorkOrders,
  buildingStaff: demoBuildingStaff,
  setCurrentUser: () => {},
  addBuilding: () => {},
  updateBuilding: () => {},
  deleteBuilding: () => {},
  addTemplate: () => {},
  updateTemplate: () => {},
  deleteTemplate: () => {},
  addUnit: () => {},
  addUnits: () => {},
  updateUnit: () => {},
  deleteUnit: () => {},
  updateResponsibility: () => {},
  addWorkOrder: () => {},
  updateWorkOrder: () => {},
};

export const AppContext = createContext<AppState>(defaultState);

export function useAppState() {
  return useContext(AppContext);
}
