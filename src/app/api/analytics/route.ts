const salesData = {
    "7d": [
        { date: "10/16", revenue: 1200000 },
        { date: "10/17", revenue: 1800000 },
        { date: "10/18", revenue: 1500000 },
        { date: "10/19", revenue: 2200000 },
        { date: "10/20", revenue: 1900000 },
        { date: "10/21", revenue: 2500000 },
        { date: "10/22", revenue: 2100000 },
    ],
    "30d": [
        { date: "1주차", revenue: 8500000 },
        { date: "2주차", revenue: 11200000 },
        { date: "3주차", revenue: 9800000 },
        { date: "4주차", revenue: 13500000 },
    ],
    "90d": [
        { date: "8월", revenue: 32000000 },
        { date: "9월", revenue: 38500000 },
        { date: "10월", revenue: 42000000 },
    ],
};

const previousSalesData = {
    "7d": [
        { date: "1일차", revenue: 1000000 },
        { date: "2일차", revenue: 1400000 },
        { date: "3일차", revenue: 1300000 },
        { date: "4일차", revenue: 1600000 },
        { date: "5일차", revenue: 1400000 },
        { date: "6일차", revenue: 1700000 },
        { date: "7일차", revenue: 1600000 },
    ],
    "30d": [
        { date: "1주차", revenue: 8000000 },
        { date: "2주차", revenue: 9500000 },
        { date: "3주차", revenue: 10000000 },
        { date: "4주차", revenue: 10500000 },
    ],
    "90d": [
        { date: "1개월차", revenue: 28000000 },
        { date: "2개월차", revenue: 32000000 },
        { date: "3개월차", revenue: 35000000 },
    ],
};

type Period = "7d" | "30d" | "90d";

const previousRevenueData: Record<Period, number> = {
    "7d": 10000000,
    "30d": 38000000,
    "90d": 95000000,
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const period = searchParams.get("period") ?? "7d";

    if (period !== "7d" && period !== "30d" && period !== "90d") {
        return Response.json(
            { message: "지원하지 않는 기간입니다." },
            { status: 400 }
        )
    }

    const selectedPeriod: Period = period;

    return Response.json({
        period: period,
        sales: salesData[selectedPeriod],
        previousSales: previousSalesData[selectedPeriod],
        previousTotalRevenue:previousRevenueData[selectedPeriod]
    });
}