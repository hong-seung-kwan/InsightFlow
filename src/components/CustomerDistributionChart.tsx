import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Legend,
} from "recharts";

interface CustomerDistributionChartProps {
    totalCustomers: number;
    newCustomers: number;
}

export default function CustomerDistributionChart({
    totalCustomers,
    newCustomers,
}: CustomerDistributionChartProps) {
    const existingCustomers = totalCustomers - newCustomers;

    const chartData = [
        {
            name: "신규 고객",
            value: newCustomers,
            fill: "#3B82F6",
        },
        {
            name: "기존 고객",
            value: existingCustomers,
            fill: "#F97316",
        },
    ];

    return (
        <div className="h-80 rounded-xl border bg-white p-5">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({percent}) =>
                            `${((percent ?? 0) * 100).toFixed(1)}%`
                        }
                    />
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}