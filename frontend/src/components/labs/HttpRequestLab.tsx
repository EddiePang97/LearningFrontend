import { useMemo, useState } from 'react';
import { FileJson, Globe, ShieldAlert, SquareArrowOutUpRight } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Scenario = 'get-courses' | 'create-course' | 'invalid-json' | 'missing-auth';

const SCENARIOS: Array<{ id: Scenario; label: string; note: string }> = [
    { id: 'get-courses', label: 'GET course list', note: 'Simple read request with query string and predictable JSON response.' },
    { id: 'create-course', label: 'POST create course', note: 'Write request with JSON body that creates a new resource.' },
    { id: 'invalid-json', label: 'POST malformed body', note: 'Client sends a broken payload the server cannot safely accept.' },
    { id: 'missing-auth', label: 'DELETE without auth', note: 'Dangerous action is attempted without a valid Authorization header.' },
];

const RESULT_MAP: Record<Scenario, {
    requestLine: string;
    headers: string[];
    body: string;
    responseStatus: string;
    responseBody: string;
    takeaway: string;
    tone: 'emerald' | 'violet' | 'amber';
}> = {
    'get-courses': {
        requestLine: 'GET /api/courses?level=backend&page=1',
        headers: ['Accept: application/json', 'X-Request-Id: req_1842'],
        body: 'No request body',
        responseStatus: '200 OK',
        responseBody: `{
  "data": [
    { "id": "course_1", "title": "Backend Basics" },
    { "id": "course_2", "title": "Redis in Practice" }
  ],
  "page": 1
}`,
        takeaway: 'Read requests usually lean on method, path, and query string. The response body should still be structured enough for pagination and rendering.',
        tone: 'emerald',
    },
    'create-course': {
        requestLine: 'POST /api/courses',
        headers: ['Content-Type: application/json', 'Authorization: Bearer eyJ...', 'X-Request-Id: req_2048'],
        body: `{
  "title": "Storage Systems",
  "slug": "storage-systems"
}`,
        responseStatus: '201 Created',
        responseBody: `{
  "data": {
    "id": "course_88",
    "title": "Storage Systems",
    "slug": "storage-systems"
  }
}`,
        takeaway: 'Create requests combine method, path, headers, and a JSON body. A 201 response signals that the server accepted the input and produced a new resource.',
        tone: 'violet',
    },
    'invalid-json': {
        requestLine: 'POST /api/courses',
        headers: ['Content-Type: application/json', 'X-Request-Id: req_2201'],
        body: `{
  "title": "Broken Payload",
  "slug": "missing-quote
}`,
        responseStatus: '400 Bad Request',
        responseBody: `{
  "error": {
    "code": "INVALID_JSON",
    "message": "request body could not be parsed"
  }
}`,
        takeaway: 'The server cannot run business logic until the payload is parseable. Broken syntax is a request-shape problem, not a domain problem.',
        tone: 'amber',
    },
    'missing-auth': {
        requestLine: 'DELETE /api/courses/course_88',
        headers: ['Accept: application/json', 'X-Request-Id: req_3010'],
        body: 'No request body',
        responseStatus: '401 Unauthorized',
        responseBody: `{
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "missing bearer token"
  }
}`,
        takeaway: 'Headers are not decoration. They often carry identity and protocol metadata the backend needs before it can even decide whether a route is allowed.',
        tone: 'amber',
    },
};

export const HttpRequestLab = () => {
    const [scenario, setScenario] = useState<Scenario>('get-courses');
    const result = useMemo(() => RESULT_MAP[scenario], [scenario]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Globe} title="HTTP Request Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Globe className="text-cyan-400" />
                        HTTP Request And Response Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between read, write, malformed, and unauthorized scenarios to see how method, path, headers, body, and status code work together.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Scenario</p>
                        <div className="mt-4 space-y-3">
                            {SCENARIOS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setScenario(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        scenario === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Method + Path" value={result.requestLine} tone="cyan" />
                        <LabMetricCard label="Response Status" value={result.responseStatus} tone={result.tone} />
                        <LabMetricCard label="Request Body" value={result.body === 'No request body' ? 'optional' : 'present'} tone="violet" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.02fr_0.98fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <SquareArrowOutUpRight size={14} />
                                <span>Incoming Request</span>
                            </div>
                            <div className="mt-4 rounded-2xl border border-white/8 bg-white/4 p-4 text-[11px] leading-6 text-gray-200">
                                <div className="font-bold text-white">{result.requestLine}</div>
                                <div className="mt-3 space-y-1">
                                    {result.headers.map(header => (
                                        <div key={header}>{header}</div>
                                    ))}
                                </div>
                                <div className="mt-4 rounded-xl border border-white/6 bg-black/20 p-3 text-[11px] text-gray-300 whitespace-pre-wrap">
                                    {result.body}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                                <FileJson size={14} />
                                <span>Outgoing Response</span>
                            </div>
                            <div className="mt-4 rounded-2xl border border-white/8 bg-white/4 p-4 text-[11px] leading-6 text-gray-200">
                                <div className="font-bold text-white">{result.responseStatus}</div>
                                <div className="mt-4 rounded-xl border border-white/6 bg-black/20 p-3 text-[11px] text-gray-300 whitespace-pre-wrap">
                                    {result.responseBody}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabMiniCard
                            title="Request Shape Matters"
                            tone="sky"
                            body="Before business logic starts, the backend already cares about method, path, headers, and whether the body can be parsed safely."
                        />
                        <LabMiniCard
                            title="Response Shape Matters Too"
                            tone="violet"
                            body="Status code and JSON body are both part of the contract. Clients should not have to guess what happened from an unstructured string."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <ShieldAlert size={14} />
                            <span>Why This Teaches The Right Thing</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            {result.takeaway}
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
