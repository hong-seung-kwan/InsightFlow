interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export default function TableSkeleton({
    rows = 5,
    columns = 4,
}: TableSkeletonProps) {
    return (
        <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
            {Array.from({ length: rows + 1 }, (_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex gap-4 border-b border-slate-100 p-4 last:border-b-0"
                >
                    {Array.from({ length: columns }, (_, cellIndex) => (
                        <div
                            key={cellIndex}
                            className={`h-4 flex-1 rounded ${rowIndex === 0 ? "bg-slate-200" : "bg-slate-100"
                                }`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}