import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface GrowthRateCardProps {
    title: string;
    growthRate: number | null;
    isPending: boolean;
    isError: boolean;
}

export default function GrowthRateCard({
    title,
    growthRate,
    isPending,
    isError,
}: GrowthRateCardProps) {
    const colorClass =
        growthRate === null
            ? "text-slate-500"
            : growthRate > 0
                ? "text-green-600"
                : growthRate < 0
                    ? "text-red-600"
                    : "text-slate-600";
    const showIcon = !isPending && !isError && growthRate !== null;

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm text-slate-500">{title}</h3>

            <div className="mt-2 flex items-center gap-2">
                {showIcon && (
                    growthRate > 0 ? (
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : growthRate < 0 ? (
                        <TrendingDown className="h-6 w-6 text-red-600" />
                    ) : (
                        <Minus className="h-6 w-6 text-slate-600" />
                    )
                )}

                <p className={`text-2xl font-bold ${colorClass}`}>
                    {isPending
                        ? "불러오는 중..."
                        : isError
                            ? "조회 실패"
                            : growthRate === null
                                ? "비교 데이터 없음"
                                : `${growthRate > 0 ? "+" : ""}${growthRate.toFixed(1)}%`}
                </p>
            </div>
        </div>
    )
}