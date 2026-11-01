export function formatCurrency(
    amount: number,
    currencyCode:string
) {
    return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: currencyCode,
    }).format(amount);
}