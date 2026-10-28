import type { ReactNode } from "react";

interface KpiCardProps {
    title: string;
    value: string;
    icon?: ReactNode;
    color?: "blue" | "green" | "orange" | "red";
}

const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
}

export default function KpiCard({ title, value, icon, color = "blue", }: KpiCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                    {title}
                </p>

                {icon && (
                    <div className={`rounded-lg p-2 ${colorStyles[color]}`}>
                        {icon}
                    </div>
                )}
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
                {value}
            </p>
        </div>
    )
}