export default function KpiCardSkeleton() {
    return (
        <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-slate-200">
                    <div className="h-9 w-9 rounded-lg bg-slate-200" />
                </div>
            </div>
            <div className="mt-4 h-7 w-36 rounded bg-slate-200"/>
        </div>
    )
}