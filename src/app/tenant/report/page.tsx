'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/store';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { issueLogicTree } from '@/lib/demo-data';
import type { RoomOption, CategoryOption, IssueOption, WorkOrder } from '@/types/database';
import {
  ChefHat,
  Bath,
  Sofa,
  Bed,
  DoorOpen,
  Droplets,
  Zap,
  Thermometer,
  Bug,
  Lock,
  AlertTriangle,
  Refrigerator,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Send,
} from 'lucide-react';

const roomIcons: Record<string, React.ElementType> = {
  ChefHat,
  Bath,
  Sofa,
  Bed,
  DoorOpen,
};

const categoryIcons: Record<string, React.ElementType> = {
  Droplets,
  Zap,
  Thermometer,
  Bug,
  Lock,
  AlertTriangle,
  Refrigerator,
};

type Step = 'room' | 'category' | 'issue' | 'troubleshoot' | 'confirm' | 'submitted';

export default function ReportIssuePage() {
  const router = useRouter();
  const { currentUser, units, buildings, buildingStaff, addWorkOrder } = useAppState();

  const [step, setStep] = useState<Step>('room');
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueOption | null>(null);
  const [troubleshootingIndex, setTroubleshootingIndex] = useState(0);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const myUnit = units.find((u) => u.tenant_id === currentUser.id);
  const myBuilding = myUnit ? buildings.find((b) => b.id === myUnit.building_id) : null;

  const handleSelectRoom = (room: RoomOption) => {
    setSelectedRoom(room);
    setStep('category');
  };

  const handleSelectCategory = (category: CategoryOption) => {
    setSelectedCategory(category);
    setStep('issue');
  };

  const handleSelectIssue = (issue: IssueOption) => {
    setSelectedIssue(issue);
    if (issue.troubleshooting && issue.troubleshooting.length > 0) {
      setTroubleshootingIndex(0);
      setStep('troubleshoot');
    } else {
      setStep('confirm');
    }
  };

  const handleTroubleshootComplete = () => {
    setStep('confirm');
  };

  const handleNextTroubleshoot = () => {
    if (
      selectedIssue?.troubleshooting &&
      troubleshootingIndex < selectedIssue.troubleshooting.length - 1
    ) {
      setTroubleshootingIndex(troubleshootingIndex + 1);
    } else {
      handleTroubleshootComplete();
    }
  };

  const handleSubmit = () => {
    if (!myUnit || !myBuilding || !selectedRoom || !selectedCategory || !selectedIssue) return;

    // Automatic routing: check if building has maintenance staff
    const staff = buildingStaff.filter((bs) => bs.building_id === myBuilding.id);
    const assignedTo = staff.length > 0 ? staff[0].staff_id : myBuilding.landlord_id;

    const newOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      building_id: myBuilding.id,
      unit_id: myUnit.id,
      reported_by: currentUser.id,
      assigned_to: assignedTo,
      room: selectedRoom.name,
      category: selectedCategory.name.toLowerCase(),
      issue_title: selectedIssue.title,
      issue_description: additionalNotes || selectedIssue.description,
      troubleshooting_completed: !!(selectedIssue.troubleshooting && selectedIssue.troubleshooting.length > 0),
      troubleshooting_steps: selectedIssue.troubleshooting
        ? selectedIssue.troubleshooting.map((t) => t.instruction).join('; ')
        : null,
      status: 'open',
      priority: 'medium',
      estimated_cost: null,
      actual_cost: null,
      receipt_image_url: null,
      expense_category: null,
      landlord_responsible: true,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addWorkOrder(newOrder);
    setStep('submitted');
  };

  const goBack = () => {
    switch (step) {
      case 'category':
        setStep('room');
        setSelectedRoom(null);
        break;
      case 'issue':
        setStep('category');
        setSelectedCategory(null);
        break;
      case 'troubleshoot':
        setStep('issue');
        setSelectedIssue(null);
        break;
      case 'confirm':
        if (selectedIssue?.troubleshooting && selectedIssue.troubleshooting.length > 0) {
          setStep('troubleshoot');
        } else {
          setStep('issue');
          setSelectedIssue(null);
        }
        break;
    }
  };

  if (!myUnit || !myBuilding) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
        <Card>
          <p className="text-center text-gray-500 py-8">
            You need to be assigned to a unit before reporting issues.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        {step !== 'room' && step !== 'submitted' && (
          <button
            onClick={goBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
          <p className="text-sm text-gray-500">
            Unit #{myUnit.unit_number} · {myBuilding.name}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      {step !== 'submitted' && (
        <div className="flex items-center gap-2">
          {['room', 'category', 'issue', 'troubleshoot', 'confirm'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  s === step
                    ? 'bg-navy-600 w-4'
                    : ['room', 'category', 'issue', 'troubleshoot', 'confirm'].indexOf(step) > i
                    ? 'bg-navy-400'
                    : 'bg-gray-200'
                } transition-all rounded-full`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Select Room */}
      {step === 'room' && (
        <div>
          <CardTitle className="mb-4">Where is the issue?</CardTitle>
          <div className="grid grid-cols-2 gap-3">
            {issueLogicTree.map((room) => {
              const IconComponent = roomIcons[room.icon] || DoorOpen;
              return (
                <button
                  key={room.name}
                  onClick={() => handleSelectRoom(room)}
                  className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-navy-400 hover:shadow-md transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-navy-50 flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-navy-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{room.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Select Category */}
      {step === 'category' && selectedRoom && (
        <div>
          <CardTitle className="mb-1">What type of issue?</CardTitle>
          <p className="text-sm text-gray-500 mb-4">Room: {selectedRoom.name}</p>
          <div className="grid grid-cols-2 gap-3">
            {selectedRoom.categories.map((cat) => {
              const IconComponent = categoryIcons[cat.icon] || AlertTriangle;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleSelectCategory(cat)}
                  className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-navy-400 hover:shadow-md transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Select Issue */}
      {step === 'issue' && selectedCategory && (
        <div>
          <CardTitle className="mb-1">What&apos;s the issue?</CardTitle>
          <p className="text-sm text-gray-500 mb-4">
            {selectedRoom?.name} → {selectedCategory.name}
          </p>
          <div className="space-y-3">
            {selectedCategory.issues.map((issue) => (
              <button
                key={issue.title}
                onClick={() => handleSelectIssue(issue)}
                className="w-full text-left p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-navy-400 hover:shadow-md transition-all"
              >
                <p className="font-medium text-gray-900">{issue.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{issue.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Troubleshooting Buffer */}
      {step === 'troubleshoot' && selectedIssue?.troubleshooting && (
        <div>
          <Card className="border-2 border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-amber-800">Try This First</CardTitle>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              Step {troubleshootingIndex + 1} of {selectedIssue.troubleshooting.length}
            </p>
            <div className="bg-white rounded-lg p-4 mt-3 border border-amber-200">
              <p className="text-gray-900 font-medium">
                {selectedIssue.troubleshooting[troubleshootingIndex].instruction}
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleNextTroubleshoot}
                className="w-full justify-center"
              >
                <XCircle className="w-4 h-4" />
                I tried this and it didn&apos;t work
              </Button>
              {troubleshootingIndex === (selectedIssue.troubleshooting?.length ?? 0) - 1 && (
                <p className="text-xs text-center text-gray-500">
                  This will allow you to submit a maintenance ticket
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Step 5: Confirm & Submit */}
      {step === 'confirm' && (
        <div>
          <CardTitle className="mb-4">Confirm Your Request</CardTitle>
          <Card className="mb-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Room</span>
                <span className="font-medium">{selectedRoom?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{selectedCategory?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Issue</span>
                <span className="font-medium">{selectedIssue?.title}</span>
              </div>
              {selectedIssue?.troubleshooting && selectedIssue.troubleshooting.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Troubleshooting</span>
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3 mr-1" /> Completed
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          <Textarea
            label="Additional Notes (optional)"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any extra details about the issue..."
            rows={3}
          />

          <Button onClick={handleSubmit} className="w-full mt-4">
            <Send className="w-4 h-4" /> Submit Maintenance Request
          </Button>
        </div>
      )}

      {/* Step 6: Submitted */}
      {step === 'submitted' && (
        <Card className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted</h2>
          <p className="text-gray-500 mb-6">
            Your maintenance request has been submitted and routed to the appropriate person.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button onClick={() => router.push('/tenant/orders')}>
              View My Requests
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setStep('room');
                setSelectedRoom(null);
                setSelectedCategory(null);
                setSelectedIssue(null);
                setAdditionalNotes('');
              }}
            >
              Report Another Issue
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
