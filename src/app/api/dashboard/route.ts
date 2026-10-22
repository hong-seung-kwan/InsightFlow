export async function GET() {
    const kpiData = [
        { id: "revenue", title: "총매출", value: 12450000 },
        { id: "orders", title: "주문 수", value: 842 },
        { id: "visits", title: "방문 세션", value: 15420 },
        { id: "conversion", title: "전환율", value: 5.46 },
    ];

    return Response.json(kpiData);
}