export type Room = 'Kitchen' | 'Bathroom' | 'Living Room' | 'Bedroom';
export type Category = 'Electrical' | 'Plumbing' | 'Appliance';

type IssueOption = {
  issue: string;
  troubleshootingTip: string;
  needsConfirmation: boolean;
};

export const logicTree: Record<Room, Record<Category, IssueOption[]>> = {
  Kitchen: {
    Electrical: [
      {
        issue: 'No Power',
        troubleshootingTip: 'Check the breaker panel and reset the kitchen GFCI outlet.',
        needsConfirmation: true
      }
    ],
    Plumbing: [
      {
        issue: 'Sink Leak',
        troubleshootingTip: 'Tighten the trap connection under the sink and check for active drips.',
        needsConfirmation: true
      }
    ],
    Appliance: [
      {
        issue: 'Fridge Not Cooling',
        troubleshootingTip: 'Verify temperature dial and clear condenser vents.',
        needsConfirmation: true
      }
    ]
  },
  Bathroom: {
    Electrical: [
      {
        issue: 'Vanity Light Out',
        troubleshootingTip: 'Replace bulb and test GFCI reset button.',
        needsConfirmation: true
      }
    ],
    Plumbing: [
      {
        issue: 'Toilet Running',
        troubleshootingTip: 'Open tank lid and confirm flapper is seated.',
        needsConfirmation: true
      }
    ],
    Appliance: []
  },
  'Living Room': {
    Electrical: [
      {
        issue: 'Outlet Not Working',
        troubleshootingTip: 'Test outlet reset and check neighboring breakers.',
        needsConfirmation: true
      }
    ],
    Plumbing: [],
    Appliance: []
  },
  Bedroom: {
    Electrical: [
      {
        issue: 'No Heat from PTAC',
        troubleshootingTip: 'Confirm thermostat mode is HEAT and filter is not clogged.',
        needsConfirmation: true
      }
    ],
    Plumbing: [],
    Appliance: []
  }
};
