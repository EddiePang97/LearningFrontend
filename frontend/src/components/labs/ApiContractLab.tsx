import { useMemo, useState } from 'react';
import { AlertTriangle, BadgeCheck, FileJson, ServerCrash } from 'lucide-react';
import { LabFrame } from './LabFrame';

type Scenario = 'created' | 'validation' | 'not-found' | 'conflict';

const SCENARIOS: Array<{ id: Scenario; label: string; hint: string }> = [
    { id: 'created', label: 'Create Success', hint: 'Course creation succeeds and returns a new resource.' },
    { id: 'validation', label: 'Validation Error', hint: 'Input is missing a required title field.' },
    { id: 'not-found', label: 'Resource Missing', hint: 'Client requested a lesson that does not exist.' },
    { id: 'conflict', label: 'State Conflict', hint: 'Client attempts to create a duplicate slug.' },
];

export const ApiContractLab = () => {
    const [scenario, setScenario] = useState<Scenario>('created');

    const result = useMemo(() => {
        switch (scenario) {
            case 'validation':
                return {
                    status: '400 Bad Request',
                    accent: 'text-amber-300',
                    body: `{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "title is required",
    "details": [{ "field": "title", "reason": "required" }]
  }
}`,
                    takeaway: 'Field-level validation should return a structured, machine-readable payload instead of a random string.',
                };
            case 'not-found':
                return {
                    status: '404 Not Found',
                    accent: 'text-red-300',
                    body: `{
  "error": {
    "code": "LESSON_NOT_FOUND",
    "message": "lesson 42 does not exist"
  }
}`,
                    takeaway: 'Not found is different from invalid input. Clients need a separate signal for missing resources.',
                };
            case 'conflict':
                return {
                    status: '409 Conflict',
                    accent: 'text-orange-300',
                    body: `{
  "error": {
    "code": "SLUG_CONFLICT",
    "message": "course slug already exists"
  }
}`,
                    takeaway: 'Conflicts happen when the request is valid but clashes with current system state.',
                };
            default:
                return {
                    status: '201 Created',
                    accent: 'text-green-300',
                    body: `{
  "data": {
    "id": "course_123",
    "title": "Backend Fundamentals",
    "slug": "backend-fundamentals"
  }
}`,
                    takeaway: 'A creation endpoint should signal success clearly and return the new resource shape or location.',
                };
        }
    }, [scenario]);

    return (
        <LabFrame className="relative min-h-[480px] md:min-h-[600px] w-full" icon={FileJson} title="API Contract Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <FileJson className="text-cyan-400" />
                        API Contract Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between success and failure scenarios to see how status codes and response bodies should stay predictable.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-white/4 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Scenario</p>
                    <div className="mt-4 space-y-3">
                        {SCENARIOS.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setScenario(item.id)}
                                className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                    scenario === item.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                }`}
                            >
                                <p className="text-xs font-bold text-white">{item.label}</p>
                                <p className="mt-1 text-[11px] text-gray-400">{item.hint}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            {scenario === 'created' ? <BadgeCheck size={14} /> : scenario === 'validation' ? <AlertTriangle size={14} /> : <ServerCrash size={14} />}
                            <span>HTTP Status</span>
                        </div>
                        <p className={`mt-3 text-2xl font-black ${result.accent}`}>{result.status}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">Response Body</p>
                        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-white/4 p-4 text-[11px] leading-6 text-gray-200">
                            {result.body}
                        </pre>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Contract Takeaway</p>
                        <p className="mt-3 text-sm leading-7 text-gray-200">{result.takeaway}</p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
