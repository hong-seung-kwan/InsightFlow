interface KpiCardProps {
    title: string;
    value: string;
}

export default function KpiCard({title,value}: KpiCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="font-bold text-2xl mt-2">{value}</p>
        </div>
    )
}