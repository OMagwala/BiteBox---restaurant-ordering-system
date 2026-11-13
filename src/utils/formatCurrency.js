const currencyFormatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
    return currencyFormatter.format(amount);
}