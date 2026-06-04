import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRightLeft, CheckCircle2, Database, RotateCcw, Shield } from 'lucide-react';
import { LabFrame } from './LabFrame';

type StepStatus = 'idle' | 'done' | 'failed' | 'rolled-back';

interface AccountState {
    wallet: number;
    inventory: number;
}

const INITIAL_STATE: AccountState = {
    wallet: 120,
    inventory: 8,
};

export const TransactionLab = () => {
    const [withTransaction, setWithTransaction] = useState(true);
    const [shouldFailOnInventory, setShouldFailOnInventory] = useState(true);
    const [state, setState] = useState<AccountState>(INITIAL_STATE);
    const [walletStep, setWalletStep] = useState<StepStatus>('idle');
    const [inventoryStep, setInventoryStep] = useState<StepStatus>('idle');
    const [timeline, setTimeline] = useState<string[]>([
        'Ready. Run the checkout flow to compare partial success vs rollback protection.',
    ]);

    const outcome = useMemo(() => {
        if (inventoryStep === 'failed' && !withTransaction) {
            return 'Broken state: payment was deducted, but inventory was not reserved.';
        }

        if (inventoryStep === 'rolled-back') {
            return 'Safe state: the failed inventory step triggered a rollback, so no user money was lost.';
        }

        if (walletStep === 'done' && inventoryStep === 'done') {
            return 'Success: both operations committed together.';
        }

        return 'Transactions matter when multiple business updates must succeed as one unit.';
    }, [inventoryStep, walletStep, withTransaction]);

    const appendLog = (message: string) => {
        setTimeline(prev => [message, ...prev].slice(0, 8));
    };

    const reset = () => {
        setState(INITIAL_STATE);
        setWalletStep('idle');
        setInventoryStep('idle');
        setTimeline(['State reset. Choose failure mode and run the checkout flow again.']);
    };

    const runFlow = async () => {
        reset();

        const original = INITIAL_STATE;
        appendLog('Checkout started. Step 1: deduct wallet balance.');

        const afterWallet = {
            ...original,
            wallet: original.wallet - 40,
        };

        setState(afterWallet);
        setWalletStep('done');

        await new Promise(resolve => setTimeout(resolve, 500));

        appendLog('Step 2: reserve inventory.');

        if (shouldFailOnInventory) {
            setInventoryStep('failed');
            appendLog('Inventory reservation failed due to stale stock count.');

            if (withTransaction) {
                await new Promise(resolve => setTimeout(resolve, 500));
                setState(original);
                setWalletStep('rolled-back');
                setInventoryStep('rolled-back');
                appendLog('Transaction rollback restored wallet and inventory to the original state.');
            }

            return;
        }

        setState({
            ...afterWallet,
            inventory: afterWallet.inventory - 1,
        });
        setInventoryStep('done');
        appendLog('Inventory reserved successfully. Commit transaction.');
    };

    return (
        <LabFrame className="relative min-h-[480px] md:min-h-[600px] w-full" icon={Database} title="Transaction Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Database className="text-emerald-400" />
                        Transaction Rollback Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare a checkout flow with and without transaction protection when the second write fails.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 transition-colors hover:bg-white/10"
                >
                    <RotateCcw size={14} className="mr-2 inline" />
                    Reset
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Flow Mode</p>
                        <div className="mt-4 grid gap-3">
                            <button
                                type="button"
                                onClick={() => setWithTransaction(true)}
                                className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                    withTransaction ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/8 bg-black/20'
                                }`}
                            >
                                <p className="text-xs font-bold text-white">With Transaction</p>
                                <p className="mt-1 text-[11px] text-gray-400">Rollback protects consistency if a later step fails.</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setWithTransaction(false)}
                                className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                    !withTransaction ? 'border-amber-400/40 bg-amber-500/10' : 'border-white/8 bg-black/20'
                                }`}
                            >
                                <p className="text-xs font-bold text-white">Without Transaction</p>
                                <p className="mt-1 text-[11px] text-gray-400">Partial success can leak into user-visible broken state.</p>
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Failure Injection</p>
                        <button
                            type="button"
                            onClick={() => setShouldFailOnInventory(prev => !prev)}
                            className={`mt-4 w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                shouldFailOnInventory ? 'border-red-400/35 bg-red-500/10' : 'border-blue-400/35 bg-blue-500/10'
                            }`}
                        >
                            <p className="text-xs font-bold text-white">
                                {shouldFailOnInventory ? 'Inventory write will fail' : 'Inventory write will succeed'}
                            </p>
                            <p className="mt-1 text-[11px] text-gray-400">
                                Toggle to compare happy path versus rollback path.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={runFlow}
                            className="mt-4 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition-all hover:bg-emerald-400"
                        >
                            Run Checkout Flow
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <StateCard
                            title="Wallet Balance"
                            value={`$${state.wallet}`}
                            status={walletStep}
                            icon={Shield}
                        />
                        <StateCard
                            title="Inventory Stock"
                            value={`${state.inventory} left`}
                            status={inventoryStep}
                            icon={ArrowRightLeft}
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            Outcome
                        </p>
                        <p className="mt-3 text-sm font-semibold leading-7 text-gray-200">{outcome}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            Timeline
                        </p>
                        <div className="mt-4 space-y-2">
                            {timeline.map(item => (
                                <div key={item} className="rounded-2xl border border-white/6 bg-white/4 px-3 py-2 text-xs text-gray-300">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

const StateCard = ({
    title,
    value,
    status,
    icon: Icon,
}: {
    title: string;
    value: string;
    status: StepStatus;
    icon: typeof Database;
}) => {
    const accent =
        status === 'done'
            ? 'text-green-300'
            : status === 'failed'
                ? 'text-red-300'
                : status === 'rolled-back'
                    ? 'text-amber-300'
                    : 'text-gray-300';

    const StatusIcon =
        status === 'failed' ? AlertTriangle : status === 'done' ? CheckCircle2 : status === 'rolled-back' ? RotateCcw : Icon;

    return (
        <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                <StatusIcon size={14} className={accent} />
                <span>{title}</span>
            </div>
            <p className={`mt-3 text-3xl font-black ${accent}`}>{value}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-gray-500">{status.replace('-', ' ')}</p>
        </div>
    );
};
